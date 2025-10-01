import { Link } from "react-router-dom";
import { categoryService } from "../../services/categoryService";
import { useEffect, useState } from "react";
import { isAdmin } from "../../utils/permissions";
import { useAuth } from "../../hooks/useAuth";
import CategoryModal from "../../components/modals/CategoryModal";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button"; // ✅ import added

export default function Category() {
    const { currentUser } = useAuth();
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "" });

    const onlyAdmin = isAdmin(currentUser);

    const columns = [
        { key: "name", header: "Name" },
        { key: "is_active", header: "Status" },
        { key: "actions", header: "Actions" },
    ];

    // Open modal
    const openCategoryModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name });
        } else {
            setEditingCategory(null);
            setFormData({ name: "" });
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: "" });
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, formData);
                alert("Category updated successfully!");
            } else {
                await categoryService.createCategory(formData);
                alert("Category created successfully!");
            }
            closeModal();
            getAllCategories();
        } catch (error) {
            console.error("Error submitting category:", error);
            alert("Failed to submit category. Please try again.");
        }
    };

    // Fetch all categories
    const getAllCategories = async () => {
        try {
            const categories = await categoryService.getAllCategories();
            setCategories(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await categoryService.deleteCategory(id);
                alert("Category deleted successfully!");
                getAllCategories();
            } catch (error) {
                console.error("Error deleting category:", error);
                alert("Failed to delete category. Please try again.");
            }
        }
    };

    const handleStatus = async (category) => {
        try {
            const updatedCategory = await categoryService.toggleStatus(category.id, {
                is_active: !category.is_active,
            });
            setCategories((prev) =>
                prev.map((cat) =>
                    cat.id === updatedCategory.id ? updatedCategory : cat
                )
            );
        } catch (error) {
            console.error("Error updating category status:", error);
            alert("Failed to update category status. Please try again.");
        }
    };

    useEffect(() => {
        getAllCategories();
    }, []);

    return (
        <div className="p-6">
            <div className="flex items-center justify-start gap-2 mb-10">
                <Link to={"/dashboard"}>📊</Link> /
                <span>Category</span>
            </div>
            <div className="flex items-center justify-between mb-6">
                <div className="w-full mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Category Management</h2>
                        {onlyAdmin && (
                            <button
                                onClick={() => openCategoryModal()}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                + New Category
                            </button>
                        )}
                    </div>

                    <div className="mt-6">
                        <h4 className="text-lg font-semibold">All Categories</h4>
                        <Table
                            columns={columns}
                            data={categories}
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
                                                onClick={() => openCategoryModal(row)}
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
                    </div>
                </div>
            </div>

            {/* Modal for Create/Edit */}
            <CategoryModal
                modalOpen={modalOpen}
                closeModal={closeModal}
                handleSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                editingCategory={editingCategory} // ✅ renamed for clarity
            />
        </div>
    );
}
