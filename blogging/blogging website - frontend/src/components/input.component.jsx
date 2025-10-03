import { useState } from "react";

const InputBoxComponent = ({name,type,placeholder,value,icon,disable=false})=>{
    const [showPass,setShowPass] = useState(false);
    return (
        <div className="relative w-[100%] mb-4"  >

        <input type={type=="password" ? (showPass ? "text" :  "password") :"text" } 
        name={name} 
        placeholder={placeholder} 
        defaultValue={value} 
        className="input-box"
        disabled={disable}
        />
        <i className={"fi " + icon + " input-icon"}/>
       {
           type=="password" ? 
           <i className={"fi fi-rr-eye" + (showPass ? " ":  "-crossed") + " input-icon left-[auto] right-5 cursor-pointer"} onClick={()=>setShowPass(currentval=>!currentval)}></i>
           : ""
           
        }
        </div>
    )
}
export default InputBoxComponent;