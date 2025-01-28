import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { NavigateFunction, Location } from "react-router-dom"

type ContentSlice = {
  currentLocation: string
}

const initialState: ContentSlice = {
  currentLocation: '/',
}

export const ContentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    updateCurrentLocation: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        currentLocation: action.payload
      }
    },
  }
})

export const navigateTo = createAsyncThunk(
  'content/NavigateTo',
  async (args: {to: string, nav: NavigateFunction, location: Location}, { dispatch }) => {
     args.nav(args.to)
    dispatch(updateCurrentLocation(args.to))
  }
)

export const {
  updateCurrentLocation
} = ContentSlice.actions
export default ContentSlice.reducer

export const selectCurrentLocation = (state: RootState) => state.content.currentLocation