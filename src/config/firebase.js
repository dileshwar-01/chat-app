import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc,doc, collection, query, getDocs, where } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDx_Zqab7S7FJ23RsbviiWHFnFdT-4qzBI",
  authDomain: "chat-app-byd.firebaseapp.com",
  projectId: "chat-app-byd",
  storageBucket: "chat-app-byd.firebasestorage.app",
  messagingSenderId: "769999230388",
  appId: "1:769999230388:web:7c05d3b986ac546f8f4ee1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username,email,password)=>{
try {
    const res = await createUserWithEmailAndPassword(auth,email, password);
    const user = res.user;
    await setDoc(doc(db,"users",user.uid),{
        id:user.uid,
        username:username.toLowerCase(),
        email,
        name:"",
        avatar:"",
        bio:"Hey! there I am using chat app",
        lastSeen: Date.now()

    })
    await setDoc(doc(db,"chats",user.uid),{
        chatsData:[]
    })
} catch (error) {
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(" "))
}
}

 const login = async (email,password)=>{
    try {
        await signInWithEmailAndPassword(auth,email,password);

    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "))
    }
 }

 const logout= async ()=>{
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "))
    }
   
 }

 const resetPass = async(email) =>{
    if(!email){
        toast.error("Enter your mail");
        return null;
    }
    try {
        const userRef = collection(db,'users');
        const q= query(userRef,where("email","==",email))
        const querySnap = await getDocs(q)
        if(!querySnap.empty){
            await sendPasswordResetEmail(auth,email);
            toast.success("Reset Email Sent")
        }else{
            toast.error("Email doesn't exists")
        }
    } catch (error) {
        console.error(error)
        toast.error(error.message);
    }
 }

export {signup,login,logout,auth,db,resetPass}