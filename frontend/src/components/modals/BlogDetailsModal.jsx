import React from "react";
import Modal from "../common/Modal"; // Assuming you have a generic Modal component
import Button from "../common/Button";

export default function BlogDetailsModal({ blog, isOpen, onClose }) {
  if (!blog) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Blog Details" modalSize="4xl">
      <div className="space-y-4">
        <table className="w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr  className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Name</th>
              <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-2 border border-gray-300 dark:border-gray-600">Title</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{blog.title}</td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-2 border border-gray-300 dark:border-gray-600">Category</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{blog.category?.name || "-"}</td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-2 border border-gray-300 dark:border-gray-600">Tags</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{blog.tags?.map((tag) => tag.name).join(", ") || "-"}</td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-2 border border-gray-300 dark:border-gray-600">Content</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{blog.content}</td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-2 border border-gray-300 dark:border-gray-600">Image</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">
                {blog.image && (
                  <div>
                    <h3 className="font-semibold text-lg">Image</h3>
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full max-w-xs h-auto object-cover rounded"
                    />
                  </div>
                )}
              </td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-2 border border-gray-300 dark:border-gray-600">Status</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">
                {blog.is_active ? "Active": "Inactive"}
              </td>
            </tr>
          </tbody>
        </table>
        {/* Close button */}
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
