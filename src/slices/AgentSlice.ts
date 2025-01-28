import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, store } from '../store'
import useAPIClient from '../hooks/useAPIClient'
import { ChatCompletionTool } from 'openai/resources/index.mjs'
import { bgColorOptions, fontSizeOptions, generateOptionsNote, getThemeContext, layoutOptions, textColorOptions, updateTheme } from './ThemeSlice'
import { updateUserProfile } from './UserSlice'
import { NavigateFunction } from 'react-router-dom'
import { Location } from 'react-router-dom'
import { navigateTo } from './ContentSlice'

export type Message = {
  from: 'Agent' | 'User' | 'System',
  content: string
}

export interface AgentState {
  chatHistory: Message[]
  currentAgentIndex: '0' | '1' | '2' | '3',
  currentSystemPrompt: string,
  currentTools: ChatCompletionTool[]
  status: 'loading' | 'loaded'
}

// sample instructions due to time limitation
const schedulerAgentSystemPrompt = `
You are a friendly scheduler agent on the e-learning platform. Your task is to help the user make better use of the platform. 
When receiving inquiries from users, you need to determine whether the issue requires a task agent to resolve. 
- If it does, you will activate the appropriate agent by calling the tool. 
- If it does not or you cannot find a suitable agent, you will engage in brief and efficient communication with the user.
When the user needs to navigate to a different page, call the changeLocation tool. 
The user's request may be implicit; for example, when the user need to create their profile, you need to change the location to the profile page and then activate the profile updater agent.
When the user ask 'what's this? ' or 'what I am pointing at? ', call the content explainer agent to help. 
When you see [Scheduler activated] at the end of the chat history, it means the task agent has just completed some tasks, you need to continue the conversation with the user based on the chat history and ask if they have any other needs.
`

const schedulerAgentTools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'callASpecializedAgent',
      parameters: {
        type: 'object',
        properties: {
          to: {
            type: 'string',
            enum: ['1', '2', '3'],
            description: 'Which agent to activate: 1 is UI adjuster agent, 2 is user profile updater agent, 3 is content explainer agent. '
          },
        },
        strict: true,
        required: ['to'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'changeLocation',
      parameters: {
        type: 'object',
        properties: {
          to: {
            type: 'string',
            enum: ['/', '/profile', '/slides', '/timetable'],
            description: 'change the user\' location, possible locations are in the context info. '
          },
        },
        strict: true,
        required: ['to'],
        additionalProperties: false,
      },
    },
  },
]

const completeJobTool: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'completeJob',
    description: 'Call this when you have finished your task. '
  },
}

const completeJobSystemPrompt = `
Call the completeJob function in the following two situations to send the user back to the scheduler agent:
1. When you confirm that your task has been completed.
2. When the user's current request is unrelated to your responsibilities.
`

const UIAdjusterAgentSystemPrompt = `
You are a user interface adjuster assistant. You were activated by the scheduler agent. 
Your task is to adjust interface elements based on the user's need. 
- When users express certain needs or feelings, try your best to understand them and look for solutions in callable functions. 
- When you think you can call some functions, you must confirm with the user about what you are going to do. 
- You don't need to ask too detailed; when the user's issue is roughly clear, you can boldly recommend a solution and ask the user to confirm.
- If there is no suitable function, explain to the user. When adjusting colors, please consider both the background and text (e.g., light background cannot work with white text).
- Your messages need to be very brief and friendly, not exceeding one or two sentences.
If you see [interface adjusted] at the end of the chat history, it means you have made the changes and you must not call the tools again and need to inform the user and ask whether the user need other helps. 
${completeJobSystemPrompt}
`

