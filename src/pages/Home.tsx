import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../store"
import { updateTextAndAudioURL } from "../slices/InputAreaSlice"
import { useNavigate } from "react-router-dom"
import { selectBgColor, selectFontSize, selectTextColor } from "../slices/ThemeSlice"
import { selectChatHistory, updateChatHistory } from "../slices/AgentSlice"
import { updateCurrentLocation } from "../slices/ContentSlice"
import sampleNotificationImage from '../assets/sample-notification-image.png'
import sampleModuleCover from '../assets/sample-module-cover.png'

export default function InfoPage() {

  const bgColor = useAppSelector(selectBgColor)
  const textColor = useAppSelector(selectTextColor)
  const fontSize = useAppSelector(selectFontSize)

  const sampleNotification = {
    title: 'Welcome to Research Methods and Making Skills',
    content: 'This module will equip students with the basics of quantitative and qualitative research methods and basic computing and making skills. For the research methods, students will learn about the concepts, ideas, fundamentals of planning and conducting research, starting with how to make a research question. Students will then explore methods for data collection and data analysis tools for quantitative and qualitative data. For the computing and making skills, students will learn about both physical and software prototyping which will help conduct research: spanning from basic low-fidelity prototyping (e.g., storyboard), 3d printing to programming. Students will explore physical computing (e.g., Arduino programming) for controlling electronic components including sensor and actuators (e.g. haptic feedback for visually impaired community). Python programming will be learned mainly for data visualisation.'
  }

  const dispatch = useAppDispatch()
  const nav = useNavigate()

  const chatHistory = useAppSelector(selectChatHistory)
  const starterMessage = 'Hello, I am your e-learning assistant, how can I help you? '

  useEffect(() => {
    dispatch(updateCurrentLocation('/'))
    if (chatHistory.length == 0) {
      dispatch(updateTextAndAudioURL(starterMessage))
      dispatch(updateChatHistory({
        from: 'Agent',
        content: starterMessage
      }))
    }
  }, [])

  return (
    <div className={`${bgColor.bgLv1} h-full w-full p-4 transition-all`}>
      <div className={`${bgColor.bgLv1} container h-full w-7xl mx-auto p-8 flex flex-col gap-8 transition-all`}>
        <div className={`${bgColor.bgLv2} h-fit w-full flex p-8 gap-8 hover:border transition-all`}>
          <div className={`${bgColor.bgLv3} w-1/4 h-full transition-all`}>
            <img src={sampleModuleCover} className="object-cover h-full w-full" />
          </div>
          <div className={`${bgColor.bgLv2} h-full w-full transition-all p-2`}>
            <div className={`${textColor.textLv1} ${fontSize.textLv1} font-bold mb-2`}>{sampleNotification.title}</div>
            <div className={`${textColor.textLv1} ${fontSize.textLv2}`}>{sampleNotification.content}</div>
          </div>
        </div>
        <div className={`${bgColor.bgLv2} h-fit w-full grid grid-cols-4 place-items-center gap-8 p-8 transition-all`}>
          <div className={`${bgColor.bgLv3} w-full h-full cursor-pointer transition-all`}>
            <div className="h-48">
              <img src={sampleModuleCover} className="object-cover h-full w-full" />
            </div>
            <div className={`${textColor.textLv1} ${fontSize.textLv2} h-full font-bold p-2`}>Module Description</div>
          </div>
          <div className={`${bgColor.bgLv3} w-full h-full cursor-pointer transition-all`}>
            <div className="h-48">
              <img src={sampleModuleCover} className="object-cover h-full w-full" />
            </div>
            <div className={`${textColor.textLv1} ${fontSize.textLv2} h-full font-bold p-2`}>Lecture Schedule & Timetable</div>
          </div>
          <div className={`${bgColor.bgLv3} w-full h-full cursor-pointer transition-all`}>
            <div className="h-48">
              <img src={sampleModuleCover} className="object-cover h-full w-full" />
            </div>
            <div className={`${textColor.textLv1} ${fontSize.textLv2} h-full font-bold p-2`}>1. Introduction to Research Method</div>
          </div>
        </div>
      </div>
      {/* <div onClick={() => nav('info-page')} className="h-64 w-64 bg-lime-200">Info Page</div> */}
    </div>
  )
}