import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from "react-redux"
import { store } from './store.ts'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import App from './App.tsx'
import Home from './pages/Home.tsx'
import Profile from './pages/Profile.tsx'
import Slides from './pages/Slides.tsx'
import Timetable from './pages/Timetable.tsx'
import Test from './pages/Test.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/Timetable",
        element: <Timetable />
      },
      {
        path: "/slides",
        element: <Slides />
      },
      {
        path: 'test',
        element: <Test />
      }
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
