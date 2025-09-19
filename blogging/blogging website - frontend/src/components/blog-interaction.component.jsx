import { useContext } from "react"
import { BlogContext } from "../pages/blog.page"
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const BlogInteraction = ()=>{
    let {blog:{title,blog_id,activity:{total_likes,total_comments},author:{personal_info:{username:author_username}}},setBlog} = useContext(BlogContext);
    let {userAuth:{username}} = useContext(UserContext)
    return (
        <>
        <hr className="my-2 border-grey"/>
        <div className="flex gap-6 justify-between" >
            <div className="flex gap-3 items-center" >
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" >
                    <i className="fi fi-rr-heart" />
                </button>
                <p>{total_likes}</p>
            
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" >
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