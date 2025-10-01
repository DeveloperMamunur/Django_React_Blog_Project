import { useState } from "react";
import { authService } from "../../services/authService";
import Button from "../../components/common/Button";
import FormField from "../../components/common/FormField";

export default function Settings() {
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (formData.new_password !== formData.confirm_password) {
            setError("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);
            await authService.changePassword(formData);
            setSuccess("Password updated successfully!");
            setFormData({ old_password: "", new_password: "", confirm_password: "" });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl">Settings Page</h1>
            </div>

            <div className="max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow p-6 mx-auto">
                <h2 className="text-xl text-center font-semibold mb-4">Change Password</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormField
                        label="Current Password"
                        type="password"
                        name="old_password"
                        value={formData.old_password}
                        onChange={handleChange}
                        required
                    />

                    <FormField
                        label="New Password"
                        type="password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        required
                    />

                    <FormField
                        label="Confirm New Password"
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                    />

                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-600">{success}</p>}

                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? "Updating..." : "Change Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
