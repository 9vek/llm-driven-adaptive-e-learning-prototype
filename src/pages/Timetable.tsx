import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../store"
import { updateTextAndAudioURL } from "../slices/InputAreaSlice"
import { useNavigate } from "react-router-dom"
import { updateCurrentLocation } from "../slices/ContentSlice"
import { updateChatHistory } from "../slices/AgentSlice"
import { selectBgColor, selectFontSize, selectTextColor } from "../slices/ThemeSlice"

export default function Timetable() {

  const dispatch = useAppDispatch()

  // const starterMessage = 'Here is your schedule information. '

  const bgColor = useAppSelector(selectBgColor)
  const textColor = useAppSelector(selectTextColor)
  const fontSize = useAppSelector(selectFontSize)

  useEffect(() => {
    dispatch(updateCurrentLocation('/timetable'))
    // setTimeout(() => {
    //   dispatch(updateCurrentLocation('/timetable'))
    //   dispatch(updateChatHistory({
    //     from: 'Agent',
    //     content: starterMessage
    //   }))
    //   dispatch(updateTextAndAudioURL(starterMessage))
    // }, 800)

  }, [])

  return (
    <div className={`${bgColor.bgLv1} h-full w-full p-4 transition-all`}>
      <div className={`${bgColor.bgLv1} container h-full w-7xl mx-auto p-8 flex flex-col gap-8 transition-all`}>
        <div className={`${bgColor.bgLv2} w-full flex p-8 gap-8 hover:border transition-all`}>
          <div className={`${bgColor.bgLv2} h-full w-full transition-all p-2`}>
            <div className={`${textColor.textLv1} ${fontSize.textLv1} font-bold`}>Accommodations</div>
            <div className={`${textColor.textLv1} ${fontSize.textLv2}`}>Additional 15 mins break time, additional 30 mins exam time, additional 7 days assignment submission time. </div>
          </div>
        </div>
        <div className={`${bgColor.bgLv2} h-full w-full grid grid-cols-1 place-items-center gap-x-8 p-8 transition-all`}>
          <div className={`${textColor.textLv1} ${fontSize.textLv1}`}>Sample Timetable</div>
        </div>
      </div>
    </div>
  )
}