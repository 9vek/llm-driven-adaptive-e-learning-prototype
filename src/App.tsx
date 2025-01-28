import { Outlet, useNavigate } from "react-router-dom"
import InputArea from "./components/InputArea"
import AISidebar from "./components/AISideBar"
import { useAppSelector } from "./store"
import {
  selectBgColor,
  selectFontSize,
  selectLayout,
  selectTextColor
} from "./slices/ThemeSlice"

export default function App() {

  const bgColor = useAppSelector(selectBgColor)
  const textColor = useAppSelector(selectTextColor)
  const fontSize = useAppSelector(selectFontSize)
  const layout = useAppSelector(selectLayout)

  const nav = useNavigate()

  return (
    <div className={`${layout.appClasses} h-screen max-h-screen overflow-hidden`}>
      <div className={`${layout.mainViewClasses} w-full h-screen overflow-scroll scrollbar-none transition-all`}>
        <div className={`${bgColor.bgLv2} w-full flex gap-4 p-4 transition-all`}>
          <div className={`${textColor.textLv1} ${fontSize.textLv1} font-bold grid grid-cols-1 place-items-center`}>Sample E-learning Platform</div>
          <div onClick={() => nav('/')} className={`${bgColor.bgLv3} ${textColor.textLv1} ${fontSize.textLv2} px-4 py-2 h-full transition-all grid grid-cols-1 place-items-center cursor-pointer`}>Modules</div>
          <div onClick={() => nav('/timetable')} className={`${bgColor.bgLv3} ${textColor.textLv1} ${fontSize.textLv2} px-4 py-2 h-full transition-all grid grid-cols-1 place-items-center cursor-pointer`}>Timetable</div>
          <div onClick={() => nav('/slides')} className={`${bgColor.bgLv3} ${textColor.textLv1} ${fontSize.textLv2} px-4 py-2 h-full transition-all grid grid-cols-1 place-items-center cursor-pointer`}>Learning</div>
          <div onClick={() => nav('/profile')} className={`${bgColor.bgLv3} ${textColor.textLv1} ${fontSize.textLv2} px-4 py-2 h-full transition-all grid grid-cols-1 place-items-center cursor-pointer`}>Profile</div>
        </div>
        <Outlet />
      </div>
      <div className={`${bgColor.bgLv2} ${layout.sideViewClasses} w-full h-screen transition-all`}>
        <div className="h-[78%] p-4 pb-2">
          <AISidebar />
        </div>
        <div className="p-4 pt-2 grid grid-cols-1 place-items-center">
          <InputArea />
        </div>
      </div>
    </div>
  )
}
