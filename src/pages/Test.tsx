import { selectBgColor } from "../slices/ThemeSlice"
// import { useAIDispatcher } from "../hooks/useChatCompletion";
import { useAppSelector } from "../store"

export default function Test() {

  const bgColor = useAppSelector(selectBgColor)

  const test = async () => {
    
  }

  return (
    <div className={`${bgColor.bgLv1} h-full grid grid-cols-1 place-items-center`}>
      <div onClick={test} className={`${bgColor.bgLv2} h-32 w-32 rounded-lg`}></div>
    </div>
  )
}