import { useContext } from "react"
import AnimationWrapper from "../common/page-animation"

import { EditorContext } from "../pages/editor.pages"
import Tag from "./tags.component";
import { Toaster,toast } from "react-hot-toast";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"
import { getSessionStorage } from "../common/session";

 const PublishForm = ()=>{
    const {blog_id} = useParams()
    const user = JSON.parse(getSessionStorage("user"))
    const access_token = user.access_token
    const navigate = useNavigate()
    const {editorState,setEditorState,blog:{content,title,tags,banner,des},setBlog,blog
    } = useContext(EditorContext);
    const handleTitleOnChange =(e)=>{
        let input = e.target
        setBlog({...blog,title:input.value})
    }
    const handleDescriptionOnChange=(e)=>{
        

        let input = e.target;
        if(input.length>200){
            return toast.error("description must contain 200 or less characters")
        }
        setBlog({...blog,des:input.value})
    }
     const handleKeyDown =(e)=>{
       if (e.keyCode == 13) {
        e.preventDefault()
       }
    }
    const handleTagsKeyDown = (e) =>{
        if (e.keyCode==13 || e.keyCode==188) {
             e.preventDefault()
             let tag = e.target.value;
             
             if (tag.length && tags.length<10 && !(tags.includes(tag))  ) {
                    setBlog({...blog, tags:[...tags,tag]})
                    console.log(tags)
                }
                if (tags.includes(tag)) {
                    toast.error("You cant add same tag again")
                }
                if (tags.length==10) {
                    toast.error("you cant add more than ten tags")
                }
                e.target.value=""
        }
    }
    const handleFormSubmit = async (e)=>{
        if (e.target.className.includes('disable')) {
            return;
        }
        if (!title.length) {
           return toast.error("Please dont leave title empty")
           
        }
         if (!des.length) {
           return toast.error("Please dont leave description empty")     
        }
         if (!tags.length) {
           return toast.error("Please dont leave tags empty")     
        }
        let loadint = toast.loading("Publishing Form...")
        e.target.classList.add('disable')
        const blogdata = {
            title,des,content,tags,banner
        }
       try {
         const res = await axios.post(import.meta.env.VITE_SERVER_PATH + "/create-blog",{...blogdata,id:blog_id},{
             headers:{
                 'Authorization' : `Bearer ${access_token}`
             }
         })
         if (res) { 
            toast.dismiss(loadint)
            toast.success("The Blog has been Created")
            
            setTimeout(() => {
                e.target.classList.remove('disable')
                navigate("/")
            }, 500);
         }
       } catch (error) {
        e.target.classList.remove('disable')
            toast.dismiss(loadint)
            console.log(error)
            toast.error(error.message)
       }
       


    }
    return(
       <AnimationWrapper>
        <Toaster/>
        <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 gap-2 py-16  lg:gap-6" >
            <button className="w-12 h-12 absolute right-[5vw] z-12 top-[5%] lg:top-[9%]" onClick={()=>{
                setEditorState("editor")}} >
                <i className="fi fi-br-cross"/>
            </button>
            <div className="max-w-[551px] center" >
                <p className="text-dark-grey mb-1" >Preview</p>
                <div className="w-full aspect-video rounded-lg overflow:hidden mt-5" >
                    <img src={banner}alt="" />
                </div>
                <h1 className="text-clamp-2 text-4xl font-medium mt-2 leading-tight" > {title} </h1>
                <p className="font-gelasio text-xl line-clamp-2 leading-7" >{des}</p>
            </div>
            <div className="borderg-grey lg:border-1 lg:pl-9" >
               <p className="text-dark-grey mb-2 mt-9" >Blog-Title</p>
               <input type="text"  placeholder="Blog-Title" className="input-box pl-5 bg-grey " onChange={handleTitleOnChange}  defaultValue={title}/>
               <p className="text-dark-grey mb-2 mt-9" >Add Short Description About your Blog</p>
               <textarea maxLength='200' className="resize-none input-box leading-8 h-40 pl-4" defaultValue={des} onChange={handleDescriptionOnChange} onKeyDown={handleKeyDown} ></textarea>
               <p className="text-dark-grey text-sm text-right mt-2" > {200-des.length} characters left</p>
               <p className="text-dark-grey mb-2 mt-9" >Topics- Helps in searhing and ranking your posts</p>
               <div className="relative input-box pl-2 py-2 pb-4" ></div>
               <div className="relative input-box pl-2 py-2 pb-4" > 
                    <input type="text" placeholder="Topic"  className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white" onKeyDown={handleTagsKeyDown} />
                   {
                        tags.map((tag,i)=>{
                            return <Tag tag={tag} tagIndex={i}  key={i}/>
                        })
                    }
               </div>
               <p className="text-dark-grey text-sm text-right mt-2" >{10-tags.length} tags left</p>
                <button className="btn-dark" onClick={handleFormSubmit} >Publish</button>
            </div>
        </section>
       </AnimationWrapper>
    )
}
export default PublishForm