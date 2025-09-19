import { Link } from "react-router-dom"
import { getDate } from "../common/date"
import AnimationWrapper from "../common/page-animation"

const BlogPostCard = ({content,author,hidden}) =>{
    
    let {publishedAt, title, tags,des,banner,activity:{total_likes},blog_id:id} = content
    let {fullname,username,profile_img} = author
   
    return (
        <Link  to={`/blog/${id}`} className="flex gap-8 items-center border-b pb-5 mb-5" >
        <div className="w-full" >
                <div className="flex gap-2 items-center mb-7" >
                    <img src={profile_img} className={`h-6 w-6 rounded-full` + (hidden ? ` hidden` : ` `)}/>
                    <p className={"text-clamp-1"  + (hidden ? ` hidden` : ` `)} >{fullname}@{username}</p>
                    <p className="min-w-fit">{getDate(publishedAt)}</p>
                </div>
                <h1 className="blog-title" >{title}</h1>
                <p className="font-gelasio my-3 font-xl leading-6 max-sm:hidden md:max-[900px]:hidden " >{des}</p>
                <div className="flex gap-5" >
                    <span className="btn-light py-1 px-5" >{tags[0]}</span>
                    <span className="ml-3 flex items-center gap-2" >
                        <i className="fi fi-rr-heart" /> {total_likes}
                    </span>
                </div>
        </div>
        <div className="h-28 aspect-square bg-grey" >
            <img src={banner} className="w-full h-full aspect-square object-cover" />
        </div>
        </Link>
    )


}
export default BlogPostCard