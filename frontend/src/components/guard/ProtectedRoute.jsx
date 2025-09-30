import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ roles }) {
    const { user, isAuthLoading } = useAuth();

    if(isAuthLoading){
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />; // ✅ Always outlet
}
