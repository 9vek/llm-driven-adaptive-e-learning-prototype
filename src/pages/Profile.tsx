import { useAppDispatch, useAppSelector } from "../store"
import { updateText, updateTextAndAudioURL } from "../slices/InputAreaSlice"
import { useEffect } from "react"
import { selectBgColor, selectFontSize, selectTextColor } from "../slices/ThemeSlice"
import { selectContentPreference, selectInterfacePreference, selectSchedulingPreference, selectUsername } from "../slices/UserSlice"
import { updateChatHistory } from "../slices/AgentSlice"
import { updateCurrentLocation } from "../slices/ContentSlice"

export default function Profile() {

  const dispatch = useAppDispatch()

  const bgColor = useAppSelector(selectBgColor)
  const textColor = useAppSelector(selectTextColor)
  const fontSize = useAppSelector(selectFontSize)
  const username = useAppSelector(selectUsername)
  const interfacePreference = useAppSelector(selectInterfacePreference)
  const contentPreference = useAppSelector(selectContentPreference)
  const schedulingPreference = useAppSelector(selectSchedulingPreference)

  // const starterMessage = 'Hello, let\'s create your profile step by step. What\'s your name? '

  // useEffect(() => {
  //   dispatch(updateCurrentLocation('/profile'))
  //   dispatch(updateChatHistory({
  //     from: 'Agent',
  //     content: starterMessage
  //   }))
  //   dispatch(updateTextAndAudioURL(starterMessage))
  // }, [])


  return (
    <div className={`${bgColor.bgLv1} h-full w-full p-4 transition-all`}>
      <div className={`${bgColor.bgLv1} container h-full max-w-6xl mx-auto p-8 flex flex-col gap-8 transition-all`}>
        <div className={`${bgColor.bgLv2} h-full w-full flex p-8 gap-8 transition-all`}>
          <div className={`${bgColor.bgLv3} shadow-lg flex-shrink-0 w-64 h-64 rounded-full transition-all`}></div>
          <div className="w-full flex flex-col gap-y-4">
            <div className={`${bgColor.bgLv2} w-full transition-all p-2`}>
              <div className={`${textColor.textLv1} ${fontSize.textLv2}`}>User Name</div>
              <div className={`${textColor.textLv1} ${fontSize.textLv1} font-bold`}>{username ? username : '-'}</div>
            </div>
            <div className={`${bgColor.bgLv2} w-full transition-all p-2`}>
              <div className={`${textColor.textLv1} ${fontSize.textLv2}`}>Interface Preference</div>
              <div className={`${textColor.textLv1} ${fontSize.textLv1} font-bold`}>{interfacePreference ? interfacePreference : '-'}</div>
            </div>
            <div className={`${bgColor.bgLv2} w-full transition-all p-2`}>
              <div className={`${textColor.textLv1} ${fontSize.textLv2}`}>Content Preference</div>
              <div className={`${textColor.textLv1} ${fontSize.textLv1} font-bold`}>{contentPreference ? contentPreference : '-'}</div>
            </div>
            <div className={`${bgColor.bgLv2} w-full transition-all p-2`}>
              <div className={`${textColor.textLv1} ${fontSize.textLv2}`}>Scheduling Preference</div>
              <div className={`${textColor.textLv1} ${fontSize.textLv1} font-bold`}>{schedulingPreference ? schedulingPreference : '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}