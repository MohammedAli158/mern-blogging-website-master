import { Link } from "react-router-dom"
import { getDate } from "../common/date"

const MinimalBlogPost =({blog,index})=>{
    let {title,blog_id:id, author:{personal_info:{fullname,username,profile_img}},publishedAt }= blog[index]
   

    return (
        <Link to={`/blog/${id}`} className="flex mb-8 border-b border-grey py-3 gap-5" >
        <h1 className="blog-index" >{index<10 ? "0"+ (index+1):(index+1) }</h1>
        <div>
            <div className="flex gap-2 items-center mb-7" >
                <img src={profile_img} className="h-6 w-6 rounded-full"/>
                <p className="text-clamp-1" >{fullname}@{username}</p>
                <p className="min-w-fit">{getDate(publishedAt)}</p>
            </div>
            <div>
                <h1 className="blog-title" > {title}</h1>
            </div>
        </div>
        </Link>
    )


}
export default MinimalBlogPost