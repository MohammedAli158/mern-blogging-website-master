import AnimationWrapper from "../common/page-animation"
import logo from "../imgs/logo.png"
import { Link, useNavigate, useParams } from "react-router-dom"
import defaultBanner from "../imgs/blog banner.png"
import EditorJS from "@editorjs/editorjs"
import axios from 'axios'
import {Toaster , toast} from "react-hot-toast"
import { useContext ,useState} from "react"
import { EditorContext } from "../pages/editor.pages"
import { useEffect } from "react"
import { tools } from "./tools.component"
import { getSessionStorage } from "../common/session"


const BlogEditor = ()=>{
    const blog_id = useParams()
     const navigate =useNavigate()
     const user = JSON.parse(getSessionStorage("user"))
        const access_token = user.access_token
    const {blog,blog:{title,content,des,tags,banner},setBlog,textEditor,setTextEditor,setEditorState} = useContext(EditorContext)
    //
    useEffect(()=>{
        setTextEditor( new EditorJS({
            "holder" : "textEditor",
            "data": Array.isArray(content)? content[0] :content,
            "placeholder":"Give your ideas a Virtual Existence",
            "tools" : tools,
            "defaultBlock": 'paragraph'
        }))
        
    },[])
   
    const imageUploadHandler =async (e)=>{
            let img = e.target.files[0]
            if (!img) return;
            let form = new FormData();
            form.append("banner",img)
            
            const {data} = await axios.post(import.meta.env.VITE_SERVER_PATH+"/editor",form,{
                headers : {
                    "Content-Type" : "multipart/form-data"
                }
            });
            let toastloading = toast.loading("Uploading Banner")
            if (data.publicUrl) {
               
                toast.dismiss(toastloading)
                setBlog({...blog,banner:data.publicUrl})
            }


    }
    const handleKeyDown =(e)=>{
       if (e.keyCode == 13) {
        e.preventDefault()
       }
    }
    const handleTitleOnChange = (e)=>{
       let input = e.target;
       input.style.height = "auto";
       input.style.height = input.scrollHeight + "px"
       setBlog({...blog,title:e.target.value})
    }
    const handlePublish =()=>{
        if(!banner){
            return toast.error("Please Upload a banner")
        }
        if(!title.length){
            return toast.error("Please dont leave the title empty")
        }
        if(textEditor.isReady){
            textEditor.save().then(data=>{
                
                if(data.blocks.length){
                    setBlog({...blog, content: data})
                    setEditorState("Publish")
                }else{
                    toast.error("Please write something")
                }
            })
        }
    }
    const handleSaveDraft = async(e)=>{
        if(!title.length){
            return toast.error("Title is required for saving draft")
        }
        let loadint = toast.loading("Saving as Draft...")
        e.target.classList.add('disable')
        const blogdata = {
            title,des,content,tags,banner,draft:true
        }
        try {
         const res = await axios.post(import.meta.env.VITE_SERVER_PATH + "/create-blog",{...blogdata,id:blog_id},{
             headers:{
                 'Authorization' : `Bearer ${access_token}`
             }
         })
         if (res) {
            toast.dismiss(loadint)
            toast.success("The Blog has been Drafted Successfully")
            
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
       


    
      //  toast.dismiss(loadint)

    }
    return (

        <>
       <nav  className="navbar">
        <Link to="/" className="flex-none w-10" >
        <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full" >
           { title=='' ? 'New Blog' : `${title}`}
        </p>
        <div className="flex gap-5 ml-auto" >
            <button className="btn-dark py-2"  onClick={handlePublish} >Publish</button>
            <button className="btn-light py-2 "  onClick={handleSaveDraft} >Save Draft</button>
        </div>

       </nav>
       <Toaster />
        <AnimationWrapper>
            <section>
                <div className=" mx-auto max-w-[900px] w-full" >
                    <div  className=" relative aspect-video reative bg-white border-4 border-grey " >
                       <label htmlFor="uploadBanner">
                        <img src={banner? banner: defaultBanner} alt="" className="z-index-20"/>
                        <input type="file" id="uploadBanner" accept=" .png, .jpg, .jpeg" hidden onChange={imageUploadHandler} />
                       </label>
                    </div>
                </div>
                <textarea
                placeholder="Blog-Title" className="text-4xl outline-none resize-none font-medium w-full h-20 placeholder:opacity-40 mt-10 " onKeyDown={handleKeyDown} onChange={handleTitleOnChange} defaultValue={title}
                ></textarea>
                <hr className="w-full opacity-10 my-3" />
                <div id="textEditor" >

                </div>
            </section>

        </AnimationWrapper>

        </>
    )
}
export default BlogEditor