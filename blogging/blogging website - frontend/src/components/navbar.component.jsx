import { useState } from "react"
import logo from "../imgs/logo.png"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { UserContext } from "../App"
import { useContext } from "react"
import UserNavigationPanel from "./user-navigation.component"
const Navbar = ()=> {
    let navigate = useNavigate()
    let {userAuth, userAuth: {access_token,profile_img}} = useContext(UserContext);
    const [searchVisibility,setSearchVisibility]= useState(false);
    let [showNavigationPanel,setShowNavigationPanel] = useState(false);
    const handleSearchKeyDown =(e)=> {
        if (e.keyCode ==13 && e.target.value.length) {
            e.preventDefault()
            navigate(`/search/${e.target.value}`)
        }
    }
    return (
        <>
       <nav className="navbar z-50">

            <Link to="/"className="w-10 flex-none" >
                <img src ={logo} className="w-full" />
            </Link>
            <div className= {"absolute bg-white w-full left- top-full mt-0.5 border-b border-grey py-6 px-[5vw] md:relative md:inset-0 md:p-0 md:border-0 md:block-0 md:w-auto md:show " + (searchVisibility ? "show" : "hide")} >
                

                <input
                 type="text"
                 placeholder="Search"
                 className=" w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder-text:dark-grey md:pl-12"
                 onKeyDown={handleSearchKeyDown}
                 />

                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-dark-grey"></i>
                
            </div>
            <div className="flex justify-center align-center ml-auto" >
                    <button className="md:hidden bg-grey w-16 h-16 rounded-full text-xl" onClick={()=>setSearchVisibility(currentval => !currentval)} >
                         <i className="fi fi-rr-search  "></i>
                    </button>
            </div>
            <Link to="/editor" className="hidden md:flex gap-2 link" >
                <i className="fi fi-rr-file-edit"></i>
                <p>Write</p>
            </Link>
            {
                    access_token ?
                    <>
                    
                    <Link to="/dashboard/notification">
                        <button className="w-12 h-12 rounded-full relative bg-grey hover:bg-black/30" >
                            <i className="fi fi-rr-bell text-2xl block mt-1"/>
                        </button>
                    </Link>
                    <div className="relative" >
                        <button className="w-12 h-12 mt-1" onClick={()=>{
                            setShowNavigationPanel(currentval=>!currentval)
                        } }  onBlur={()=>{
                            setTimeout(() => {
                                
                                setShowNavigationPanel(false)
                            }, 300);
                        }} >
                            <img src={profile_img} className="w-full h-full object-cover rounded-full" />
                        </button>

                       { 
                            showNavigationPanel ? 
                           <UserNavigationPanel  /> : ""

                       }
                    </div>


                    </>
                    
                    : 
                    <>
                <Link className="btn-dark py-2" to="/sign-in" >
                    Sign In
                </Link>
                <Link className="btn-light py-2 hidden md:block " to="/sign-up" >
                     Sign Up
                </Link>
                    </>
            }
            
       </nav>
       <Outlet/>
       </>
    )
}
export default Navbar;