import { useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Camera } from "lucide-react"; // optional icon lib
import FormField from "../../components/common/FormField";
import { authService } from "../../services/authService";
import Button from "../../components/common/Button";

export default function Profile() {
    const { currentUser, refreshCurrentUser, setCurrentUser } = useAuth() || {};
    const fileInputRef = useRef(null);

    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    

    const BASE_URL = "http://localhost:8000"; // 👈 backend API base
    const avatarSrc =
        preview ||
        (currentUser?.avatar ? `${BASE_URL}${currentUser.avatar}` : "/vite.svg");

    const handleChooseFile = () => fileInputRef.current?.click();

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setError(null);
    };

    const handleCancel = () => {
        setFile(null);
        setPreview(null);
        setError(null);
    };

    const handleSave = async () => {
        if (!file || !currentUser?.id) return;
        setUploading(true);
        setError(null);

        try {
            const updated = await authService.updateAvatar(currentUser.id, file);

            if (typeof refreshCurrentUser === "function") {
                await refreshCurrentUser();
            } else if (typeof setCurrentUser === "function") {
                setCurrentUser((prev) => ({ ...prev, ...updated }));
            }

            setFile(null);
            setPreview(null);
        } catch (err) {
            setError(err.response?.data || err.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const [formData, setFormData] = useState({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
        bio: currentUser?.bio || "",
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await authService.updateCurrentUserInfo(currentUser.id, formData);
    };
    return (
        <div className="p-6 space-y-5">
            <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 text-left">
                    Profile Photo
                </h2>

                {/* Avatar with camera overlay */}
                <div
                    className="relative inline-block mb-4 cursor-pointer group"
                    onClick={handleChooseFile}
                >
                    <img
                        src={avatarSrc}
                        alt="avatar"
                        className="w-32 h-32 rounded-full object-cover border"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition">
                        <Camera className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Hidden file input */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />

                {error && <div className="text-red-500 text-sm mt-2">{String(error)}</div>}

                {/* Step 1: Upload button */}
                {!file && (
                <button
                    onClick={handleChooseFile}
                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                    Upload
                </button>
                )}

                {/* Step 2: Save / Cancel buttons */}
                {file && (
                    <div className="flex justify-center space-x-2">
                        <button
                            onClick={handleSave}
                            disabled={uploading}
                            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                        >
                            {uploading ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={uploading}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
            <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    User Info
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <FormField
                        label="User Name"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />

                    <FormField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />

                    <FormField
                        label="Bio"
                        type="textarea"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        required
                    />
                    <Button
                        type="submit"
                        variant="primary"
                    >
                        Update Info
                    </Button>
                </form>
            </div>
        </div>
    );
}
