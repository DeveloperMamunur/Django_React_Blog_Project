import Modal from "../common/Modal";
import FormField from "../common/FormField";
import Button from "../common/Button";

export default function CategoryModal({
    modalOpen,
    closeModal,
    handleSubmit,
    formData,
    setFormData,
    editingBlog,
}) {
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
                {/* name */}
                <FormField
                    label="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

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
