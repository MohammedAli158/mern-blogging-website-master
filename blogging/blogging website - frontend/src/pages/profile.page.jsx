import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import AnimationWrapper from "../common/page-animation"
import Loader from "../components/loader.component"
import { getSessionStorage } from "../common/session"
import { useContext } from "react"
import { UserContext } from "../App"
import AboutUser from "../components/about.component"
import BlogPostCard from "../components/blog-post.component"
import InPageNavigation from "../components/inpage-navigation.component"
import NoDataMessage from "../components/nodata.component"
const ProfilePage =  () => {
    const {userAuth} = useContext(UserContext)
    const [loading,setLoading] = useState(true)
    let userna = userAuth.username
    const [profile, setProfile] = useState({
  personal_info: {
    fullname: "loading",
    username: "loading",
    profile_img: " ",
    bio: "loading"
  },
  account_info: {
    total_posts: 0,
    total_reads: 0
  },
  social_links: {
   
  },
  joinedAt: " "
})
const blogS = {
    title : '',
    banner: '',
    content : '',
    tags:[],
    des:'',
    author : {personal_info:{}},
    activity:{total_likes:0}
}
    const [page, setPage] = useState(1)
    const [blogs,setBlogs] = useState([blogS])
    const [pageCount,setPageCount] = useState(5)


    let {Username} = useParams()
    let { personal_info:{fullname,username,profile_img,bio},account_info:{total_posts,total_reads},social_links,joinedAt,_id } = profile
    const fetchProfile= async()=>{
        
        
        try {
            const data = await axios.post(import.meta.env.VITE_SERVER_PATH +"/get-profile", { Username } )
            setProfile(data.data.profile)
            setLoading(false)
        } catch (error) {
            console.log(error.message)
            setLoading(false)
        }
    }
    const handlePageClick = async(e)=>{
        let pagec = e.target.value;
        if (pagec == page) {
            console.log("since pagec == page returning")
            return 
        }
        setPage(e.target.value)

    }
    const fetchBlogs = async()=>{
        try {
            const blogs = await axios.post(import.meta.env.VITE_SERVER_PATH+"/search-blogs", {
                pageCurrent : page,
                 _id
            })
            
    
            if (blogs) {
               
                setBlogs(blogs.data.blogs)
                setPageCount(blogs.data.pageCount)
                
            }
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(()=>{
        fetchProfile()
        
    },[Username])
    useEffect(()=>{
        fetchBlogs()
       
    },[page,_id])
    return(
        <AnimationWrapper>
  <div className="max-md:mt-12 w-full md:flex md:items-start md:gap-8">
    {/* Left: Tabs (Blogs/About) */}
    <div className="flex-1">
      <InPageNavigation
        routes={["Blogs", "About"]}
        hidden={["About"]}
        defaultActiveIndex={0}
      >
        <div className="ml-14">   {/* or p-4 / mt-4 depending on direction */}
  {!blogs ? (
    <Loader />
  ) : blogs.length ? 
    (
  <>
    {blogs.map((blog, i) => (
      <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
        <BlogPostCard hidden={true} content={blog} author={blog.author.personal_info} />
      </AnimationWrapper>
    ))}
    <div className="w-120px flex gap-2">
      {[...Array(pageCount)].map((_, i) => (
        <button
          value={i + 1}
          key={i}
          className={`bg-gray-200 border border-gray-400 px-4 py-2 rounded`}
          onClick={handlePageClick}
        >
          {i + 1}
        </button>
      ))}
    </div>
  </>
    

  ) : (
    <NoDataMessage message="No Blogs Published" />
  )
  }
</div>

        <>
          <div className="flex flex-col gap-5 min-w-[250px]">
            <img
              src={profile_img}
              className="h-[40%] w-[40%] rounded-full bg-grey "
            />
            <h1 className="text-3xl font-medium">@{username}</h1>
            <p className="text-2xl capitalize h-6">{fullname}</p>
            <p>
              {total_posts.toLocaleString()}-Blogs{" "}
              {total_reads.toLocaleString()}-Reads
            </p>
            <div className="flex gap-4 mt-2">
              {Username == userna ? (
                <Link to="/settings/edit-profile" className="btn-light rounded-md">
                  Edit Profile
                </Link>
              ) : (
                " "
              )}
            </div>
            <AboutUser
              userid={_id}
              bio={bio}
              social_links={social_links}
              joinedAt={joinedAt}
            />
          </div>
        </>
      </InPageNavigation>
    </div>

    {/* Right: Profile card for large screens */}
    <section className="hidden md:flex flex-col max-md:items-center gap-5 min-w-[250px]">
      <img
        src={profile_img}
        className="h-[40%] w-[40%] rounded-full bg-grey md:h-32 md:w-32"
      />
      <h1 className="text-3xl font-medium">@{username}</h1>
      <p className="text-2xl capitalize h-6">{fullname}</p>
      <p>
        {total_posts.toLocaleString()}-Blogs {total_reads.toLocaleString()}-Reads
      </p>
      <div className="flex gap-4 mt-2">
        {Username == userna ? (
          <Link to="/settings/edit-profile" className="btn-light rounded-md">
            Edit Profile
          </Link>
        ) : (
          " "
        )}
      </div>
      <AboutUser
        userid={_id}
        bio={bio}
        social_links={social_links}
        joinedAt={joinedAt}
      />
    </section>
  </div>
</AnimationWrapper>

    )
}
export default ProfilePage