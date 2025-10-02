import { useRef } from "react"
import AnimationWrapper from "../common/page-animation"
import InputBoxComponent from "../components/input.component"
import {toast,Toaster} from "react-hot-toast"
import axios from "axios"
import { useContext } from "react"
import { UserContext } from "../App"
const ChangePassword = () =>{
    let {userAuth:{access_token}} = useContext(UserContext)
    let ChangePasswordRef = useRef()
    const handleChangePassword =  async(e)=>{
        e.preventDefault();
        let form = new FormData(ChangePasswordRef.current)
        let formData ={}
        for (let [key,value] of form.entries()) {
            formData[key] = value
        }
        let {currentPassword,newPassword} = formData
        if (currentPassword.length==0 || newPassword.length==0) {
           return toast.error("Please fill all the inputs")
        }
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
            return toast.error("Password must include  atleast one lower case, Upper case , number")
        }
        let LoadingToast = toast.loading("Updating....")
        e.target.setAttribute("disabled",true)
        console.log(formData,"is formdata")
        try {
            let data = await axios.post(import.meta.env.VITE_SERVER_PATH + "/change-password",{
                currentPassword:formData.currentPassword ,newPassword:formData.newPassword
            },{
                headers:{
                    'Authorization' : `Bearer ${access_token}`
                }
            })
            if (data.data?.error) {
                e.target.removeAttribute("disabled")
                toast.dismiss(LoadingToast)
                toast.error(data.data?.error)
                return 
            }
            if (data) {
                console.log(data)
                e.target.removeAttribute("disabled")
                toast.dismiss(LoadingToast)
                toast.success("Successfully Updated")
            }
        } catch (error) {
                e.target.removeAttribute("disabled")
                toast.dismiss(LoadingToast)
                toast.error(error.message)
        }
       
    }
    return(
        <AnimationWrapper>
            <Toaster />
            <form ref={ChangePasswordRef}>
                <h1 className="max-md:hidden mb" >Change Password</h1>
                <div className="py-10 w-full md:max-w-[400px]" >
                    <InputBoxComponent name="currentPassword" type="password" placeholder="Current Password" className="profile-edit-input" icon="fi-rr-unlock" />
                     <InputBoxComponent name="newPassword" type="password" placeholder="New Password" className="profile-edit-input" icon="fi-rr-unlock" />
                     <button className="btn-dark px-10" onClick={handleChangePassword} >Change Password</button>
                </div>
            </form>
        </AnimationWrapper>
    )
}
export default ChangePassword