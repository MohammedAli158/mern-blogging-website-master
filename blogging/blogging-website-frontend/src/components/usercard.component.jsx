import { Link } from "react-router-dom"
const UserCard = ({user}) =>{
 const {personal_info:{username,fullname,profile_img}}    = user

 return (
    <Link to={`/user/ ${username}`} className="flex gap-5 items-center mb-5" >
        <img src={`${profile_img}`}  className="w-14 h-14 rounded-full" />
        <div>
            <h1 className="line-clamp-1 font-medium text-xl" >{fullname}</h1>
            <p className="text-dark-grey" > @{username}</p>
        </div>
    </Link>

 )
}   
export default UserCard