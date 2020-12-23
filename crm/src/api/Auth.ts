export const isAuthenticated = ():boolean =>{
    const data = localStorage.getItem('authData');
    if(data != undefined){
        return true
    }else{
        return true;
    }
}
export const signIn = (email) =>{
    localStorage.setItem('authData', email);
}