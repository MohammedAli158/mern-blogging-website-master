import { useContext, useEffect, useRef, useState } from "react"
import { Navigate, NavLink, Outlet } from "react-router-dom"
import { UserContext } from "../App"

const SideNav = () => {
    let {userAuth,userAuth:{access_token}} = useContext(UserContext)
    let new_notification_available = userAuth?.new_notification_available
    let pathname = location.pathname.split('/')[2].replace('-',' ')
    let[pageState,setPageState]=useState(pathname)
    let sideBarRef = useRef()
    let pageStateTab = useRef()
    let [showSideNav,setShowSideNav] = useState(false)
    useEffect(()=>{
        setShowSideNav(true)

    },[pageState])
    return (
        access_token === null ? <Navigate to="/sign-up"/> : 
    <>
       <section className="relative flex gap-10 py-0 m-0 max-md:flex-col" >
        <div className="sticky top-[80px] z-30" >
            <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto" >
                <button className="p-5 capitalize " ref={sideBarRef} onClick={()=>{
                    setShowSideNav(prev=>!prev)
                }} ><i className="fi fi-rr-bars-staggered pointer-events-none" /></button>
                <button className="p-5 capitalize border-b border-black" ref={pageStateTab} onClick={()=>{
                    setShowSideNav(true)
                }} >{pageState}</button>
            </div>
            <div className={"min-w-[200px] h-[calc(100vh-150px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute md:sticky max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 " + (showSideNav? " max-md:opacity-0 max-md:pointer-events-none" : " opacity-100 " )} >
            <h1 className="text-xl text-dark-grey mb-3" >Dashboard</h1>
            <hr className="border-grey -ml-6 mb-8 mr-6" />
            <NavLink to="/dashboard/blogs" onClick={(e)=>setPageState(e.target.innerText)} className="sidebar-link" >
            <i className="fi fi-rr-document" />
            Blogs
            </NavLink>
            <NavLink to="/dashboard/notifications" onClick={(e)=>setPageState(e.target.innerText)} className="sidebar-link "  >
            <div className="relative" >
                <i className="fi fi-rr-bell" />
            {
                     new_notification_available ? <span className="bg-red h-2 w-2 rounded-full absolute top-0 right-0 z-3" >
                     </span>: ""
            }
            </div>
            Notification
            </NavLink>
            <NavLink to="/editor" onClick={(e)=>setPageState(e.target.innerText)} className="sidebar-link" >
            <i className="fi fi-rr-file-edit" />
            Write
            </NavLink>
            <h1 className="text-xl text-dark-grey mt-20 mb-3" >Settings</h1>
            <hr className="border-grey -ml-6 mb-8 mr-6" />
            <NavLink to="/settings/edit-profile" onClick={(e)=>setPageState(e.target.innerText)} className="sidebar-link" >
            <i className="fi fi-rr-user" />
            Edit Profile
            </NavLink>
            <NavLink to="/settings/change-password" onClick={(e)=>setPageState(e.target.innerText)} className="sidebar-link" >
            <i className="fi fi-rr-lock" />
            Change Password
            </NavLink>
            </div>
        </div>
        <div className=" mt-5 max-md:-mt-8 w-full" >

        <Outlet />
        </div>
       </section>
    </>
    )
}
export default SideNav