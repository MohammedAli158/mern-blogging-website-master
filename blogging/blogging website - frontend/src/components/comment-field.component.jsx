import { useContext, useState } from "react"
import { getSessionStorage } from "../common/session"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"

import { BlogContext } from "../pages/blog.page"
import { UserContext } from "../App"

const CommentField = ({ action, index, replyingTo, setIsReplying,setChildLengthState }) => {
    const { blog: { _id, author: { _id: blog_author }, comments, activity, activity: { total_comments, total_parent_comments } }, setBlog, setTotalParentComments,setCommentsCount } = useContext(BlogContext)
    const { blog } = useContext(BlogContext)
    let commentArr = blog?.comments?.results

    const { userAuth, userAuth: { access_token, profile_img, username, fullname } } = useContext(UserContext)

    let [comment, setComment] = useState("")
    const handleCommentClick = async () => {
        
        let parentCommentIncrementVal

        if (!access_token) {
            return toast.error("Please Log in first")
        }
        if (comment.length == 0) {
            return toast.error("Please write something before submitting")
        }
        let newCommentArr
        if (replyingTo) {
            
            setIsReplying(false)
  parentCommentIncrementVal = 0
  try {
    const data = await axios.post(
      import.meta.env.VITE_SERVER_PATH + "/add-reply",
      { parent_comment_id: replyingTo, blog_id: _id, blog_author, comment },
      { headers: { Authorization: `Bearer ${access_token}` } }
    )

    console.log("Axios reply response:", data)

    if (!data || !data.data) {
      console.error("No data returned from /add-reply")
      return
    }

    if (!commentArr[index]) {
      console.error("commentArr[index] is undefined", { index, commentArr })
      return
    }

    commentArr[index].children.push(data.data._id)
    data.data.childrenLevel = commentArr[index].childrenLevel + 1
    data.data.parentIndex = index
    commentArr[index].isReplyLoaded = true

    newCommentArr = [
      ...commentArr.slice(0, index + 1),
      data.data,
      ...commentArr.slice(index + 1)
    ]
    setChildLengthState(prev=>prev+1)

    data.data.commented_by = { personal_info: { profile_img, fullname, username } }
    setComment("")
    setCommentsCount(prev=>prev+1)
    console.log("reply count is set")
    setBlog({
      ...blog,
      comments: { ...comments, results: newCommentArr },
      activity: {
        ...activity,
        total_comments: total_comments + 1,
        total_parent_comments: total_parent_comments + parentCommentIncrementVal
      }
    })
    setTotalParentComments(prev => prev + parentCommentIncrementVal)

  } catch (error) {
    console.error("Error while adding reply:", error)
  }
}
 else {
            parentCommentIncrementVal = 1
            try {

                const data = await axios.post(import.meta.env.VITE_SERVER_PATH + "/add-comment", {
                    _id, blog_author, comment
                }, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                })


                newCommentArr = [data.data, ...commentArr]
                parentCommentIncrementVal = 1
                if (data) {
                    data.data.commented_by = { personal_info: { profile_img, fullname, username } }
                    setComment("")
                    setCommentsCount(prev=>prev+1)
                    data.data.childrenLevel = 0
                    setBlog({ ...blog, comments: { ...comments, results: newCommentArr }, activity: { ...activity, total_comments: total_comments + 1, total_parent_comments: total_parent_comments + parentCommentIncrementVal } })
                    console.log("This should be seen after replying ", blog)
                    setTotalParentComments(prev => prev + parentCommentIncrementVal)
                    
                }
            } catch (error) {
                console.log(error)
            }

        }
    }


    return (
        <>
            <Toaster />
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="leave a comment.." className="resize-none input-box pl-5 placeholder:text-dark-grey h-[150px] overflow-auto"  >

            </textarea>
            <button onClick={handleCommentClick} className="btn-dark mt-5 px-10" >{action}</button>
        </>
    )
}
export default CommentField
