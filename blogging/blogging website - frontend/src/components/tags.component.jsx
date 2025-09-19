import { useContext } from "react"
import { EditorContext } from "../pages/editor.pages"

const Tag=({tag,tagIndex})=>{
    const {blog,blog:{tags},setBlog}= useContext(EditorContext)
    const handleTagRemove = ()=>{
            const tt = tags.filter(t=>t!=tag)
            
            setBlog({...blog,tags:[...tt]})
    }
    const handleTagUpdate=(e)=>{
            if (e.keyCode==13 || e.keyCode==188) {
                e.preventDefault()
                let currentTag = e.target.innerText
                if (currentTag.length) {
                    
                    tags[tagIndex] = currentTag
                    setBlog({...blog,tags})
                    e.target.setAttribute("contentEditable",false)
                }
            }
            
    }
    const setEditable= (e) => {
        e.target.setAttribute("contentEditable",true)
        e.target.focus()
    }
    return(
        <div className="relative py-2 mt-2 mr-2 h-10 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10" >
            <p className="outline-none" onClick={setEditable} onKeyDown={handleTagUpdate} >{tag}</p>
            <button className=" mt-2 rounded-full absolute  top-1/2 -translate-y-1/2 right-3 "  onClick={handleTagRemove}>
                <i className="fi fi-br-cross text-sm pointer-events-none" />
            </button>
        </div>
    )
}
export default Tag