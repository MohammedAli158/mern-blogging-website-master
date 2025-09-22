import { useContext} from "react"
import { BlogContext } from "../pages/blog.page"
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getSessionStorage } from "../common/session";
import { useEffect } from "react";
import axios from "axios";

const BlogInteraction = ()=>{
    let {blog,blog:{_id,title,blog_id,activity:{total_likes,total_comments},author:{personal_info:{username:author_username}}},setBlog,like,setLike,likes,setLikes,commentsVisible,setCommentsVisible,totalParentComments,setTotalParentComment} = useContext(BlogContext);

    let {userAuth:{username,access_token}} = useContext(UserContext) 
    const user = JSON.parse(getSessionStorage("user"))  
     

const fetchLikeInfo = async () =>{
    
    try {
        const data = await axios.post(import.meta.env.VITE_SERVER_PATH+"/like-info",{
            _id : _id
        },{
            headers:{
                Authorization : `Bearer ${user?.access_token}`
            }
        }) 
        
        if (data) {
           console.log(data, "data is fetched")
           setLike(data.data.like)
            setLikes(data.data.likes)
        }else{
            console.log("data is nul")
        }

    } catch (error) {
        console.log(error)
    }
};
const handleLikeClick  = async (e) =>{
    if(!user){
        return toast.error("Please log in to like")
    }


    setLike (prev=>!prev)
    if (like) { //not already liked , unclick->click
        console.log("sending like req")
        try {
            const res = await axios.post(import.meta.env.VITE_SERVER_PATH+"/like-info",{
                _id : _id, dec : "false"
            },{
                headers:{
                    Authorization : `Bearer ${user?.access_token}`
                }
            })
            if (res) {
                console.log (res.data)
                setLike (res.data?.like)  
                setLikes (res.data?.likes) 
            }
        } catch (error) {
            
        }
    }else{
       
        try {
            const res = await axios.post(import.meta.env.VITE_SERVER_PATH+"/like-info",{
                _id : _id,dec:true
            },{
                headers:{
                    Authorization : `Bearer ${user?.access_token}`
                }
            })
            if (res) {
                console.log ("remove likes",res.data) 
                setLike(res.data.like) 
                setLikes(res.data.likes) 
            }
        } catch (error) {
            
        }
    }
}

useEffect(() => {
    fetchLikeInfo() 
   
}, [_id]);



    return (
        <>
        <Toaster/>
        <hr className="my-2 border-grey"/>
        <div className="flex gap-6 justify-between" >
            <div className="flex gap-3 items-center" >
                <button className={`w-10 h-10 rounded-full flex items-center justify-center bg-grey/80 `} onClick={handleLikeClick} value={like} >
                    <i className={`fi fi`+ (!like ? '-sr-heart text-red': "-rr-heart " ) } />
                </button>
                <p>{likes}</p>
            
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" onClick={()=>setCommentsVisible(prev=>!prev)} >
                    <i className="fi fi-rr-comment-dots" />
                </button>
                <p>{total_comments}</p>
            </div>
            <div className="flex gap-6 items-center" >
                {
                    username == author_username ? 
                    <Link to={`/editor/${blog_id}`} className="underline hover:text-purple" >Edit</Link>
                    : " "
                }
                <Link to={`https://www.twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`} >
                <i className="fi fi-brands-twitter text-2xl hover:text-twitter"/>
                </Link>
            </div>
        </div>
         <hr className="my-2 border-grey"/>
        </>
    )
}
export default BlogInteraction