import { useState } from "react"

const InPageNavigation = ({routes,hidden,defaultActiveIndex,children})=>{
    const [activeIndex,setActiveIndex] =useState(defaultActiveIndex);
    return (
        <>
        <div className="bg-white border-b border-grey relative mb-8 flex flex-nowrap overflow-x-auto" >
            {
                routes.map( (route,t ) =>{
                        return <button key={t} className={"p-4 px-5 capitalize z-index-10 " + (activeIndex == t ? "text-black border-b border-black ":"text-dark-grey border-b border-grey") + (hidden.includes(route) ?" md:hidden" : " " )} onClick={ ()=>{setActiveIndex(t)}} >
                                {route}
                        </button>
                })
            }

        </div>
        {Array.isArray(children)? children[activeIndex]: ""}
        </>
    )
}
export default InPageNavigation