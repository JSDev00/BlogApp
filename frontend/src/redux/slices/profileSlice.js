import {createSlice} from '@reduxjs/toolkit'


const profileSlice = createSlice({
    name:"profile",
    initialState:{
        profile:null,
        loading:false,
        isProfileDeleted:false,
        userCount:null,
        profiles:[]
    },
    reducers:{
        setProfile(state,action){
            state.profile = action.payload
        },
        setProfilePhoto(state,action){
            state.profile.profilePhoto = action.payload
        },
        userUpdateProfile(state,action){
            state.profile = action.payload
        },
        setLoading(state){
            state.loading = true
        },
        clearLoading(state){
            state.loading = false
        },
        setIsProfileDeleted(state){
            state.isProfileDeleted = true;
            state.loading = false

        },
        clearIsProfileDeleted(state){
            state.isProfileDeleted = false
        },
        getUserCount(state,action){
            state.userCount = action.payload
        },
        getProfiles(state,action){
            state.profiles = action.payload
        }
    }

})


const profileReducer = profileSlice.reducer
const profileAction = profileSlice.actions

export {profileReducer,profileAction}