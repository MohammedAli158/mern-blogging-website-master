import { useState } from "react"
import { BlogContext } from "../pages/blog.page"
import { useContext } from "react"
import CommentField from "./comment-field.component"
import axios from "axios"
import { comment } from "postcss"
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
    setTotalParentCommentFun(prev=>prev+1)
    return res

}
const CommentContainer = () => {
    let {blog:{title} ,commentsVisible, setCommentsVisible, totalParentComments, setTotalParentComment } = useContext(BlogContext)
    console.log(commentsVisible)
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
            </div>

        </div>
    )
}
export default CommentContainer