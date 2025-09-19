export const setSessionStorage = (key,value)=>{
    return sessionStorage.setItem(key,value);
}
export const getSessionStorage =(key)=>{
    return sessionStorage.getItem(key);
}
export const removeSessionStorage =(key)=>{
    return sessionStorage.removeItem(key)
}
export const logoutUser =()=>{
    return sessionStorage.clear();
}