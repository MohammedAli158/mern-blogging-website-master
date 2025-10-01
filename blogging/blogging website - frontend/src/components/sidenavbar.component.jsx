import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { UserContext } from "../App"

const SideNav = () => {
    let {userAuth:{access_token}} = useContext(UserContext)
    return (
        access_token === null ? <Navigate to="/sign-up"/> : 
    <>
        <h1>This is a nav bar</h1>
        <Outlet />
    </>
    )
}
export default SideNav