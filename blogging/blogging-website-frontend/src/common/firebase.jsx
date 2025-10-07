import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2FjOCmKSspTehqA51amvNv5pDh1WdHGg",
  authDomain: "bucolic-madeleine-65d6d2.netlify.app",
  projectId: "react-js-blogging-websit-d2b6e",
  storageBucket: "react-js-blogging-websit-d2b6e.firebasestorage.app",
  messagingSenderId: "558507754968",
  appId: "1:558507754968:web:c40e2036ec29760a4bdead"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const authorizeGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken(); // ✅ this is the token your backend expects
    return { user: result.user, idToken };
  } catch (err) {
    console.log("Google auth error:", err.message);
    return null;
  }
};

export { authorizeGoogle };
