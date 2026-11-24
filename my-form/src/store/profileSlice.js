import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  profilePhoto: null,
  profilePhotoPreview: null,
  name: '',
  cnic: '',
  dob: '',
  email: '',
  phoneNumber: '',
  gender: '',
  maritalStatus: '',
  about: ''
}

const profileSlice = createSlice({
  name: 'profile',
  initialState, 
  reducers: {
    updateProfile: (state, action) => {
      return { ...state, ...action.payload }
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    logoutUser: (state) => {
      state.user = null
    }
  }
})

export const { updateProfile, setUser, logoutUser } = profileSlice.actions
export default profileSlice.reducer