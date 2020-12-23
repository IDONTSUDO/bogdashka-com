export const isProd = () =>{
    if(process.env.test !== 'true'){
        return true;
    }else{
        return false;
    }
}