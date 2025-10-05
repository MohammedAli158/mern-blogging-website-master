import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import axios from "axios"
import NotificationCard from "../components/notification-card.component"
const Notifications = ()=>{
    let {userAuth,setUserAuth} = useContext(UserContext)
    let access_token = userAuth?.access_token
    const [filter,setFilter] = useState('all')
    let filters = ['all','like','comment','reply']
    let [cardState,setCardState] = useState([])
    let [alwaysCardState,setAlwaysCardState] = useState([])
    let c = 1
    const fetchNotifications = async({page=1,deletedCount=0}) =>{
        const data = await axios.post(import.meta.env.VITE_SERVER_PATH+"/notifications",{
            page,deletedCount,filter:'all'
        },{
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        })
        if (data) {
            let ali = data.data
            let seen = ali.filter(item=>item.seen==true)
            let notSeen = ali.filter(item=>item.seen==false)
            setCardState([...cardState,...notSeen])
            setAlwaysCardState([...alwaysCardState,...seen])
        }
    }
    const loadMore = (e)=>{
        c = c+ 1
        fetchNotifications({page:c,deletedCount:0})
    }
    useEffect(()=>{
        fetchNotifications({page:c,deletedCount:0})
    },[access_token])
   useEffect(()=>{
if (cardState.length==0) {
    setUserAuth({...userAuth,new_notification_available:false})
}

   },[cardState])
   
    return (
        <>
        <h1 className="max-md:hidden" >Recent Notifications </h1>

        <div className="my-5" >
            {
            
            filters.map((filtername,i)=>{
                return <button className={" py-3 btn-light" + (filter==filtername ? " bg-black text-white" : "" ) } key={i} onClick={()=>{
                    setFilter(filters[i])

                }} >{filtername}</button>
            })
        }
        </div>
        <div>
            {
                (cardState.length==0) ? <h1> You are all caught up </h1> : " "
            }
           {
            cardState.map((notif,i)=>{
                
                return (filter === 'all' || filter === notif.type ) ? 
                <NotificationCard cardState={cardState}  alwaysCardState={alwaysCardState} setAlwaysCardState={setAlwaysCardState} setCardState={setCardState} title={notif.blog.title} blog_id={notif?.blog?.blog_id} key={i} notid={notif?._id} type={notif?.type} banner={notif?.blog?.banner} createdAt={notif?.createdAt} by={notif?.user} comment={notif?.comment?.comment}  />  : <h1>You are all caught up</h1> 
            })
            }
            <button className="btn-light h-15 text-sm bg-white text-black" onClick={loadMore}  >Load More</button>
            <h1 className="my-15" >Seen Notifications</h1>
            {
                alwaysCardState.map((notif,i)=>{
                
                return (filter === 'all' || filter === notif.type ) ? 
                <NotificationCard cardState={cardState}  alwaysCardState={alwaysCardState} setAlwaysCardState={setAlwaysCardState} setCardState={setCardState} title={notif.blog?.title} blog_id={notif?.blog?.blog_id} key={i} notid={notif?._id} type={notif?.type} banner={notif?.blog?.banner} createdAt={notif?.createdAt} by={notif?.user} comment={notif?.comment?.comment} mark={false} />  : <h1>You are all caught up</h1>
            })
        }
           
        </div>
        </>
    )
}
export default Notifications