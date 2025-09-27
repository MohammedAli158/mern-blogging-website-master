import { useContext, useState } from "react"
import { getDate } from "../common/date"
import { UserContext } from "../App"
import toast, { Toaster } from "react-hot-toast"
import CommentField from "./comment-field.component"
import BlogContent from "./blog-content.component"
import { BlogContext } from "../pages/blog.page"
import axios from "axios"

const CommentCard = ({index,leftVal,commentData}) =>{
    let { commented_by:{personal_info:{profile_img,username,fullname}},commentedAt,comment,children,_id} = commentData
    let {userAuth : access_token} = useContext(UserContext)
    let [isReplying,setIsReplying] = useState(false)
    let {blog,setBlog,blog:{comments,comments:{results:commentArr}}} = useContext(BlogContext)
    const handleReply = ()=>{
       
        if (!access_token) {
            return toast.error("Please Log in to reply")
        }
         setIsReplying(prev=>!prev)
    }
    const removeCommentCard = (startingPoint) =>{
        if (commentArr[startingPoint]) {
            while(commentArr[startingPoint].childrenLevel > commentData.childrenLevel){
                commentArr.splice(startingPoint,1)
                if (!commentArr[startingPoint]) {
                    break;
                }
            }
        }
        
    }
    const handleHideReply = ()=>{
        commentData.isReplyLoaded = false
        removeCommentCard(index+1)
        setBlog({...blog,comments:{results:commentArr}})
        console.log(blog)

    }
    const loadMoreReplies = async() =>{
       if (children.length) {
        handleHideReply()
        try {
            let skip = 0
            const data = await axios.post(import.meta.env.VITE_SERVER_PATH+"/fetch-replies",{
                skip,_id
            })
            if (data) {
                commentData.isReplyLoaded=true;
                for (let i = 0; i < data.data.length; i++) {
                    data.data[i].childrenLevel = commentData.childrenLevel + 1
                    commentArr.splice(index + 1 + i + skip , 0 , data.data[i])

                }
                setBlog({...blog,comments:{...comments,results:commentArr}})
            }
        } catch (error) {
            console.error(error)
        }
       }
    }
    return (
        <>
       
       <div className="w-full" style={{paddingLeft : `${leftVal*10}px`}} >
        <div className="my-5 p-6 rounded-md border border-grey" >
        <div className="flex gap-3items-center mb-7" >
        <img src={profile_img} className="w-6 h-6 rounded-full " />
        <p className="line-clamp-1" >{username}@{fullname}</p>
        <p className="min-w-fit" >{getDate(commentedAt)}</p>
        </div>
        <p className="font-gelasio text-xl ml-3" >{comment}</p>
        <div className="flex items-center gap-3 ml-3" >
            {
                commentData.isReplyLoaded ? <button onClick={handleHideReply} className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" >
                    <i className="fi fi-rs-comment-dots" />
                    Hide replies
                </button> : children.length ? <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={loadMoreReplies} >
                 {children.length}
                     <i className="fi fi-rs-comment-dots" />
                     Load More
                </button> : " "
            }

        <button  onClick={handleReply} className="underline" >Reply</button>
        </div>
        </div>
        {
            isReplying ? <CommentField action="reply" index={index} replyingTo={commentData._id} setIsReplying={setIsReplying} /> : ""
        }
       </div>
        </>
    )
}
export default CommentCard