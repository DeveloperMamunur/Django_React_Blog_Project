import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ roles }) {
    const { currentUser, isAuthLoading } = useAuth();

    if(isAuthLoading){
        return null;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(currentUser.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />; // ✅ Always outlet
}
