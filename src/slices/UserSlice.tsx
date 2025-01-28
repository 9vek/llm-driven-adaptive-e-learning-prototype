import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { ChatCompletionMessageToolCall } from "openai/resources/index.mjs"


type UserSlice = {
  username: string
  interfacePreference: string
  contentPreference: string
  schedulingPreference: string
}

const initialState: UserSlice = {
  username: '',
  interfacePreference: '',
  contentPreference: '',
  schedulingPreference: ''
}

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUsername: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        username: action.payload
      }
    },
    updateInterfacePreference: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        interfacePreference: action.payload
      }
    },
    updateContentPreference: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        contentPreference: action.payload
      }
    },
    updateSchedulingPreference: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        schedulingPreference: action.payload
      }
    }
  }
})

export const {
  updateUsername,
  updateInterfacePreference,
  updateContentPreference,
  updateSchedulingPreference
} = UserSlice.actions
export default UserSlice.reducer

export const selectUsername = (state: RootState) => state.user.username
export const selectInterfacePreference = (state: RootState) => state.user.interfacePreference
export const selectContentPreference = (state: RootState) => state.user.contentPreference
export const selectSchedulingPreference = (state: RootState) => state.user.schedulingPreference

export const updateUserProfile = (calls: ChatCompletionMessageToolCall[], dispatch: Dispatch) => {
  calls.forEach((call) => {
    const v = JSON.parse(call.function.arguments).v
    switch (call.function.name) {
      case 'updateUsername': {
        dispatch(updateUsername(v))
        return
      }
      case 'updateInterfacePreference': {
        dispatch(updateInterfacePreference(v))
        return
      }
      case 'updateContentPreference': {
        dispatch(updateContentPreference(v))
        return
      }
      case 'updateSchedulingPreference': {
        dispatch(updateSchedulingPreference(v))
        return
      }
    }
  })
}