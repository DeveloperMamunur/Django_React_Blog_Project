import { useEffect, useMemo, useState } from "react";
import { blogService } from "../../services/blogService";
import { categoryService } from "../../services/categoryService";
import { tagService } from "../../services/tagService";
import BlogModal from "../../components/modals/BlogModal";
import BlogDetailsModal from "../../components/modals/BlogDetailsModal";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import {
    isAdmin,
    isAuthor,
    canEditOrDeleteBlog,
    canTogglePublish
} from "../../utils/permissions";

import Pagination from "../../components/common/Pagination";
import { Search } from "lucide-react";

export default function Blog() {
    const { currentUser } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [detailsBlog, setDetailsBlog] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category_id: "",
        tag_ids: [],
        image: null,
    });

    const columns = [
        { key: "title", header: "Title" },
        { key: "category", header: "Category" },
        { key: "tags", header: "Tags" },
        { key: "content", header: "Content", truncate: 100 },
        { key: "image", header: "Image" },
        { key: "is_featured", header: "Featured" },
        { key: "is_active", header: "Status" },
        { key: "is_published", header: "Publish Status" },
        { key: "actions", header: "Actions" },
    ];

    const PAGE_SIZE = 4;

    // Fetch blogs with server-side filters
    const getBlogs = async (page = 1, search = "", category_id = 0) => {
        try {
            const data = await blogService.getAllBlogs(page, {
            search,
            category_id,
            });
            setBlogs(data.results);
            setCurrentPage(page);
            setTotalPages(Math.ceil(data.count / PAGE_SIZE));
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    const getCategories = async () => {
        const data = await categoryService.getCategoriesNoPagination();
        setCategories(data);
    };

    const getTags = async () => {
        const data = await tagService.getAllTagsNoPagination();
        setTags(data);
    };

    useEffect(() => {
        getCategories();
        getTags();
        getBlogs(1, searchTerm, selectedCategoryId);
    }, []);

    // Trigger refetch when filters change
    useEffect(() => {
        getBlogs(1, searchTerm, selectedCategoryId);
    }, [searchTerm, selectedCategoryId]);

    const sortedCategories = useMemo(() => {
        const activeCategories = categories.filter((c) => c.is_active);
        return [{ id: 0, name: "All" }, ...activeCategories.sort((a, b) => a.name.localeCompare(b.name))];
    }, [categories]);

    const onlyAdmin = isAdmin(currentUser);

    // Modal open/close
    const openBlogModal = (blog = null) => {
        if (blog) {
            setFormData({
                title: blog.title || "",
                content: blog.content || "",
                category_id: blog.category?.id || blog.category_id || "",
                tag_ids: blog.tags?.map(tag => tag.id) || blog.tag_ids || [],
                image: blog.image || null,
            });
            setEditingBlog(blog);
        } else {
            setFormData({
                title: "",
                content: "",
                category_id: "",
                tag_ids: [],
                image: null,
            });
            setEditingBlog(null);
        }
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);

    // Handle form submit
    const handleSubmit = async e => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);
        data.append("category_id", formData.category_id);
        formData.tag_ids.forEach(tagId => data.append("tag_ids", tagId));
        if (formData.image instanceof File) data.append("image", formData.image);

        try {
            if (editingBlog) {
                await blogService.updateBlog(editingBlog.id, data);
            } else {
                await blogService.createBlog(data);
            }
            closeModal();
            getBlogs();
        } catch (error) {
            console.error("Error saving blog:", error);
        }
    };

    // Delete blog
    const handleDelete = async blog => {
        if (!canEditOrDeleteBlog(currentUser, blog)) {
            alert("You do not have permission to delete this blog.");
            return;
        }
        if (window.confirm("Are you sure?")) {
            await blogService.deleteBlog(blog.id);
            getBlogs();
        }
    };

    // Toggle publish/unpublish
    const handlePublish = async blog => {
        if (!canTogglePublish(currentUser, blog)) {
            alert("You do not have permission to publish/unpublish this blog.");
            return;
        }
        setBlogs(prev =>
            prev.map(b => (b.id === blog.id ? { ...b, is_published: !b.is_published } : b))
        );
        try {
            await blogService.togglePublish(blog.id, { is_published: !blog.is_published });
        } catch (error) {
            console.error(error);
            setBlogs(prev =>
                prev.map(b => (b.id === blog.id ? { ...b, is_published: blog.is_published } : b))
            );
        }
    };

    // Toggle Feature
    const handleFeatured = async blog => {
        if (!canEditOrDeleteBlog(currentUser, blog)) {
            alert("Only the author or admin can feature this blog.");
            return;
        }
        setBlogs(prev =>
            prev.map(b => (b.id === blog.id ? { ...b, is_featured: !b.is_featured } : b))
        );
        try {
            await blogService.toggleFeatured(blog.id, { is_featured: !blog.is_featured });
        } catch (error) {
            console.error(error);
            setBlogs(prev =>
                prev.map(b => (b.id === blog.id ? { ...b, is_featured: blog.is_featured } : b))
            );
        }
    };

    // Toggle Status
    const handleStatus = async blog => {
        if (!canEditOrDeleteBlog(currentUser, blog)) {
            alert("Only the author or admin can change status.");
            return;
        }
        setBlogs(prev =>
            prev.map(b => (b.id === blog.id ? { ...b, is_active: !b.is_active } : b))
        );
        try {
            await blogService.toggleFeatured(blog.id, { is_active: !blog.is_active });
        } catch (error) {
            console.error(error);
            setBlogs(prev =>
                prev.map(b => (b.id === blog.id ? { ...b, is_active: blog.is_active } : b))
            );
        }
    };

    const openBlogDetailsModel = blog => {
        setDetailsBlog(blog);
        setDetailsOpen(true);
    };
    const closeBlogDetailsModel = () => {
        setDetailsBlog(null);
        setDetailsOpen(false);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Blog Management</h2>
                {(isAdmin(currentUser) || isAuthor(currentUser)) && (
                    <button
                        onClick={() => openBlogModal()}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        + New Blog
                    </button>
                )}
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 dark:text-slate-100"
                />
                </div>
                <div className="md:w-48">
                <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 font-medium cursor-pointer"
                    >
                        {sortedCategories?.map((category) => (
                            <option key={category.id} value={category.id}>
                            {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>


            <Table
                columns={columns}
                data={blogs}
                renderCell={(col, value, row) => {
                    if (col.key === "category") return row.category?.name || "-";
                    if (col.key === "tags") return row.tags?.map(t => t.name).join(", ") || "-";
                    if (col.key === "is_published") return row.is_published ? "Published" : "Unpublished";
                    if (col.key === "image")
                        return <img src={row.image} alt={row.title} className="w-20 h-20 object-cover" />;
                    if (col.key === "is_featured") 
                        return (
                            <Button
                                variant={row.is_featured ? "success" : "secondary"}
                                onClick={() => handleFeatured(row)}
                                disabled={!onlyAdmin}
                            >
                                {row.is_featured ? "✔ Featured" : "☆ Feature"}
                            </Button>
                        );
                    if (col.key === "is_active")
                        return (
                            <Button
                                variant={row.is_active ? "success" : "danger"}
                                onClick={() => handleStatus(row)}
                                disabled={!canEditOrDeleteBlog(currentUser, row)}
                            >
                                {row.is_active ? "✔ Active" : "❌ Inactive"}
                            </Button>
                        );
                    if (col.key === "actions") {
                        const canEditDelete = canEditOrDeleteBlog(currentUser, row);
                        return (
                            <div className="flex gap-2">
                                <Button variant="info" onClick={() => openBlogDetailsModel(row)}>
                                    View
                                </Button>
                                <Button variant="primary" onClick={() => openBlogModal(row)} disabled={!canEditDelete}>
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(row)} disabled={!canEditDelete}>
                                    Delete
                                </Button>
                                { onlyAdmin && (
                                    <Button
                                        variant={row.is_published ? "secondary" : "success"}
                                        onClick={() => handlePublish(row)}
                                        disabled={!onlyAdmin}
                                    >
                                        {row.is_published ? "Unpublished" : "Published"}
                                    </Button>
                                )}
                            </div>
                        );
                    }
                    return value;
                }}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => getBlogs(page)}
            />

            {/* Blog Modal */}
            <BlogModal
                modalOpen={modalOpen}
                closeModal={closeModal}
                handleSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                editingBlog={editingBlog}
                categories={categories}
                tags={tags}
            />

            {/* Blog Details Modal */}
            <BlogDetailsModal blog={detailsBlog} isOpen={detailsOpen} onClose={closeBlogDetailsModel} />
        </div>
    );
}
