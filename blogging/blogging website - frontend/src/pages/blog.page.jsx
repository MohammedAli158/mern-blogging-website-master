import axios from "axios"
import { createContext, useEffect, useState } from "react"
import { useParams,Link } from "react-router-dom"
import AnimationWrapper from "../common/page-animation"
import Loader from "../components/loader.component"
import { getFullDay } from "../common/date"
import BlogInteraction from "../components/blog-interaction.component"
import BlogPostCard from "../components/blog-post.component"
import BlogContent from "../components/blog-content.component"
import toast, { Toaster } from "react-hot-toast"
import CommentContainer from "../components/comments.component"
export const BlogStructure = {
    title : '',des:'',content:[],tags:[],author:{personal_info:{fullname:'',username:'',profile_img:''}},banner:'',publishedAt:'',activity: {
      total_likes: 0,
      total_comments: 0,
      total_reads: 0,
      total_parent_comments: 0
    }
}
export const BlogContext = createContext({})

const BlogPage = ()=>{
    const [blog,setBlog] = useState(BlogStructure)
    let {title,des,content,tags,author:{_id,personal_info:{fullname,username:author_username,profile_img}},banner,publishedAt,activity:{total_likes,total_reads,total_comments,total_parent_comments}} = blog 
    const [similarBlogs,setSimilarBlogs] = useState([BlogStructure])
    const {blog_id} = useParams()
    const [loading,setLoading] = useState(true)
    let [likes,setLikes] = useState(total_likes)
    let [like,setLike] = useState(true);
    let[commentsVisible,setCommentsVisible] = useState(false)
    let [totalParentComments,setTotalParentComments] = useState(0)
const fetchBlogs = async()=>{
    try {
        const data = await axios.post(import.meta.env.VITE_SERVER_PATH+"/get-blog-info",{
            blog_id
        })
        
      
        
        if (data) {
            setBlog(data.data)
            
            setLoading(false)
        }
        
        
        
    } catch (error) {
        console.log(error)
        setLoading(false)
    }
} 
const fetchSimilarBlogs = async()=>{
    const sim = await axios.post(import.meta.env.VITE_SERVER_PATH+"/search-blogs",{
        tag:blog.tags[0],eliminate_blog : blog_id
    })
    setSimilarBlogs(sim.data.blogs)
}


useEffect(()=>{
    
    fetchBlogs()
    
    setLoading(false)
    
    
    
},[blog_id])
useEffect(()=>{
    
    fetchSimilarBlogs()


},[blog])

    return(
        <AnimationWrapper>
        <Toaster/>
            {
                loading ? <Loader/>:
                <BlogContext.Provider value={{blog,setBlog,likes,setLikes,like,setLike,commentsVisible,setCommentsVisible,totalParentComments,setTotalParentComments}} >
                     <CommentContainer />
                    <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                    
                    <img src={banner} className="aspect-video" />
                    <h2 className="mt-12" >{title}</h2>
                    <div className="flex max-sm:flex-col justify-between my-8" >
                        <div className="flex gap-5 items-start" >
                            <img src={profile_img} className="w-12 h-12 rounded-full" alt="" />
                            <p className="capitalize" >{fullname} <br/> @ <Link className="underline" to={`/user/ ${author_username}`} > {author_username}</Link> </p>
                        </div>
                        <p className="text-dark-grey opacity-75 max-sm:mt-6 max-mt:ml-12 max-sm:pl-5" >
                            Published at -{getFullDay(publishedAt)}
                        </p>
                    </div>
                 </div>
                <BlogInteraction/>
                {
                    content.length ? content[0].blocks.map((block,i)=>{
                        return <BlogContent block={block} key={i}  className="my-4 md:my-9"/>
                    }) : ""
                }
                <BlogInteraction/>
                {
                   similarBlogs.length >= 1 && similarBlogs[0].title 
                   ? 
                   <>
                   <h1 className="text-2xl mt-14 mb-10 font-medium" >Similar Blogs</h1>
                   {
                    similarBlogs.map((blog,i)=>{
                        let {author:{personal_info}} = blog
                        return <AnimationWrapper key={i} >
                            <BlogPostCard content={blog} author={personal_info} />
                        </AnimationWrapper>
                    })
                   }
                   </>
                   : <h1>No blogs</h1>
                }
                 </BlogContext.Provider>
            }
        </AnimationWrapper>
    )
}
export default BlogPage