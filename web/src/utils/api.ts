import { toast } from "sonner";
import { LoginData, SignupData } from "./types";
import axios, { AxiosResponse } from "axios"

const url = process.env.NEXT_PUBLIC_API_URL
const catchErrorMessage = "Unauthorised!"
const noAuthTokenErrorMessage = "Please login or signup!"

function authHeaders(){
    const token = localStorage.getItem("token");
    if(!token) {
        toast(noAuthTokenErrorMessage)
        return null
    }
    return {
        headers:{
            "Authorization" : `Bearer ${token}`
        }
    }
}
function respond(res:AxiosResponse<any, any>){
    if(res.status<400){
        if(res.data.success){
            return res.data
        }else{
            return toast(JSON.stringify(res.data.error?res.data.error:"Some error occured!"))
        }
    }else if(res.status<500){
        return toast("Unauthorized!")
    }else{
        return toast("Some error occured in the backend!")
    }
}

export const apiHandler = {
    signup: async(data:SignupData) => {
        try{
            const res = await axios.post(`${url}/user/signup`,{
                email:data.email,
                password:data.password,
                username: data.username
            })
            return respond(res)   
        }catch(error){
            return toast(catchErrorMessage)
        }
    },
    login: async(data:LoginData) => {
        try {       
            const res = await axios.post(`${url}/user/login`,{
                email:data.email,
                password:data.password
            })
            return respond(res)      
        } catch (error) {
            return toast(catchErrorMessage)
        }
    },
    getMe: async() => {
        try{
            const headers = authHeaders()
            if(!headers) return null;
            const res = await axios.get(`${url}/user/me`,headers);
            return respond(res);
        }catch(error){
            return toast(catchErrorMessage)
        }
    },
    resendOTP: async() => {
        try {
            const headers = authHeaders()
            if(!headers)return null
            const res = await axios.patch(`${url}/user/resend`,{},headers)
            return respond(res)
        } catch (error) {
            return toast(catchErrorMessage)
        }
    },
    verifyOTP: async({otp}:{otp:string}) => {
        try {
            const headers = authHeaders()
            if(!headers)return null
            const res = await axios.patch(`${url}/user/verify`,{otp},headers)
            return respond(res)
        } catch (error) {
            return toast(catchErrorMessage)
        }
    }
}