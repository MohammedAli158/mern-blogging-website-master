import { Link } from "react-router-dom"
import AnimationWrapper from "../common/page-animation"
import { useContext, useState } from "react"
import { UserContext } from "../App"
import { removeSessionStorage } from "../common/session"
import { useEffect } from "react"

const UserNavigationPanel = () =>{
    let { userAuth:{username },setUserAuth} = useContext(UserContext);
    const signOutUser =()=>{
        removeSessionStorage("user");
        setUserAuth({access_token : null})
    }
    

    return (
       <AnimationWrapper transition={{duration : 0.3}} className="absolute right-0 z-5" >
            <div className="bg-white absolute right-0 border border-grey w-60 overflow-hidden" >  
                <Link to="/editor" className="flex gap-3 md:hidden pl-8 py-4" >
                    <i className="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>
                <Link to={`/user/${username}`} className="pl-8 py-4 link"  >
                    Profile
                </Link>
                <Link to="/dashboard/blogs" className="pl-8 py-4 link"  >
                    Dashboard
                </Link>
                <Link to="/settings/edit-profile" className="pl-8 py-4 link"  >
                    Settings
                </Link>
                <span className="w-[100%] absolute border-t border-grey" ></span>
                <button className=" text-left p-4 hover:bg-grey w-full pl-8 py-4" onClick={signOutUser} >
                    <h1 className="font-bold text-xl mg-1" >Sign Out</h1>
                    <p className="text-dark-grey" >@`{username}`</p>
                    
                </button>

            </div>
       </AnimationWrapper>
    )
}
export default UserNavigationPanel