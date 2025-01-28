import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import inputAreaReducer from './slices/InputAreaSlice'
import themeReducer from './slices/ThemeSlice'
import agentReducer from './slices/AgentSlice'
import userReducer from './slices/UserSlice'
import contentReducer from './slices/ContentSlice'

export const store = configureStore({
  reducer: {
    inputArea: inputAreaReducer,
    agent: agentReducer,
    theme: themeReducer,
    user: userReducer,
    content: contentReducer
  },
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
