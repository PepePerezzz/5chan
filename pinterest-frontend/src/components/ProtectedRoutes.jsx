import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoutes({ children, roles }) {

    const { user } = useAuth();

    console.log("USER:", user);
    console.log("ROL:", user?.rol);
    console.log("PERMITIDOS:", roles);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.rol)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoutes;