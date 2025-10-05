import axios from "axios"
import { useEffect } from "react"
import { getSessionStorage } from "../common/session"
import { useState } from "react"
import BlogPostCard from "../components/blog-post.component"

const BlogManagementPage = ()=>{
    let [blogArray,setBlogArray] = useState([])
    let [page,setPage] = useState(1)
    let pageCurrent = 1
    let u = JSON.parse(getSessionStorage("user"))
    console.log(u.username)
    const fetchBlogs = async() =>{
        let data = await axios.post(import.meta.env.VITE_SERVER_PATH+"/search-blogs",{
            un:u.username
        })
        if (data) {
            console.log(data.data)
            let ali = data?.data?.blogs
            setBlogArray([...blogArray,...ali])
            setPage(data?.data?.pageCount)
        }
    }
    const handlePageClick =(e)=>{
        let skip = e.target.value;
        let pageCurrent = skip
        
        axios.post(import.meta.env.VITE_SERVER_PATH+'/search-blogs',{
            pageCurrent,un:u.username
        }).then(({data})=>{
            console.log("data",data)
            let ali = data.blogs
            setBlogArray([...ali])
        }).catch(err=>{
            console.log(err.message)
        })
    }
    useEffect(()=>{
    fetchBlogs()
    },[])
    return (
        <div className="relative">
        <h1 className=" max-md:hidden mb-6 font-bold text-xl " >Blog Management</h1>
       <div className="mb-10" >
         {
            blogArray.map((bl,i)=>{
                return <BlogPostCard content={bl} key={i} author={bl.author.personal_info} blogs={blogArray} setBlogs={setBlogArray} buttons={true} />
            })
        }
       </div>
       
        <div className="absolute mt-auto" >
            {
            
                            [...Array(page)].map((_, i) => {
                                return <button
                                    index={i+1}
                                    value={i+1}
                                    key={i}
                                    className={`bg-gray-200 border border-gray-400 px-4 py-2 rounded `}
                                    onClick={handlePageClick}
                                >
                                   {i+1}
                                </button>
                            })
                        }
        </div>
        

        </div>
    )

}
export default BlogManagementPage