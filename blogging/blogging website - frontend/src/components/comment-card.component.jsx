import { useContext, useEffect, useState } from "react"
import { getDate } from "../common/date"
import { UserContext } from "../App"
import toast, { Toaster } from "react-hot-toast"
import CommentField from "./comment-field.component"
import BlogContent from "./blog-content.component"
import { BlogContext } from "../pages/blog.page"
import axios from "axios"

const CommentCard = ({index,leftVal,commentData}) =>{
    let { commented_by:{personal_info:{profile_img,username:commented_by_username,fullname}},commentedAt,comment,children,_id} = commentData
    let {userAuth : {access_token,username}} = useContext(UserContext)
    let [isReplying,setIsReplying] = useState(false)
    let {blog,setTotalParentComments,setBlog,blog:{activity,activity:{total_comments,total_parent_comments},author:{personal_info:{username : author_username}},comments,comments:{results:commentArr}},setCommentsCount} = useContext(BlogContext)
    // console.log(blog,"this is how blog is ...")
    let [childLengthState,setChildLengthState] = useState(children.length)
    const handleReply = ()=>{
       
        if (!access_token) {
            return toast.error("Please Log in to reply")
        }
         setIsReplying(prev=>!prev)
         
    }
    const getParentIndex = ()=>{
        let startingPoint = index-1
        try{
            while(commentArr[startingPoint].childrenLevel>= commentData.childrenLevel ){
                startingPoint--;
            }
        }catch{
            startingPoint= undefined
        }
        return startingPoint
    }
    const removeCommentCard = (startingPoint,isDelete=false) =>{

        if (commentArr[startingPoint]) {
            while(commentArr[startingPoint].childrenLevel > commentData.childrenLevel){
                commentArr.splice(startingPoint,1)
                if (!commentArr[startingPoint]) {
                    break;
                }
            }
        }
        if (isDelete) {
            let parentIndex = getParentIndex();
            if (parentIndex!=undefined) {
                commentArr[parentIndex].children = commentArr[parentIndex].children.filter(child => child != _id)
                if (!commentArr[parentIndex].children.length) {
                    commentArr[parentIndex].isReplyLoaded= false
                }
            }
            commentArr.splice(index,1)
        }
        if (commentData.childrenLevel==0 && isDelete) {
            setTotalParentComments(prev=>prev-1)
           console.log("here, iam reducing the original lenghth by ",commentData.children.length+1)
            setCommentsCount(prev=>prev-(commentData.children.length+1))
            
        }if (!commentData.childrenLevel==0 && isDelete) {
             setCommentsCount(prev=>prev-1)
        }

        setBlog({...blog,activity:{...activity,total_comments:total_comments-(commentData.childrenLevel==0 && isDelete ? children.length+1 : 1 ),total_parent_comments:total_parent_comments -(commentData.childrenLevel == 0  && isDelete ? 1 :  0) },comments:{results:commentArr}})
    }
    const handleHideReply = ()=>{
        commentData.isReplyLoaded = false
        removeCommentCard(index+1)
        setBlog({...blog,comments:{results:commentArr}})
        
    }
    const loadMoreReplies = async({skip=0,currentIndex = index}) =>{
       if (commentArr[currentIndex].children.length) {
        handleHideReply()
        try {
           
            const data = await axios.post(import.meta.env.VITE_SERVER_PATH+"/fetch-replies",{
                skip,_id:commentArr[currentIndex]._id
            })
            if (data) {
                commentArr[currentIndex].isReplyLoaded=true;
                for (let i = 0; i < data.data.length; i++) {
                    data.data[i].childrenLevel = commentArr[currentIndex].childrenLevel + 1
                    commentArr.splice(currentIndex + 1 + i + skip , 0 , data.data[i])

                }
                setBlog({...blog,comments:{...comments,results:commentArr}})
            }
        } catch (error) {
            console.error(error)
        }
       }
    }
  const deleteComment = async (e) => {
    e.target.setAttribute("disabled", true);
    axios.post(import.meta.env.VITE_SERVER_PATH + "/delete-comment", {
        _id
    }, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    }).then((data) => {
        e.target.removeAttribute("disabled");
        removeCommentCard(index + 1, true);
    }).catch(err => {
        console.log(err);
    });
};
const LoadMoreRepliesButton = ()=>{
    let parentIndex = getParentIndex()
    if (commentArr[index+1]) {
        
        
        if(commentArr[index].childrenLevel>commentArr[index+1].childrenLevel) {
            if ((index-parentIndex)<commentArr[parentIndex].children.length) {
               
                return <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"  onClick={()=>{
                    loadMoreReplies({skip:index-parentIndex,currentIndex:parentIndex})
                }} >Load More Replies</button>
            }
        }
    }else{
        if (parentIndex) {
            if ((index-parentIndex)<commentArr[parentIndex].children.length) {
               
                return <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"  onClick={()=>{
                    loadMoreReplies({skip:index-parentIndex,currentIndex:parentIndex})
                }} >Load More Replies</button>
            }
        }
    }
}
    return (
        <>
       
       <div className="w-full" style={{paddingLeft : `${leftVal*10}px`}} >
        <div className="my-5 p-6 rounded-md border border-grey" >
        <div className="flex gap-3items-center mb-7" >
        <img src={profile_img} className="w-6 h-6 rounded-full " />
        <p className="line-clamp-1" >{commented_by_username}@{fullname}</p>
        <p className="min-w-fit" >{getDate(commentedAt)}</p>
        </div>
        <p className="font-gelasio text-xl ml-3" >{comment}</p>
        <div className="flex items-center gap-3 ml-3" >
            {
                commentData.isReplyLoaded ? <button onClick={handleHideReply} className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" >
                    <i className="fi fi-rs-comment-dots" />
                    Hide replies
                </button> : childLengthState > 0 ? <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={loadMoreReplies} >
                     <i className="fi fi-rs-comment-dots" />
                     Load More
                </button> : " "
            }
            

        <button  onClick={handleReply} className="underline" >Reply</button>
         {
                commented_by_username == username || author_username == username ? 
                <button  onClick={deleteComment} className="rounded-full border border-grey ml-auto flex items-center hover:text-red hover:bg-red/30 px-3 py-3" >
                    <i className="fi fi-bs-trash pointer-none" />
                </button>
                : ""

            }
        </div>
        </div>
        {
            isReplying ? <CommentField action="reply" index={index} replyingTo={commentData._id} setIsReplying={setIsReplying} setChildLengthState={setChildLengthState} /> : ""
        }
       
       </div>
       <LoadMoreRepliesButton />
        </>
    )
}
export default CommentCard