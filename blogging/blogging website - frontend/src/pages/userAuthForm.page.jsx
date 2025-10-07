import InputBoxComponent from "../components/input.component";
import {Link, Navigate, useNavigate} from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import googleIcon from "../imgs/google.png"
import { useRef } from "react";
import {Toaster ,toast} from 'react-hot-toast';
import axios from "axios";
import { getSessionStorage, setSessionStorage } from "../common/session";
import { UserContext } from "../App";
import { useContext,useEffect} from "react";
import { authorizeGoogle } from "../common/firebase.jsx";



const UserAuthForm = ({type})=> { 
    let navigate = useNavigate();
    let {userAuth, userAuth : {access_token},setUserAuth} = useContext(UserContext);
    

  const SendFormtoBackend = async (path, Formdata) => {
    try {
        const response = await axios.post(import.meta.env.VITE_SERVER_PATH + path, Formdata);
        
        const userData = response.data;

        setSessionStorage("user", JSON.stringify(userData));
       
        setUserAuth(userData);
        
        
        // If you want to navigate after login success
        // navigate("/");
        return userData;
    } catch (err) {
        console.error(err.message);
        toast.error(err.response?.data?.error || err.message);
    }
};


    const serverPath = type=="sign-in" ? "/sign-in": "/sign-up"
    const Auth = useRef();
    const handleSubmit = (e) =>{
        
        e.preventDefault();
        const form = new FormData(Auth.current);
        let Formdata = {}
        for(let [key,value] of form.entries()){
            Formdata[key] = value
        }
        let {email,password,fullname}=Formdata;
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if(fullname==""){
            return toast.error("please enter a valid name");
        }
        if(fullname && !(fullname.length>3)){
                return toast.error("please enter a valid name");
        }
         if(!emailRegex.test(email)){
            return toast.error("please enter a valid email")
        }
        if(!passwordRegex.test(password)){
            return toast.error("password must contain 6-20 characters, one lowercase one uppercas")
        }
        
            
        
        SendFormtoBackend(serverPath,Formdata);
    }
    const handleGoogleAuth = async (e)=>{
            e.preventDefault();
            try {
                const aut = await authorizeGoogle();
                if (aut) {
                 
                let path = "/google-auth";
                
                
                let data = {
                    "access_token" : aut.accessToken
                }
                const userData = await SendFormtoBackend(path,data);
               
                   if (userData) navigate("/");
               
                    }
                }
             catch (error) {
                 toast.error("Unable to log in through Google");
                return console.log( "this is hte error"+ err)
            }
            
            
            
           
    }
    
    return(
        access_token ?
        <Navigate to="/"/>
        : 
        <AnimationWrapper keyValue={type}>
        <section className="h-cover flex items-center justify-center" >
            <Toaster/>
            <form ref={Auth} className="w-[80%] max-w-[400px]" >
                <h1  className="text-4xl font-gelasio captitalize text-center mb-24" >
                    {type == "sign-in" ? "Welcome Back" : "Join Us Today" }
                </h1>
                {
                    type== "sign-up" ?

                        <InputBoxComponent type="text" placeholder="full name" name="fullname" icon="fi-rr-user" /> : ""
                }
                <InputBoxComponent type="text" placeholder="email" name="email" icon="fi-rr-envelope" />
                <InputBoxComponent type="password" placeholder="password" name="password"  icon="fi-rr-key" />
                <button className="btn-dark center " onClick={handleSubmit} >
                    {type.replace("-"," ")}
                </button>
                <div className="relative w-full flex items-center my-10 opacity-10 uppercase text-black font-bold" >
                    <hr className="w-1/2 border-black" />
                    <p>or</p>
                     <hr className="w-1/2 border-black" />
                </div>

                <button className="btn-light center flex gap-3" onClick={handleGoogleAuth} >
                    <img src={googleIcon} className="w-5 top-1/2 -y-transform-1/2" />
                    <p className="top-1/2 -y-transform-1/2" >Continue with Google</p>
                </button>
                {
                    type == "sign-in" ? 
                    <p className="mt-3 text-xl text-center flex justify-center gap-3" >
                        Don't have an account? 
                        <Link to="/sign-up" className="text-xl text-center underline text-dark-grey" >
                        Create account 
                        </Link>
                    </p>
                    
                    : <p className="mt-3 text-xl text-center flex justify-center gap-3" >
                        Already a member? 
                        <Link to="/sign-in" className="text-xl text-center underline text-dark-grey" >
                        Sign in  
                        </Link>
                    </p>

                }
            </form>

        </section>
        </AnimationWrapper>
    )
}
export default UserAuthForm;