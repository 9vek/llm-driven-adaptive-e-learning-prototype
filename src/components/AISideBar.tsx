import { useAppSelector } from "../store"
import { selectBgColor, selectFontSize, selectTextColor, } from "../slices/ThemeSlice"
import { selectChatHistory } from "../slices/AgentSlice"
import { useEffect, useRef } from "react"

export default function AISidebar() {

  const chatHistoryDiv = useRef(null)

  const bgColor = useAppSelector(selectBgColor)
  const textColor = useAppSelector(selectTextColor)
  const fontSize = useAppSelector(selectFontSize)
  const chatHistory = useAppSelector(selectChatHistory)

  useEffect(() => {
    // 监视 messages 的变化
    const timer = setTimeout(() => {
      if (chatHistoryDiv.current) {
        (chatHistoryDiv.current as HTMLDivElement).scrollTop = (chatHistoryDiv.current as HTMLDivElement).scrollHeight;
      }
    }, 20);
    
    // 清除定时器以防止内存泄漏
    return () => clearTimeout(timer);
  }, [chatHistory]);

  return (
    <div ref={chatHistoryDiv} className={`${bgColor.bgLv2} w-full h-full max-h-full overflow-scroll scrollbar-none transition-all p-2 flex flex-col gap-y-2 shadow`}>
      {
        chatHistory.map((message, index) => {
          return (
            <div className={`${bgColor.bgLv3} w-full p-2`} key={index}>
              <div className={`${textColor.textLv1} ${fontSize.textLv2} font-bold inline`}>{message.from}</div>:&nbsp;
              <div className={`${textColor.textLv2} ${fontSize.textLv2} inline`}>{message.content}</div>
            </div>
          )
        })
      }
    </div>
  )
}