import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function PublicRoutes({children}){
    const {customer, loading} = useAuth();

    if(loading){
        return (
            <h2>Loading...</h2>
        )
    }

    if (customer){
        // Logged-in users do not need the login/register public flow again.
        return (
            <Navigate to="/home"/>
        )
    }

    return (
        children
    )
}

export default PublicRoutes;
