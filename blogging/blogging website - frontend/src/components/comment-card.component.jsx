import { getDate } from "../common/date"

const CommentCard = ({index,leftVal,commentData}) =>{
    let { commented_by:{personal_info:{profile_img,username,fullname}},commentedAt,comment} = commentData
    return (
       <div className="w-full" style={{paddingLeft : `${leftVal*10}px`}} >
        <div className="my-5 p-6 rounded-md border border-grey" >
        <div className="flex gap-3items-center mb-7" >
        <img src={profile_img} className="w-6 h-6 rounded-full " />
        <p className="line-clamp-1" >{username}@{fullname}</p>
        <p className="min-w-fit" >{getDate(commentedAt)}</p>
        </div>
        <p className="font-gelasio text-xl ml-3" >{comment}</p>
        </div>
       </div>
    )
}
export default CommentCard