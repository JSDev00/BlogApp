import { createSlice } from '@reduxjs/toolkit'


const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:localStorage.getItem("userInfo") ?
        JSON.parse(localStorage.getItem("userInfo")) : null,
        registerMessage:null
    },
    reducers:{
        login(state,action){
            state.user = action.payload;
            state.registerMessage = null
        },
        register(state,action){
            state.registerMessage = action.payload
        },
        logout(state){
            state.user = null
        },
        setProfileUserPhoto(state,action){
            state.user.proileImg = action.payload
        },
        setUsername(state,action){
            state.user.username = action.payload
        }
    }
})
const authReducer = authSlice.reducer
const authAction  = authSlice.actions
export {authReducer,authAction}