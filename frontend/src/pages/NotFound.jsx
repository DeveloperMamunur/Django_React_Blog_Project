import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md text-center">
            <h1 className="text-4xl font-bold">404 - Not Found</h1>
            <p className="my-3">The page you are looking for does not exist.</p>
            <Link to="/" className="text-blue-500 hover:underline">Go back to Home</Link>
        </div>
    </div>
  );
}
