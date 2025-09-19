import { useEffect, useState } from "react"
import AnimationWrapper from "../common/page-animation"
import InPageNavigation from "../components/inpage-navigation.component"
import axios from "axios"
import Loader from "../components/loader.component"
import BlogPostCard from "../components/blog-post.component"
import MinimalBlogPost from "../components/nobanner-blog-post.component"
import NoDataMessage from "../components/nodata.component"
import PageArrayCard from "../components/pageArray.component"
const HomePage = () => {
    const [ActivePage,setActivePage] = useState(1)
    const [blogs, setBlogs] = useState(null)
    const [page, setPage] = useState(1)
    const [trendingBlogs, setTrendingBlogs] = useState(null)
    const [pageStatus, setPageStatus] = useState("home")
    let categories = ['AI', 'Tech', 'Creative', 'Animals', 'Sports']
    const handleTagClick = async (e) => {
        let category = e.target.innerText.toLowerCase()
        setPageStatus(category)

        if (category == pageStatus) {
            setPageStatus("home")
            console.log(category, pageStatus)

            e.target.classList.remove("bg-black")
            e.target.classList.remove("text-white")

            return;
        }
        else {

            const tags = document.querySelectorAll(" .tag")
            tags.forEach(tag => {
                tag.classList.remove("bg-black")
                tag.classList.remove("text-white")
            })
            e.target.classList.add("bg-black")
            e.target.classList.add("text-white")
            setActivePage(1)
            try {
                const data = await axios.post(import.meta.env.VITE_SERVER_PATH + "/search-blogs", { tag: category })
                setBlogs(data.data.blogs)
                return;
            } catch (error) {
                console.log(error)
            }
        }
    }
    const getBlogs = async ({pageCurrent}) => {
        
        try {
            const data = await axios.post(import.meta.env.VITE_SERVER_PATH + "/get-blogs", { pageCurrent })
            setPage(data.data.pageCount)
            setBlogs(data.data.blogs)
        } catch (error) {
            console.log(error)
        }
    }
    const getTrendingBlogs = async () => {
        try {
            const data = await axios.get(import.meta.env.VITE_SERVER_PATH + "/trending-blogs")
           
            setTrendingBlogs(data.data.blogs)
        } catch (error) {
            console.log(error)
        }
    }
    const handlePageClick = (e)=>{
        let pagec  = e.target.value
        if (pagec == ActivePage) {
            console.log("aha")
            return 
        }
        setActivePage(pagec)
        getBlogs({pageCurrent:pagec})



    }
    useEffect(() => {

        if (pageStatus == "home") {
            getBlogs({pageCurrent:1})
        }
        if (!trendingBlogs) {
            getTrendingBlogs()
        }
    }, [pageStatus, page])

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10 " >
                <div className="w-full" >
                    {/* this div is for home page  */}
                    <InPageNavigation routes={[pageStatus, "trending blogs"]} hidden={["trending blogs"]} defaultActiveIndex={0} >
                        <>
                            {
                                blogs == null ? <Loader /> :
                                    (blogs.length ?
                                        blogs.map((blog, i) => {
                                            return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }} ><BlogPostCard content={blog} author={blog.author.personal_info} /></AnimationWrapper>
                                        })
                                        : <NoDataMessage message="No Blogs Published" />
                                    )
                            }
                        </>
                        <>
                            {
                                trendingBlogs == null ? <Loader /> :
                                    (trendingBlogs.length ?
                                        trendingBlogs.map((blog, i) => {
                                            return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }} ><MinimalBlogPost key={i} blog={trendingBlogs} index={i} /></AnimationWrapper>
                                        }) : <NoDataMessage message="No trends recently" />
                                    )
                            }
                        </>
                    </InPageNavigation>
                    <div className="w-120px flex gap-2" >

                        {
                            [...Array(page)].map((_, i) => {
                                return <button
                                    index={i+1}
                                    value={i+1}
                                    key={i}
                                    className={`bg-gray-200 border border-gray-400 px-4 py-2 rounded ` + ( pageStatus!="home" ? `hidden `:` `) }
                                    onClick={handlePageClick}
                                >
                                   {i+1}
                                </button>
                            })
                        }
                    </div>

                </div>
                {/* this div is for trending section and filters */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-5 max-sm:hidden " >
                    <h1 className="font-medium text-xl " >Stories of your Interest</h1>

                    <div className="flex flex-wrap gap-3 m-5 py-3 border-b border-grey" >
                        {
                            categories.map((category, i) => {
                                return <button onClick={handleTagClick} className="tag " key={i} >{category}</button>
                            })
                        }
                    </div>


                    <div className="flex gap-5" >

                        <h1 className="font-medium text-xl mb-8" >Trending</h1>
                        <i className="fi fi-rr-arrow-trend-up" />
                    </div>
                    {
                        trendingBlogs == null ? <Loader /> :
                            (trendingBlogs.length ?
                                trendingBlogs.map((blog, i) => {
                                    return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }} ><MinimalBlogPost key={i} blog={trendingBlogs} index={i} /></AnimationWrapper>
                                }) : <NoDataMessage message="No trends recently" />
                            )
                    }

                </div>

            </section>
        </AnimationWrapper>
    )
}
export default HomePage