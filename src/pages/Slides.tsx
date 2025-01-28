import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store"
import { updateTextAndAudioURL } from "../slices/InputAreaSlice"
import sampleSlide1 from "../assets/sample-slides/1.png"
import { selectBgColor } from "../slices/ThemeSlice"
import { updateChatHistory } from "../slices/AgentSlice"
import { updateCurrentLocation } from "../slices/ContentSlice"


export default function Slides() {

  const dispatch = useAppDispatch()
  const bgColor = useAppSelector(selectBgColor)
  // const welcomeMessage = 'This is the GDPR slides page. '

  useEffect(() => {
    dispatch(updateCurrentLocation('/slides'))
    // dispatch(updateTextAndAudioURL(welcomeMessage))
    // dispatch(updateChatHistory({
    //   from: 'a',
    //   content: welcomeMessage
    // }))
  }, [])

  const items = [1, 2, 3, 4]

  return (
    <div className={`${bgColor.bgLv1} w-full h-full flex flex-col`}>
      <div className="h-full w-full p-8">
        <div className={`${bgColor.bgLv3} h-full w-full grid grid-cols-1 place-items-center p-4`}>
          <img src={sampleSlide1} className="w-full" alt="" />
        </div>
      </div>
      <div className={`${bgColor.bgLv1} h-64 w-full p-8 flex gap-x-4`}>
        {items.map((item) => { return <div key={item} className={`${bgColor.bgLv3} w-64 h-full`} >{}</div> })}
      </div>
    </div>
  )
}