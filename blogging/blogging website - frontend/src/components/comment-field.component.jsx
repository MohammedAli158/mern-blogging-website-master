import { useContext, useState } from "react"
import { getSessionStorage } from "../common/session"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"

import { BlogContext } from "../pages/blog.page"
import { UserContext } from "../App"

const CommentField = ({action})=>{
    const {blog:{_id,author:{_id:blog_author}}} = useContext(BlogContext)
    const {user:{access_token,profile_img,username,fullname}} = useContext(UserContext)
    let [comment,setComment] = useState("")
    const handleCommentClick = async()=>{
        if (!user.access_token) {
            return toast.error("Please Log in first")
        }
        if (comment.length==0) {
            return toast.error("Please write something before submitting")
        }
        try {
            const data = await axios.post(import.meta.env.VITE_SERVER_PATH+"/add-comment",{
                _id,blog_author,comment
            },{
                headers:{
                    Authorization:`Bearer ${user?.access_token}`
                }
            })
            if (data) {
                console.log(data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
        <Toaster/>
        <textarea value={comment} onChange={ (e)=>setComment(e.target.value)} placeholder="leave a comment.." className="resize-none input-box pl-5 placeholder:text-dark-grey h-[150px] overflow-auto"  >
                
        </textarea>
        <button  onClick={handleCommentClick} className="btn-dark mt-5 px-10" >{action}</button>
        </>
    )
}
export default CommentField