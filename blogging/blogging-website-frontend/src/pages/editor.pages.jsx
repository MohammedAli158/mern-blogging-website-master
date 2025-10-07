import { createContext, useContext,useEffect,useState } from "react"
import { UserContext } from "../App"
import BlogEditor from "../components/blog-editor.component"
import { Navigate, useParams } from "react-router-dom"
import PublishForm from "../components/publish-form.component"
import Loader from "../components/loader.component"
import axios from "axios"
const blogStructure ={
    title : '',
    banner: '',
    content : '',
    tags:[],
    des:'',
    author : {personal_info:{}}
}
export const EditorContext = createContext({})

const Editor = () =>{
    const {blog_id} = useParams()
    let [loading,setLoading] = useState(true)
    let [blog,setBlog] = useState(blogStructure)
    let [editorState,setEditorState] = useState("editor")
    let [textEditor,setTextEditor] = useState({ isReady : false })
    let {userAuth:{access_token},setUserAuth} = useContext(UserContext)
    useEffect(()=>{
        if(!blog_id){
            return setLoading(false)
        }
        axios.post(import.meta.env.VITE_SERVER_PATH+"/get-blog-info",{
            blog_id, draft:true , mode:'edit'
        }).then(({data})=>{
            if (Object.entries(data).length === 0){
            return toast.error("The blog doesn't exist")
        }
            setBlog(data)
            setLoading(false)
        }).catch(err=>{
            console.log(err)
            setLoading(false)
            setBlog(null)
        })
    },[])
    
    return (
        <EditorContext.Provider value={{blog,setBlog,editorState,setEditorState,textEditor,setTextEditor}} >  
            {
                access_token===undefined ? <Navigate path="/sign-in"/> : 
                loading ? <Loader/> : 
                ( editorState=="editor" ? 
                <BlogEditor/> : <PublishForm/>)
            }
        </EditorContext.Provider>
    )
}
export default Editor