const UIAdjusterAgentTools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'updateBgColor',
      parameters: {
        type: 'object',
        properties: {
          to: {
            type: 'string',
            enum: ['1', '2', '3', '4', '5'],
            description: generateOptionsNote(bgColorOptions)
          },
        },
        strict: true,
        required: ['to'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'updateTextColor',
      parameters: {
        type: 'object',
        properties: {
          to: {
            type: 'string',
            enum: ['1', '2', '3', '4', '5'],
            description: generateOptionsNote(textColorOptions)
          },
        },
        strict: true,
        required: ['to'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'updateFontSize',
      parameters: {
        type: 'object',
        properties: {
          to: {
            type: 'string',
            enum: ['1', '2', '3', '4', '5'],
            description: generateOptionsNote(fontSizeOptions)
          },
        },
        strict: true,
        required: ['to'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'updateLayout',
      parameters: {
        type: 'object',
        properties: {
          to: {
            type: 'string',
            enum: ['1', '2', '3', '4', '5'],
            description: generateOptionsNote(layoutOptions)
          },
        },
        strict: true,
        required: ['to'],
        additionalProperties: false,
      },
    },
  },
  completeJobTool
]

const userProfileUpdaterAgentSystemPrompt = `
You are a e-learning platform user profile updater agent. You were activated by the scheduler agent. 
Your task is to chat with the user, to understand the user and update the user profile for them. 
If the chat history indicates that the user only wants to update a specific part of their profile, help them do so. 
Otherwise, you need to guide the user to tell you step-by-step the:
1. username (you may need to ask how to spell),
2. UI preference
3. content preference
4. scheduling preference 
When you think you have clear info of a field and the tools are not called, call the tool to update the field. 
If the answer is not clear, guide the user to tell more in details.
When you see [Profile updated] at the end of the chat history, it means the update was done and you need to guide the user to the next step.
Your messages need to be very brief and friendly, not exceeding one or two sentences.
Your job is only for updating the text fields in the profile, if the user ask for some actual actions, send them back to the scheduler agent. For example, if the user want to change the UI, you cannot do that. 
${completeJobSystemPrompt}
`

const userProfileUpdaterAgentTools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'updateUsername',
      parameters: {
        type: 'object',
        properties: {
          v: {
            type: 'string',
            description: 'The user\'s name'
          },
        },
        strict: true,
        required: ['v'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'updateInterfacePreference',
      parameters: {
        type: 'object',
        properties: {
          v: {
            type: 'string',
            description: 'The user\'s preference of the UI, like bg and text color, font size, layout'
          },
        },
        strict: true,
        required: ['v'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'updateContentPreference',
      parameters: {
        type: 'object',
        properties: {
          v: {
            type: 'string',
            description: 'The user\'s preference of the content, like learning difficulty, language preference, etc'
          },
        },
        strict: true,
        required: ['v'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'updateSchedulingPreference',
      parameters: {
        type: 'object',
        properties: {
          v: {
            type: 'string',
            description: 'The user\'s preference of time arrangement, like working hours, accommodations, etc'
          },
        },
        strict: true,
        required: ['v'],
        additionalProperties: false,
      },
    },
  },
  completeJobTool
]

const contentExplainerAgentSystemPrompt = `
 BE CONVERSATIONAL, DO NOT USE MARKDOWN
You are a friendly study assistant, you are activated by the scheduler agent.
You are tasked with helping students who struggle with their learning to understand the material. 
- You need to respond to the student's questions based on the context, using SIMPLE LANGUAGE, and in a verbal conversational way.
- You should provide additional explanations of the content using other languages if the user needs.
Try using simple analogies or explanations to help students understand.
${completeJobSystemPrompt}
`

const contentExplainerAgentTools: ChatCompletionTool[] = [
  completeJobTool
]

const initialState: AgentState = {
  chatHistory: [],
  currentAgentIndex: '0',
  currentSystemPrompt: schedulerAgentSystemPrompt,
  currentTools: schedulerAgentTools,
  status: 'loaded',
}

export const AgentSlice = createSlice({
  name: 'ai-assistant',
  initialState,
  reducers: {
    updateChatHistory: (state, action: PayloadAction<Message>) => {
      return {
        ...state,
        chatHistory: [...state.chatHistory, {
          from: action.payload.from,
          content: action.payload.content
        }]
      }
    },
    updateAgent: (state, action: PayloadAction<'0' | '1' | '2' | '3'>) => {
      switch (action.payload) {
        case '1': {
          return {
            ...state,
            currentAgentIndex: action.payload,
            currentSystemPrompt: UIAdjusterAgentSystemPrompt,
            currentTools: UIAdjusterAgentTools
          }
        }
        case '2': {
          return {
            ...state,
            currentAgentIndex: action.payload,
            currentSystemPrompt: userProfileUpdaterAgentSystemPrompt,
            currentTools: userProfileUpdaterAgentTools
          }
        }
        case '3': {
          return {
            ...state,
            currentAgentIndex: action.payload,
            currentSystemPrompt: contentExplainerAgentSystemPrompt,
            currentTools: contentExplainerAgentTools
          }
        }
        default: {
          return {
            ...state,
            currentAgentIndex: action.payload,
            currentSystemPrompt: schedulerAgentSystemPrompt,
            currentTools: schedulerAgentTools
          }
        }
      }
    },
  }
})

export const {
  updateChatHistory,
  updateAgent
} = AgentSlice.actions
export default AgentSlice.reducer

export const selectChatHistory = (state: RootState) => state.agent.chatHistory

function getChatHistory(chatHistory: Message[]): string {
  let str = '# chat history \n\n u for user, a for agent, s for system \n\n'
  chatHistory.forEach((message) => {
    str = str.concat(`${message.from}: ${message.content} \n\n`)
  })
  return str
}

function getContext(): string {
  const state = store.getState()
  switch (state.agent.currentAgentIndex) {
    // sample context due to time limitation
    case '1': {
      return `
      Interface preferences in user profile: 
      ${state.user.interfacePreference}

      Current theme:
      ${getThemeContext(state)}
      `
    }
    case '2': {
      return `
      Current user profile:
      Username: ${state.user.username}
      Interface preference: ${state.user.interfacePreference}
      Content preference: ${state.user.contentPreference}
      Scheduling preference: ${state.user.schedulingPreference}
      `
    }
    case '3': {
      return `
      Content preference in user profile: 
      The user need explanation in simple language
      ${state.user.contentPreference}

      # Info on current page
      The slides outlines research methods and steps:
      General Steps:
      Identifying a topic to research
      Finding and collecting data
      Analyzing the data
      Presenting and discussing findings
      `
    }
    default: {
      return `
      User accommodation: additional breaks during the course, as well as extended time for exams and assignments. 
      `
    }
  }
}

const client = useAPIClient()

export const useAgent = createAsyncThunk(
  'agent/useAgent',
  async (args: {userMessage: string, nav: NavigateFunction, location: Location}, { dispatch }): Promise<string> => {

    const state = store.getState()
    const chatHistory = state.agent.chatHistory
    if (args.userMessage) {
      dispatch(updateChatHistory({
        from: 'User', content: args.userMessage
      }))
    }
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 'role': 'system', 'content': state.agent.currentSystemPrompt },
        { 'role': 'assistant', 'content': getContext() },
        { 'role': 'assistant', 'content': getChatHistory(chatHistory) },
        { 'role': 'user', 'content': args.userMessage }
      ],
      tools: state.agent.currentTools
    })
    const agentMessage = response.choices[0].message.content
    const functionCalls = response.choices[0].message.tool_calls
    if (functionCalls) {
      if (functionCalls.length == 1 && functionCalls[0].function.name == 'completeJob') {
        dispatch(updateAgent('0'))
        dispatch(updateChatHistory({
          from: 'System', content: `[Scheduler activated]`
        }))
      }
      else {
        switch (state.agent.currentAgentIndex) {
          case '0': {
            functionCalls.forEach((tool) => {
              if (tool.function.name == 'callASpecializedAgent') {
                const to = JSON.parse(tool.function.arguments).to
                dispatch(updateAgent(to))
                dispatch(updateChatHistory({
                  from: 'System', content: `[${[
                    'Scheduler',
                    'UI adjuster',
                    'Profile updater',
                    'Content explainer'
                  ][parseInt(to)]
                    } activated]`
                }))
              }
              else if (tool.function.name == 'changeLocation') {
                const to = JSON.parse(tool.function.arguments).to
                dispatch(navigateTo({to: to, nav: args.nav, location: args.location}))
                dispatch(updateChatHistory({
                  from: 'System', content: `[location changed to ${to}]`
                }))
              }
            })
            break
          }
          case '1': {
            updateTheme(functionCalls, dispatch)
            dispatch(updateChatHistory({
              from: 'System', content: `[Interface adjusted]`
            }))
            break
          }
          case '2': {
            updateUserProfile(functionCalls, dispatch)
            dispatch(updateChatHistory({
              from: 'System', content: `[Profile updated]`
            }))
            break
          }
          case '3': {
            break
          }
        }
      }
    }
    if (agentMessage) {
      dispatch(updateChatHistory({
        from: 'Agent', content: agentMessage
      }))
    }
    return agentMessage ? agentMessage : (await dispatch(useAgent({...args, userMessage: ''}))).payload as string
  }
)