import { useRef } from "react";
import { getDate } from "../common/date";
import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const NotificationCard = ({title,mark=true,alwaysCardState,setAlwaysCardState, setCardState,cardState,blog_id,type, banner, createdAt, by, comment = "" ,notid}) => {
    const navivate = useNavigate()
    let {userAuth:{access_token}} = useContext(UserContext)
  const [hide,setHide] = useState(false)
const handleSeen = async(e)=>{
    e.target.setAttribute("disabled",true)
    const n = await axios.post(import.meta.env.VITE_SERVER_PATH+"/delete-notification",{
        _id:notid
    },{
        headers:{
            Authorization:`Bearer ${access_token}`
        }
    })
    if (n?.data?.error) {
        return toast.error("Problem while marking..")
    }
    e.target.removeAttribute("disabled")
    // setHide(true)
    let a = cardState.filter(item=>item._id!=notid)
    setCardState([...a])
    let b = cardState.filter(item=>item._id==notid)
    console.log(b,"sending from above to below")
    
    setAlwaysCardState([...alwaysCardState,...b])
    

}

  return (
    <div className={"border-b py-3 border-grey relative max-h-[310px] bg-white flex items-center gap-5 my-3" + (hide ?  " hidden ": " ") } onClick={()=>navivate(`/blog/${blog_id}`)}  >
      {/* Leftmost image */}
      <div className="flex-shrink-0" >
        <img
          className="aspect-video object-cover max-h-16 rounded-lg"
          src={banner}
        />
      </div>

      {/* Middle comment/reply area */}
      <div className="flex-1">
        <h1 className="capitalize font-bold text-xl" >{title}</h1>
        {comment && <div className="line-clamp-1" >{comment}</div>}
      </div>
      <div>
        <button className={"btn-light rounded-md text-sm p-3 cursor-pointer z-5 " + (mark ? " " : " hidden " ) } onClick={handleSeen} >Mark as seen</button>
      </div>

      {/* Right side info */}
      <div className="flex items-center space-x-2">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={by?.personal_info.profile_img}
          alt={by?.personal_info.username}
        />
        <h1 className="text-m">
          {type} by <span className="text-xl">{by?.personal_info.username}</span>
        </h1>
        <p>{getDate(createdAt)}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
