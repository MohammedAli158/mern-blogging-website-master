import { useEffect, useState } from "react"
import logo from "../imgs/logo.png"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { UserContext } from "../App"
import { useContext } from "react"
import UserNavigationPanel from "./user-navigation.component"
import { getSessionStorage } from "../common/session"
import axios from "axios"
import toast from "react-hot-toast"
const Navbar = ()=> {
    let navigate = useNavigate()
   let {
  userAuth = {},           // default empty object if userAuth is undefined
  userAuth: { 
    access_token = null,   // default value if undefined
    profile_img = null 
  } = {},
  setUserAuth = () => {}   // default to no-op function
} = useContext(UserContext) || {};

    let new_notification_available = userAuth?.new_notification_available
    const [searchVisibility,setSearchVisibility]= useState(false);
    let [showNavigationPanel,setShowNavigationPanel] = useState(false);
    const handleSearchKeyDown =(e)=> {
        if (e.keyCode ==13 && e.target.value.length) {
            e.preventDefault()
            navigate(`/search/${e.target.value}`)
        }
    }
   useEffect(()=>{
   
     let pro = JSON.parse(getSessionStorage("user"))
    setUserAuth({...userAuth,profile_img:pro?.profile_img})
   
   },[])
   const fN = async () =>{
    let data = await axios.get(import.meta.env.VITE_SERVER_PATH+"/get-notification-state",{
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        })
        if (data && data.data?.error ) {
           console.log (data.data.error,"while fetching notification state")
           return toast.error (data.data?.error)
           
        }
        else {
            let ali = data.data
            setUserAuth({...userAuth,...ali})
        }
   }
   useEffect( ()=>{
    if (access_token) {
        fN ()
    }
   },[access_token])
   const handleWriteOnClick = ()=>{

       if (    userAuth?.access_token === undefined 
       ) {
           return toast.error("Please Log in first")
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
            <Link to="/editor" onClick={handleWriteOnClick} className="hidden md:flex gap-2 link" >
                <i className="fi fi-rr-file-edit"></i>
                <p>Write</p>
            </Link>
            {
                    access_token ?
                    <>
                    
                    <Link to="/dashboard/notifications">
                        <button className="w-12 h-12 rounded-full relative bg-grey hover:bg-black/30" >
                            <i className="fi fi-rr-bell text-2xl block mt-1"/>{
                                new_notification_available ? <span className="bg-red h-3 w-3 rounded-full absolute top-2 right-2 z-3" >

                                </span>: ""
                            }
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