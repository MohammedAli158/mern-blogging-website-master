import { useState } from "react"
import { BlogContext } from "../pages/blog.page"
import { useContext } from "react"
import CommentField from "./comment-field.component"
import axios from "axios"
import { comment } from "postcss"
import NoDataMessage from "./nodata.component"
import AnimationWrapper from "../common/page-animation"
import CommentCard from "./comment-card.component"
export const fetchComments = async({blog_id,skip,setTotalParentCommentFun,comment_array = null}) => {
    let res;
    let resp = await axios.post(import.meta.env.VITE_SERVER_PATH+"/fetch-comments",{
        blog_id,skip
    })
    if (resp) {
        resp.data.map((comment)=>{
            comment.childrenLevel = 0;
        })
        if (comment_array==null) {
            res={results : resp.data}
        }else{
            let dati = resp.data
            res= {results : [...comment_array,...dati
            ]}
        }
    }
    let inc = res.results.length || 1
    setTotalParentCommentFun(inc)
    return res

}
const CommentContainer = () => {
    let {blog,blog:{_id,title,comments,activity:{total_parent_comments}} ,commentsVisible, setCommentsVisible, totalParentComments, setTotalParentComments,setBlog } = useContext(BlogContext)
    let commentsArr = comments?.results
     console.log(total_parent_comments , totalParentComments)
   const loadMoreComments = async() =>{
    let newCommentsArr = await fetchComments({skip:totalParentComments,blog_id:_id,setTotalParentCommentFun:setTotalParentComments,comment_array:commentsArr})
   
    
   
    setBlog({...blog,comments:newCommentsArr})
   }
    return (
        <div
            className={`fixed max-sm:w-full w-[40%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 
  duration-700 overflow-y-auto overflow-x-hidden
  ${commentsVisible
                    ? "top-0 sm:right-0"
                    : "top-[100%] sm:right-[-100%]"} 
  max-sm:right-0 sm:top-0`}
        >
            <div className="relative" >
                <h1 className="text-xl font-medium" >Comments</h1>
                <p className="text-lg mt-2 text-dark-grey w-[70%] line-clamp-1" >{title}</p>
                <button className=" absolute top-0 right-0 flex justify-center items-center w-12 h-12 bg-grey/50 rounded-full md:hidden " >
                    <i className="fi fi-br-cross  " onClick={()=>setCommentsVisible(prev=>!prev)} />
                </button>
                <hr className="border-grey my-8 w-[120%] -ml-10" />
                <CommentField action="comment" />
                {
                    commentsArr && commentsArr.length ?
                    commentsArr.map((comment,i)=>{
                        return <AnimationWrapper key={i} >
                            <CommentCard index={i} leftVal={comment.childrenLevel*4} commentData={comment} />
                        </AnimationWrapper>
                    }) : <NoDataMessage message="No comments" />
                }
                {
                    total_parent_comments > totalParentComments ? <button onClick={loadMoreComments}  className="text-dark-grey p-2 px-3hover:bg-grey/30 rounded-md flex items-center gap-2">
                        Load more
                    </button>: " no load more " 
                }
                </div>

        </div>
    )
}
export default CommentContainer