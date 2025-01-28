import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import useTTS from '../hooks/useTTS'

export interface InputAreaState {
  text: string
  audioURL: string
  status: 'uninitialized' | 'inactivated' | 'idle' | 'playing' | 'recording' | 'loading'
}

const initialState: InputAreaState = {
  text: 'Hello! ',
  audioURL: '',
  status: 'uninitialized',
}

export const updateAudioURL = createAsyncThunk(
  'InputArea/updateAudioURL',
  async (text: string) => {
    return await useTTS(text)
  },
)

export const updateTextAndAudioURL = createAsyncThunk(
  'InputArea/updateTextAndAudioURL',
  async (text: string, { dispatch }) => {
    dispatch(updateText(text))
    await dispatch(updateAudioURL(text))
  }
)

export const InputAreaSlice = createSlice({
  name: 'input-area',
  initialState,
  reducers: {
    updateText: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        text: action.payload
      }
    },
    updateStatus: (state, action: PayloadAction<'uninitialized' | 'inactivated' | 'idle' | 'playing' | 'recording' | 'loading'>) => {
      return {
        ...state,
        status: action.payload
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(updateAudioURL.pending, state => {
        if (state.status == 'uninitialized') {
          state.status = 'uninitialized'
        } 
        else if (state.status == 'inactivated') {
          state.status = 'uninitialized'
        }
        else {
          state.status = 'loading'
        }
      })
      .addCase(updateAudioURL.fulfilled, (state, action) => {
        if (state.status == 'uninitialized') {
          state.status = 'inactivated'
        } else {
          state.status = 'idle'
        }
        state.audioURL = action.payload
      })
      .addCase(updateAudioURL.rejected, state => {
        if (state.status == 'uninitialized') {
          state.status = 'inactivated'
        } else {
          state.status = 'idle'
        }
      })
  },
})

export const { updateText, updateStatus } = InputAreaSlice.actions
export default InputAreaSlice.reducer

export const selectText = (state: RootState) => state.inputArea.text
export const selectAudioURL = (state: RootState) => state.inputArea.audioURL
export const selectStatus = (state: RootState) => state.inputArea.status