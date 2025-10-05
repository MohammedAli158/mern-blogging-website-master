import { Link } from "react-router-dom"
import { getDate } from "../common/date"
import AnimationWrapper from "../common/page-animation"
import axios from "axios"

const BlogPostCard = ({content,author,hidden,buttons=false,blogs,setBlogs}) =>{
    
    let {publishedAt, title, tags,des,banner,activity:{total_likes,total_comments},blog_id:id} = content
    let {fullname,username,profile_img} = author
    console.log(fullname,username,profile_img)
   const handleDeletionBlog = async()=>{
    setBlogs(blogs.filter(item=>item.publishedAt != publishedAt))
    console.log(id,"is id")
    console.log(import.meta.env.VITE_SERVER_PATH)

    const data = await axios.post(import.meta.env.VITE_SERVER_PATH+"/delete-blog",{
        blog_id:id
    })
    if (data.data?.error) {
        return toast.error("Failed to delete")
    }
    if (data) {
        return 
    }





    
   }
    return (
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 mb-5">

  {/* Left: Blog preview */}
  <Link to={`/blog/${id}`} className="flex items-center gap-5 flex-grow max-md:w-full">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-3">
        <img
          src={profile_img}
          className={`h-6 w-6 rounded-full${hidden ? " hidden" : ""}`}
        />
        <p className={`text-sm text-gray-700${hidden ? " hidden" : ""}`}>
          {fullname}@{username}
        </p>
        <p className="text-gray-500 text-sm">{getDate(publishedAt)}</p>
      </div>

      <h1 className="text-lg font-semibold leading-tight">{title}</h1>
      <p className="text-gray-600 text-sm mt-2 line-clamp-2 max-sm:hidden md:max-[900px]:hidden">
        {des}
      </p>

      <div className="flex items-center gap-4 mt-3">
        <span className={`btn-light py-1 px-3 text-sm${buttons ? " hidden" : ""}`}>
          {tags[0]}
        </span>
        <span className="flex items-center gap-1 text-gray-700 text-sm">
          <i className="fi fi-rr-heart" /> {total_likes}
        </span>
        <span className={`flex items-center gap-1 text-gray-700 text-sm${buttons ? "" : " hidden"}`}>
          <i className="fi fi-rr-comment" /> {total_comments}
        </span>
      </div>
    </div>

    <div className="h-24 w-24 rounded-md overflow-hidden">
      <img src={banner} className="w-full h-full object-cover" />
    </div>
  </Link>

  {/* Right: Edit/Delete */}
  <div className={`flex items-center gap-4 ml-6${buttons ? "" : " hidden"}`}>
    <Link to={`/editor/${id}`} className="text-blue underline">
      Edit
    </Link>
    <button onClick={handleDeletionBlog} className="text-red underline">
      Delete
    </button>
  </div>
</div>


    )


}
export default BlogPostCard