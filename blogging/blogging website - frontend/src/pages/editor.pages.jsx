import { createContext, useContext,useState } from "react"
import { UserContext } from "../App"
import BlogEditor from "../components/blog-editor.component"
import { Navigate } from "react-router-dom"
import PublishForm from "../components/publish-form.component"
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
    let [blog,setBlog] = useState(blogStructure)
    let [editorState,setEditorState] = useState("editor")
    let [textEditor,setTextEditor] = useState({ isReady : false })
    let {userAuth:{access_token},setUserAuth} = useContext(UserContext)
    
    return (
        <EditorContext.Provider value={{blog,setBlog,editorState,setEditorState,textEditor,setTextEditor}} >  
            {
                access_token===undefined ? <Navigate path="/sign-in"/> :( editorState=="editor" ? 
                <BlogEditor/> : <PublishForm/>)
            }
        </EditorContext.Provider>
    )
}
export default Editor