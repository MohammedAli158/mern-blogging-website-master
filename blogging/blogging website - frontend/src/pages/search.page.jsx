import { useParams } from "react-router-dom"
import InPageNavigation from "../components/inpage-navigation.component"
import { useState,useEffect } from "react"
import AnimationWrapper from "../common/page-animation"
import BlogPostCard from "../components/blog-post.component"
import Loader from "../components/loader.component"
import axios from "axios"
import NoDataMessage from "../components/nodata.component"
import UserCard from "../components/usercard.component"
const SearchPage = ()=>{
    const [blogs,setBlogs] = useState(null)
    const {query} = useParams()
    const [page,setPage] = useState(1)
    const [pageStatus, setPageStatus] = useState("search")
    const [users,setUsers] = useState(null)

    const getSearchResults = async ({pageCurrent}) =>{
       try {
         const data = await axios.post(import.meta.env.VITE_SERVER_PATH + "/search-blogs",{query,pageCurrent})
         setPage(data.data.pageCount)
         setBlogs(data.data.blogs)
       } catch (error) {
        console.log(error) 
       }
    }
    const handlePageClick = (e)=>{
        let pagec  = e.target.value
        if (pagec == page) {
            return 
        }
        setPage(pagec)
        getSearchResults({pageCurrent:pagec})
 }
 const fetchUsers  =  async() => {
     const data = await axios.post(import.meta.env.VITE_SERVER_PATH+"/search-users",{
         query
     })
     
     setUsers(data.data.userArray)
     

 }
  useEffect(() => {
    getSearchResults({page})
    fetchUsers()
       
    }, [page,query]) 
    const UserCardWrapper =  () => {
        return(
            <>
                {
                    users == null ? <Loader/>: users.length==0 ? <NoDataMessage message="No User Found" /> : users.map((user,i)=>{
                        return<AnimationWrapper key={i} transition={{duration : 1 ,delay: i*0.08}} >
                            <UserCard  user={user} />
                        </AnimationWrapper>
                    })
                }
            </>

        )
        
    }
    return (

        <section className="h-cover flex gap-10 justify-center" >
            <div className="w-full">

            <InPageNavigation routes={[`Search Results for - ${query}`,`Accounts Matched`]} hidden={['Accounts Matched']} defaultActiveIndex={0} >
                <>
                            {
                                blogs == null ? <Loader /> :
                                    (blogs.length ?
                                        blogs.map((blog, i) => {
                                            return <AnimationWrapper key={i} transition={{ duration: 1, delay: i*0.1 }} ><BlogPostCard content={blog} author={blog.author.personal_info} /></AnimationWrapper>
                                        })
                                        : <NoDataMessage message="No Blogs Published" />
                                    )
                            }
                             {
                            [...Array(page)].map((_, i) => {
                                return <button
                                    index={i+1}
                                    value={i+1}
                                    key={i}
                                    className={`bg-gray-200 border border-gray-400 px-4 py-2 rounded `  }
                                    onClick={handlePageClick}
                                >
                                   {i+1}
                                </button>
                            })
                        }

                </>
                <>
                <UserCardWrapper/>
                </>
            </InPageNavigation>

            </div>
            <div className="min-w-[40%] lg:min-w-[377px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden"  >
                    <h1 className="font-medium text-xl mb-8 inline-block" >Users Related to Search</h1>
                    <i className="fi fi-rr-user ml-3" />
                    <UserCardWrapper/>
            </div>
        </section>
    )
}
export default SearchPage