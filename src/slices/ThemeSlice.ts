import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit"
import { AppStore, RootState } from "../store"
import { ChatCompletionMessageToolCall } from "openai/resources/index.mjs"

type BgColor = {
  index?: number
  bgLv1: string
  bgLv2: string
  bgLv3: string
}

type TextColor = {
  index?: number
  textLv1: string
  textLv2: string
}

type FontSize = {
  index?: number
  textLv1: string
  textLv2: string
  textLv3: string
}

type Layout = {
  index?: number
  appClasses: string
  mainViewClasses: string,
  sideViewClasses: string
}

export interface ThemeSlice {
  bgColor: BgColor
  textColor: TextColor
  fontSize: FontSize
  layout: Layout
}

type ThemeOption<T> = {
  note: string,
  value: T
}

export const bgColorOptions: ThemeOption<BgColor>[] = [
  {
    note: 'The default. Light bg',
    value: {
      bgLv1: 'bg-stone-50',
      bgLv2: 'bg-stone-100',
      bgLv3: 'bg-stone-200',
    }
  },
  {
    note: 'The dark bg',
    value: {
      bgLv1: 'bg-stone-900',
      bgLv2: 'bg-stone-800',
      bgLv3: 'bg-stone-700',
    }
  },
  {
    note: 'blue bg for high contrast',
    value: {
      bgLv1: 'bg-blue-700',
      bgLv2: 'bg-blue-600',
      bgLv3: 'bg-blue-500',
    }
  },
  {
    note: 'yellow bg for high contrast',
    value: {
      bgLv1: 'bg-yellow-700',
      bgLv2: 'bg-yellow-600',
      bgLv3: 'bg-yellow-500',
    }
  },
]

export const textColorOptions: ThemeOption<TextColor>[] = [
  {
    note: 'default black text',
    value: {
      textLv1: 'text-stone-900',
      textLv2: 'text-stone-800',
    }
  },
  {
    note: 'white text for dark bg',
    value: {
      textLv1: 'text-stone-50',
      textLv2: 'text-stone-100',
    }
  },
  {
    note: 'yellow text for blue bg',
    value: {
      textLv1: 'text-yellow-500',
      textLv2: 'text-yellow-600',
    }
  },
  {
    note: 'blue text for yellow bg',
    value: {
      textLv1: 'text-blue-500',
      textLv2: 'text-blue-600',
    }
  },
]

export const fontSizeOptions: ThemeOption<FontSize>[] = [
  {
    note: 'default font size',
    value: {
      textLv1: 'text-2xl',
      textLv2: 'text-xl',
      textLv3: 'text-lg'
    }
  },
  {
    note: 'large font size',
    value: {
      textLv1: 'text-3xl',
      textLv2: 'text-2xl',
      textLv3: 'text-xl'
    }
  },
  {
    note: 'very large font size',
    value: {
      textLv1: 'text-4xl',
      textLv2: 'text-3xl',
      textLv3: 'text-2xl'
    }
  },
  {
    note: 'super large font size',
    value: {
      textLv1: 'text-5xl',
      textLv2: 'text-4xl',
      textLv3: 'text-3xl'
    }
  },
]

export const layoutOptions: ThemeOption<Layout>[] = [
  {
    note: 'default layout, main view on the left and sidebar on the right',
    value: {
      appClasses: 'grid grid-cols-9',
      mainViewClasses: 'row-start-1 col-start-1 col-span-7',
      sideViewClasses: 'row-start-1 col-start-8 col-span-2'
    }
  },
  {
    note: 'main view on the right and AI sidebar on the left',
    value: {
      appClasses: 'grid grid-cols-9',
      mainViewClasses: 'row-start-1 col-start-3 col-span-7',
      sideViewClasses: 'row-start-1 col-start-1 col-span-2'
    }
  }
]

const initialState: ThemeSlice = {
  bgColor: { 
    index: 0,
    ...bgColorOptions[0].value
  },
  textColor: {
    index: 0,
    ...textColorOptions[0].value
  },
  fontSize: {
    index: 0,
    ...fontSizeOptions[0].value
  },
  layout: {
    index: 0,
    ...layoutOptions[0].value
  },
}

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    updateBgColor: (state, action: PayloadAction<BgColor>) => {
      return {
        ...state,
        bgColor: action.payload
      }
    },
    updateTextColor: (state, action: PayloadAction<TextColor>) => {
      return {
        ...state,
        textColor: action.payload
      }
    },
    updateFontSize: (state, action: PayloadAction<FontSize>) => {
      return {
        ...state,
        fontSize: action.payload
      }
    },
    updateLayout: (state, action: PayloadAction<Layout>) => {
      return {
        ...state,
        layout: action.payload
      }
    }
  }
})

export const {
  updateBgColor,
  updateTextColor,
  updateFontSize,
  updateLayout
} = themeSlice.actions
export default themeSlice.reducer

export const selectBgColor = (state: RootState) => state.theme.bgColor
export const selectTextColor = (state: RootState) => state.theme.textColor
export const selectFontSize = (state: RootState) => state.theme.fontSize
export const selectLayout = (state: RootState) => state.theme.layout

export function generateOptionsNote(options: ThemeOption<any>[]) {
  let note = ''
  options.forEach((option, index) => {
    note = note.concat(`${index}: ${option.note}\n`)
  })
  return note
}

export function getThemeContext(state: RootState) {
  return `
  bgColor: ${bgColorOptions[state.theme.bgColor.index || 0]}
  textColor: ${textColorOptions[state.theme.textColor.index || 0]}
  fontSize: ${fontSizeOptions[state.theme.fontSize.index || 0]}
  layout: ${layoutOptions[state.theme.layout.index || 0]}
  `
}

export const updateTheme = (calls: ChatCompletionMessageToolCall[], dispatch: Dispatch) => {
  calls.forEach((call) => {
    const to = JSON.parse(call.function.arguments).to
    const index = parseInt(to)
    switch (call.function.name) {
      case 'updateBgColor': {
        dispatch(updateBgColor({
          index,
          ...bgColorOptions[index].value,
        }))
        return
      }
      case 'updateTextColor': {
        dispatch(updateTextColor({
          index,
          ...textColorOptions[index].value
        }))
        return
      }
      case 'updateFontSize': {
        dispatch(updateFontSize({
          index,
          ...fontSizeOptions[index].value
        }))
        return
      }
      case 'updateLayout': {
        dispatch(updateLayout({
          index,
          ...layoutOptions[index].value
        }))
        return
      }
    }
  })
}