
import { initializeApp } from "firebase/app";
import {GoogleAuthProvider} from "firebase/auth"
import { getAuth ,signInWithPopup} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2FjOCmKSspTehqA51amvNv5pDh1WdHGg",
  authDomain: "react-js-blogging-websit-d2b6e.firebaseapp.com",
  projectId: "react-js-blogging-websit-d2b6e",
  storageBucket: "react-js-blogging-websit-d2b6e.firebasestorage.app",
  messagingSenderId: "558507754968",
  appId: "1:558507754968:web:c40e2036ec29760a4bdead"
};


const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth();
let user=null;
const authorizeGoogle= async()=>{
    await signInWithPopup(auth,provider).then((result)=>{
           user =  result.user 
     }).catch((err)=>{
        console.log(err.message)
     })
     return user;
}
export {authorizeGoogle};