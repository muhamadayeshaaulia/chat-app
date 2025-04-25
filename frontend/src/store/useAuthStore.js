import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create ((set) => ({
    authUser: null,
    isSigingUp: false,
    isLogining: false,
    isUpdateingProfile: false,
    isChekingAuth : true,

    checkAuth : async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});
        } catch (error) {
            console.log("Error in check AuthUser: ", error);
            set({authUser:null});
        } finally{
            set({isChekingAuth:false});
        }
    }
}));