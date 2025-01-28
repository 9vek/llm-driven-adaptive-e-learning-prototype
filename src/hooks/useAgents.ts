// import { ChatCompletionTool } from "openai/resources/index.mjs"
// import useAPIClient from "./useAPIClient"
// import { Dispatch } from "redux"
// import { updateChatHistory } from "../features/AISidebar/AgentSlice"
// import { 
//   bgColorOptions, 
//   fontSizeOptions, 
//   generateOptionsNote, 
//   layoutOptions, 
//   textColorOptions, 
//   updateBgColor, 
//   updateFontSize, 
//   updateLayout, 
//   updateTextColor 
// } from "../features/ThemeSlice"

// const client = useAPIClient()

// const systemPrompt = `
// You are a meticulous and kind web app assistant. 
// Your task is to answer the user's questions or adjust interface elements. 
// - When users express certain needs or feelings, try your best to understand them and look for solutions in callable functions. 
// - When you think you can call some functions, confirm with the user first what you are going to do. 
// - But you don't need to ask too detailed; when the user's issue is roughly clear, boldly invoke the function you recommend.
// - If there is no suitable function, explain to the user. 
// - Your messages need to be very brief and friendly, not exceeding one or two sentences.
// `

// const agentDispatcherTools: ChatCompletionTool[] = [
//   {
//     type: "function",
//     function: {
//       name: "updateBgColor",
//       parameters: {
//         type: "object",
//         properties: {
//           to: {
//             type: "string",
//             enum: ["1", "2", "3", "4", "5"],
//             description: generateOptionsNote(bgColorOptions)
//           },
//         },
//         strict: true,
//         required: ["to"],
//         additionalProperties: false,
//       },
//     },
//   },
//   {
//     type: "function",
//     function: {
//       name: "updateTextColor",
//       parameters: {
//         type: "object",
//         properties: {
//           to: {
//             type: "string",
//             enum: ["1", "2", "3", "4", "5"],
//             description: generateOptionsNote(textColorOptions)
//           },
//         },
//         strict: true,
//         required: ["to"],
//         additionalProperties: false,
//       },
//     },
//   },
//   {
//     type: "function",
//     function: {
//       name: "updateFontSize",
//       parameters: {
//         type: "object",
//         properties: {
//           to: {
//             type: "string",
//             enum: ["1", "2", "3", "4", "5"],
//             description: generateOptionsNote(fontSizeOptions)
//           },
//         },
//         strict: true,
//         required: ["to"],
//         additionalProperties: false,
//       },
//     },
//   },
//   {
//     type: "function",
//     function: {
//       name: "updateLayout",
//       parameters: {
//         type: "object",
//         properties: {
//           to: {
//             type: "string",
//             enum: ["1", "2", "3", "4", "5"],
//             description: generateOptionsNote(layoutOptions)
//           },
//         },
//         strict: true,
//         required: ["to"],
//         additionalProperties: false,
//       },
//     },
//   },
// ];


// export async function useAgent(userMessage: string, chatHistory: string, dispatch: Dispatch) {
//   const response = await client.chat.completions.create({
//     model: "gpt-4o",
//     messages: [
//       { "role": "system", "content": systemPrompt },
//       { "role": "assistant", "content": chatHistory },
//       { "role": "user", "content": userMessage }
//     ],
//     tools: agentDispatcherTools,
//   })
//   const agentMessage = response.choices[0].message.content
//   const functionCalls = response.choices[0].message.tool_calls
//   chatHistory = chatHistory.concat(`${userMessage} \n\n ${agentMessage ? agentMessage : `[functions called]`} \n\n`)
//   dispatch(updateChatHistory(chatHistory))
//   if (functionCalls) {
//     functionCalls.forEach((call) => {
//       const to = JSON.parse(call.function.arguments).to
//       console.log(call.function.name, to);
//       const index = parseInt(to)
//       switch (call.function.name) {
//         case 'updateBgColor': {
//           dispatch(updateBgColor(bgColorOptions[index].value))
//           return
//         }
//         case 'updateTextColor': {
//           dispatch(updateTextColor(textColorOptions[index].value))
//           return
//         }
//         case 'updateFontSize': {
//           dispatch(updateFontSize(fontSizeOptions[index].value))
//           return
//         }
//         case 'updateLayout': {
//           dispatch(updateLayout(layoutOptions[index].value))
//           return
//         }
//       }
//     })
//   }
//   return agentMessage
// }


