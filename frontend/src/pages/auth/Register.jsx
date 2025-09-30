import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await register({
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
            role: e.target.role.value
        });
        navigate("/dashboard");
        
    }
    return (
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 dark:text-gray-200 rounded-md shadow-md mt-10">
            <h2 className="text-3xl text-center font-bold mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Username</label>
                    <input type="text" name="username" className="mt-1 block w-full border-none outline-0 ring ring-gray-400 focus:ring-blue-500 focus:shadow-md rounded-md p-2 dark:focus:bg-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                    <input type="email" name="email" className="mt-1 block w-full border-none outline-0 ring ring-gray-400 focus:ring-blue-500 focus:shadow-md rounded-md p-2 dark:focus:bg-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Role</label>
                    <select name="role" className="mt-1 block w-full border-none outline-0 ring ring-gray-400 focus:ring-blue-500 focus:shadow-md rounded-md p-2 dark:focus:bg-gray-700">
                        <option>---- Select Role----</option>
                        <option value="USER">User</option>
                        <option value="AUTHOR">Author</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
                    <input type="password" name="password" className="mt-1 block w-full border-none outline-0 ring ring-gray-400 focus:ring-blue-500 focus:shadow-md rounded-md p-2 dark:focus:bg-gray-700" />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Register</button>
            </form>
            <p className="mt-4 text-sm text-center">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
        </div>
    )
}