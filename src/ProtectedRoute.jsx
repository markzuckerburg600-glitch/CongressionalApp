import { Navigate } from "react-router-dom"

// Now when someone tries to visit /dashboard, they need a token
// Otherwise, direct them to the login page
export function ProtectedRoute({children}){
    const token = localStorage.getItem("token")
    return token ? children : <Navigate to = "/login" replace ></Navigate>
}