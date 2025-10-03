import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { tagService } from "../../services/tagService";
import { isAdmin } from "../../utils/permissions";
import { useAuth } from "../../hooks/useAuth";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";

export default function Tag(){
    const {currentUser} = useAuth();
    const [tags, setTags] = useState([]);
    const [editingTag, setEditingTag] = useState(null);
    const [name, setName] = useState("");
    const onlyAdmin = isAdmin(currentUser);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

     const columns = [
        { key: "name", header: "Name" },
        { key: "is_active", header: "Status" },
        { key: "actions", header: "Actions" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTag) {
                await tagService.updateTag(editingTag.id, { name });
                alert("Tag updated successfully!");
            } else {
                await tagService.createTag({ name });
                alert("Tag created successfully!");
            }
            setName("");            // clear input after submit
            setEditingTag(null); // reset edit mode
            getAllTags();
        } catch (error) {
            console.error("Error submitting tag:", error);
            alert("Failed to submit tag. Please try again.");
        }
    };

    const pageSize = 7;
    const getAllTags = async (page=1) => {
        const response = await tagService.getAllTags(page);
        setTags(response.results)
        setCurrentPage(page)
        setTotalPages(Math.ceil(response.count / pageSize));
    }

    const handleEdit = (tag) => {
        setEditingTag(tag);
        setName(tag.name);   // pre-fill input
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this tag?")){
            try {
                await tagService.deleteTag(id);
                alert("Tag deleted successfully!");
                getAllTags();
            } catch (error) {
                console.error("Error deleting tag:", error);
                alert("Failed to delete tag. Please try again.");
            }
        }
    }

    const handleStatus = async (tag) => {
            try {
                const updatedTag = await tagService.toggleStatus(tag.id, {
                    is_active: !tag.is_active,
                });
                setTags((prev) =>
                    prev.map((tag) =>
                        tag.id === updatedTag.id ? updatedTag : tag
                    )
                );
            } catch (error) {
                console.error("Error updating tag status:", error);
                alert("Failed to update tag status. Please try again.");
            }
        };

    useEffect(()=>{
        getAllTags();
    }, [])

    return (
        <div className="p-6">
            <div className="flex items-center justify-start gap-2 mb-10">
                <Link to={"/dashboard"}>📊</Link> /
                <span>Tags</span>
            </div>
            <div className="flex items-center justify-between mb-6">
                <div className="w-full mx-auto">
                    <h3 className="text-xl ">
                        {editingTag ? "Update Tag" : "Create Tag"}
                    </h3>

                    <form onSubmit={handleSubmit} className="mt-4 max-w-lg">
                        <div className="grid gap-3 mb-5">
                            <label htmlFor="name">Tag Name</label>
                            <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}   // controlled value
                            onChange={(e) => setName(e.target.value)}   // 🔥 fix
                            placeholder="Category Name"
                            className="mt-1 block w-full border-none outline-0 ring ring-gray-400 focus:ring-blue-500 focus:shadow-md rounded-md p-2 dark:focus:bg-gray-700"
                            required
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                            {editingTag ? "Update" : "Create"}
                        </button>
                    </form>

                    <div className="mt-6">
                        <h4 className="text-lg font-semibold">All Tags</h4>
                        <Table
                            columns={columns}
                            data={tags}
                            renderCell={(col, value, row) => {
                                if (col.key === "is_active")
                                    return (
                                        <Button
                                            variant={row.is_active ? "success" : "danger"}
                                            disabled={!onlyAdmin}
                                            onClick={() => handleStatus(row)}
                                        >
                                            {row.is_active ? "✔ Active" : "❌ Inactive"}
                                        </Button>
                                    );
                                if (col.key === "actions") {
                                    return (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="primary"
                                                onClick={() => handleEdit(row)}
                                                disabled={!onlyAdmin}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDelete(row.id)} // ✅ fix
                                                disabled={!onlyAdmin}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    );
                                }
                                return value;
                            }}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => getAllTags(page)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}