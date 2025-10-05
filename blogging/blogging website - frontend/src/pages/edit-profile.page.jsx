import { useContext,useRef,useState } from "react"
import { UserContext } from "../App"
import { useEffect } from "react"
import axios from "axios"
import AnimationWrapper from "../common/page-animation"
import Loader from "../components/loader.component"
import toast, { Toaster } from "react-hot-toast"
import InputBoxComponent from "../components/input.component"
import { getSessionStorage, setSessionStorage } from "../common/session"
const EditProfile = () => {
    let [charactersLeft,setCharactersLeft] = useState(160)
    let [updatedProfileImg,setUpdatedProfileImg] = useState(null)
    let profileImgRef = useRef()
    let formref=useRef()
    let [profile, setProfile] = useState(
        {
            personal_info: {
                fullname: "loading",
                username: "loading",
                profile_img: " ",
                bio: "loading"
            },
            account_info: {
                total_posts: 0,
                total_reads: 0
            },
            social_links: {
                youtube:"",
                facebook:"",
                instagram:"",
                github:"",
                twitter:"",
                website:""
                
            },
            joinedAt: " "
        })
    let[loading,setLoading] = useState(true)

    let {userAuth, userAuth: { access_token,profile_img:userauth_profileimg } ,setUserAuth} = useContext(UserContext)
    let {personal_info:{username:profile_username,fullname,bio,email,profile_img},social_links} = profile
    useEffect(() => {
        if (access_token) {
            axios.post(import.meta.env.VITE_SERVER_PATH + "/get-profile", {
                Username: userAuth.username
            }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(({ data }) => {
               
                setProfile(data?.profile)
                setLoading(false)
            })
        }
    }, [access_token])
    const handleBioCharacterChange = (e) =>{
        setCharactersLeft(160-e.target.value.length)
    }
    const handleProfileChange = (e) =>{
        let img = e.target.files[0]
        profileImgRef.current.src = URL.createObjectURL(img)
        setUpdatedProfileImg(img)

    }
    const ProfileUpdateHandle = async(e) =>{
        e.target.setAttribute("disabled",true);
        loading = toast.loading("Udpdating")
        let img = updatedProfileImg
        if (!img) {
            return
        }
        let form = new FormData()
        form.append("profile_img",img)

        let {data} = await axios.post(import.meta.env.VITE_SERVER_PATH+"/change-profile-img",form,{headers:{
            Authorization: `Bearer ${access_token}`
        }})
        if (data) {
            setUserAuth({...userAuth,profile_img:data.publicUrl})
        const user = JSON.parse(getSessionStorage("user"))
setSessionStorage("user", JSON.stringify({
    ...user,
    profile_img: data.publicUrl
}))
        toast.dismiss(loading)
        e.target.removeAttribute("disabled")
        return toast.success("Successfully updated, log-out and log in to see visible changes")
        }

    }
    const handleFormSubmit =async (e)=>{
        e.preventDefault();
        let form = new FormData(formref.current)
        let formData={}
        for (const [key,value] of form.entries()) {
            formData[key] = value
        }
        let {username,youtube,facebook,instagram,github,twitter,website,bio} = formData
        if (username.length<3) {
            return toast.error("Please enter a valid Username")
        }
        if (bio.length>160) {
            return toast.error("Bio must be within 160 characters")
        }
        try {
            const data = await axios.post(import.meta.env.VITE_SERVER_PATH+"/edit-profile",{
                formData
            },{
                headers:{
                    Authorization : `Bearer ${access_token}`
                }
            })
            let loading = toast.loading("Updating...")
            if (data?.data?.error) {
                toast.dismiss(loading)
                return toast.error(data.data.error)
            }
            if (data) {
                toast.dismiss(loading)
                 toast.success("Successfully updated...")
                let ali = data.data
                setProfile({...profile,...ali})
                
                if (userAuth.username != ali.personal_info.username) {
                    let newu =  {...userAuth,username:ali.personal_info.username}
                    setSessionStorage ("user",JSON.stringify(newu))
                    setUserAuth({...userAuth,username:ali.personal_info.username})
                }
            }
        } catch (error) {
           return  toast.error(error.message)
        }
    }
    return (
        <AnimationWrapper>
            {
                loading ? <Loader/> : <form ref={formref} >
                    <Toaster/>
                    <h1 className="max-md:hidden" >Edit Profile</h1>
                    <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10" >
                        <div className="max-lg:center mb-5" >

                    <label className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden" htmlFor="UploadImg" id="profileImgLable">
                        <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/50 opacity-0 hover:opacity-100 cursor-pointer" >
                            Upload Image 
                           
                        </div>
                    <img src={profile_img} ref={profileImgRef} />
                    </label>
                    <input  type="file" accept=".jpeg,.png,.jpg" id="UploadImg" hidden  onChange={handleProfileChange} />
                    <button className="btn-light mt-5 max-lg:center lg:w-full px-10" onClick={ProfileUpdateHandle} >Upload</button>
                    </div>
                        <div className="w-full" >
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5" >
                                <div>
                                    <InputBoxComponent name="fullname" type="text" value={fullname} placeholder="Full Name" disable={true} icon="fi-rr-user" />
                                </div>
                                <div>
                                    <InputBoxComponent name="email" type="email" value={email} placeholder="Email" disable={true} icon="fi-rr-envelope" />
                                </div>
                            </div>
                            <InputBoxComponent name="username" type="text" value={profile_username} placeholder="username" icon="fi-rr-at" />
                            <p className="-mt-3 text-dark-grey" >Username will be used for searching purposes</p>
                            <textarea className="resize-none input-box h-64 lg:h-40 leading-7 mt-5 pl-5 " maxLength={160} name="bio" value={bio} placeholder="add bio" onChange={handleBioCharacterChange} >

                            </textarea>
                            <p>{charactersLeft} characters left</p>
                            <p className="my-6 text-dark-grey" >Add Your Social Media Handles Below</p>
                           <div className="md:grid md:grid-cols-2 gap-x-6" >
                             {
                                Object.keys(social_links).map((key,i)=>{
                                    let link = social_links[key]
                                    return <InputBoxComponent key={i} value={link} placeholder="https://" icon={ key=='website' ? ` fi-rr-globe ` :   ` fi-brands-${key} `  } name={key} />
                                })
                            }
                           </div>
                           <button className="btn-dark px-6 my-5 w-auto" type="submit" onClick={handleFormSubmit} >Submit</button>
                        </div>
                    </div>
                </form>
            }
        </AnimationWrapper>
    )
}
export default EditProfile