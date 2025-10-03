import Modal from "../common/Modal";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import FormField from "../common/FormField";
import Button from "../common/Button";

export default function BlogModal({
    modalOpen,
    closeModal,
    handleSubmit,
    formData,
    setFormData,
    editingBlog,
    categories,
    tags,
}) {
    const { currentUser } = useAuth();
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (formData.image instanceof File) {
            setImagePreview(URL.createObjectURL(formData.image));
        } else if (formData.image && typeof formData.image === "string") {
            setImagePreview(formData.image);
        } else {
            setImagePreview(null);
        }
    }, [formData.image]);

    return (
        <Modal
            isOpen={modalOpen}
            onClose={closeModal}
            modalSize="2xl"
            title={editingBlog ? "Edit Blog" : "Create Blog"}
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
                encType="multipart/form-data"
            >
                {/* Title */}
                <FormField
                    label="Title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />

                {/* Author (auto-assigned in backend) */}
                <FormField
                    label="Author"
                    type="text"
                    value={currentUser?.username || ""}
                    disabled
                />

                {/* Category & Tags */}
                <div className="flex gap-2">
                    <FormField
                        label="Category"
                        type="select"
                        name="category_id"
                        value={formData.category_id}
                        onChange={(e) =>
                        setFormData({ ...formData, category_id: e.target.value })
                        }
                        options={categories}
                        required
                        className="dark:bg-gray-800"
                    />

                    <FormField
                        label="Tags"
                        type="select"
                        name="tag_ids"
                        value={formData.tag_ids}
                        multiple
                        onChange={(e) =>
                        setFormData({
                            ...formData,
                            tag_ids: Array.from(e.target.selectedOptions, (o) => o.value),
                        })
                        }
                        options={tags}
                    />
                </div>

                {/* Content */}
                <FormField
                    label="Content"
                    type="textarea"
                    name="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={4}
                />

                {/* Image Upload */}
                <FormField
                    label="Image"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files[0] })
                    }
                />
                {imagePreview && (
                    <div className="mt-2">
                        <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded"
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        {editingBlog ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Modal>

    );
}
