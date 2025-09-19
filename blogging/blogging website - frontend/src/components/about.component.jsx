import {Link} from "react-router-dom"
import { getFullDay } from "../common/date"
import { useState } from "react"
import axios from "axios"
import { useEffect } from "react"
const AboutUser = ({bio ,userid, social_links,joinedAt})=>{


    return(
        <div className="md:w-[90%] md:mt-7 max-md:hidden" > 
        
        <p className="text-xl leading-7" >{
            bio.length ? bio : "Nothing to read here"
        }</p>
        <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey" >
        {
            Object.keys(social_links).map((key)=>{
                let links = social_links[key]
                return links.length ? <Link to={links} key={key}  target="_blank" > <i className={`fi ` + (key=="website" ? `fi-rr-globe` :`fi-brands-${key}`)+ " text-2xl hover:text-black"} /></Link> : " "
})
        }
        </div>
        <p className="text-xl leading-7 text-dark-grey max-md:hidden" > Joined At-
            {
                 getFullDay(joinedAt)
            }

        </p>

       
        </div>
    )
}
export default AboutUser