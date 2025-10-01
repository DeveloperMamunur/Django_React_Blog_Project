import React from "react";
import Modal from "../common/Modal"; // Assuming you have a generic Modal component
import Button from "../common/Button";

export default function UserDetailsModal({ user, isOpen, onClose }) {
  if (!user) return null;

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
              <td className="p-2 border border-gray-300 dark:border-gray-600">User Name</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{user.username}</td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-2 border border-gray-300 dark:border-gray-600">Role</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{user.role}</td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-2 border border-gray-300 dark:border-gray-600">Bio</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{user.bio}</td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-2 border border-gray-300 dark:border-gray-600">Email</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{user.email}</td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-2 border border-gray-300 dark:border-gray-600">Photo</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full max-w-xs h-auto object-cover rounded"
                  />
                )}
              </td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-2 border border-gray-300 dark:border-gray-600">Status</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">
                {user.is_active ? "Active": "Inactive"}
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
