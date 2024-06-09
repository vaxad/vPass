// import { toast } from "sonner";

import { deployedBackendUrl, localBackendUrl } from "./constants";
import { CreateGroupData, CreatePasswordData, CreateTeamData, LoginData, SignupData } from "./types";
import axios, { AxiosResponse } from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";
import useStore from "./zustand/store";


const url = deployedBackendUrl
const catchErrorMessage = "Unauthorised!"
const noAuthTokenErrorMessage = "Please login or signup!"
const {toast} = useStore.getState()
async function authHeaders(){
    const token = await AsyncStorage.getItem("token");
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
    check: async() => {
        try{
            const res = await axios.get(`${url}`)
            // console.warn({res:res.data})
            return toast("Backend is working![we use free servers😅]")
        }catch(error){
            return toast("Backend down![we use free servers😅]")
        }
    },
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
            const headers = await authHeaders()
            if(!headers) return null;
            const res = await axios.get(`${url}/user/me`,headers);
            return respond(res);
        }catch(error){
            return toast(catchErrorMessage)
        }
    },
    resendOTP: async() => {
        try {
            const headers = await authHeaders()
            if(!headers)return null
            const res = await axios.patch(`${url}/user/resend`,{},headers)
            return respond(res)
        } catch (error) {
            return toast(catchErrorMessage)
        }
    },
    verifyOTP: async({otp}:{otp:string}) => {
        try {
            const headers = await authHeaders()
            if(!headers)return null
            const res = await axios.patch(`${url}/user/verify`,{otp},headers)
            return respond(res)
        } catch (error) {
            return toast(catchErrorMessage)
        }
    },
    getMyTeams: async() => {
        try{
            const headers = await authHeaders()
            if(!headers) return null;
            const res = await axios.get(`${url}/team/`,headers);
            return respond(res);
        }catch(error){
            return toast(catchErrorMessage)
        }
    },
    getMyGroups: async() => {
        try{
            const headers = await authHeaders()
            if(!headers) return null;
            const res = await axios.get(`${url}/group/`,headers);
            return respond(res);
        }catch(error){
            return toast(catchErrorMessage)
        }
    },
    createPassword: async(data:CreatePasswordData) => {
        try{
            const headers = await authHeaders()
            if(!headers) return null;
            const res = await axios.post(`${url}/password/`,{
                ...data
            },headers)
            return respond(res)   
        }catch(error){
            return toast(catchErrorMessage)
        }
    },
    getPasswordsGeneral: async({teamId="", groupId="", orderBy="", limit="", offset="", isPublic=""}:{teamId?:string, groupId?:string, limit?:number|"", offset?:number|"", orderBy?:"name"|"date"|"", isPublic?:boolean|""}) => {
        try{
            const headers = await authHeaders()
            if(!headers) return null;
            const res = await axios.get(`${url}/password/all?groupId=${groupId}&teamId=${teamId}&orderBy=${orderBy}&isPublic=${isPublic}&limit=${limit}&offset=${offset}`,headers);
            return respond(res);
        }catch(error){
            return toast(catchErrorMessage)
        }
    },
    getPasswordById: async({passId}:{passId:string}) => {
        try{
            const headers = await authHeaders()
            if(!headers) return null;
            const res = await axios.get(`${url}/password/${passId}`,headers);
            return respond(res);
        }catch(error){
            return toast(catchErrorMessage)
        }
    },
    getPublicPasswordById: async({passId}:{passId:string}) => {
        try{
            const res = await axios.get(`${url}/password/public/${passId}`);
            return respond(res);
        }catch(error){
            return toast(catchErrorMessage)
        }
    },
    editPassword: async(data:CreatePasswordData, passId:string) => {
        try{
            const headers = await authHeaders()
            if(!headers) return null;
            const res = await axios.patch(`${url}/password/${passId}`,{
                ...data
            },headers)
            return respond(res)   
        }catch(error){
            return toast(catchErrorMessage)
        }
    },
    deletePassword: async(passId:string) => {
        try{
            const headers = await authHeaders()
            if(!headers) return null;
            const res = await axios.delete(`${url}/password/${passId}`,headers)
            return respond(res)   
        }catch(error){
            return toast(catchErrorMessage)
        }
    },
    createTeam: async(data:CreateTeamData) => {
        try{
            const headers = await authHeaders()
            if(!headers) return null;
            const res = await axios.post(`${url}/team/`,{
                ...data
            },headers)
            return respond(res)   
        }catch(error){
            return toast(catchErrorMessage)
        }
    },
    searchUser: async({term}:{term:string}) => {
        try{
            const res = await axios.get(`${url}/user/search/${term}`);
            return respond(res);
        }catch(error){
            return toast(catchErrorMessage)
        }
    },
    createGroup: async(data:CreateGroupData) => {
        try{
            const headers = await authHeaders()
            if(!headers) return null;
            const res = await axios.post(`${url}/group/`,{
                ...data
            },headers)
            return respond(res)   
        }catch(error){
            return toast(catchErrorMessage)
        }
    },
}