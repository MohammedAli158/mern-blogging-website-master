import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect,useState } from "react";
import Editor from "./pages/editor.pages"
import { getSessionStorage } from "./common/session";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import SideNav from "./components/sidenavbar.component";
export const UserContext = createContext();
const App = () => {
    let [userAuth,setUserAuth] = useState({});
    useEffect( ()=>{
        const user= JSON.parse(getSessionStorage("user"));
        if(user){
           
            setUserAuth(user);
            console.log(userAuth,"this si ")
            
        }else{
            
            setUserAuth({...userAuth,access_token : null})
        }
        
    }
,[])

    return (
        <UserContext.Provider value={ {userAuth,setUserAuth} } >

       <Routes>
        <Route path="editor" element={<Editor />} />
        <Route path="editor/:blog_id" element={<Editor />} />
        <Route path="/" element={<Navbar/>}>
            <Route path="settings" element={<SideNav/>} >
            <Route path="edit-profile" element={<h1>This is edit profile</h1>}/>
             <Route path="change-password" element={<h1>This is change password</h1>}/>
            </Route>
            <Route index element={<HomePage/>} />
            <Route path="sign-in" element={ <UserAuthForm type="sign-in" />} />
            <Route path="sign-up" element={<UserAuthForm type="sign-up" />} />
            <Route path="search/:query" element={<SearchPage/>} />
            <Route path="user/:Username" element={<ProfilePage />}/>
            <Route path="blog/:blog_id" element={<BlogPage/>} />
            <Route path="*" element={<PageNotFound/>}/>
        </Route> 
        
        
       </Routes>
        </UserContext.Provider >
    )
}

export default App;