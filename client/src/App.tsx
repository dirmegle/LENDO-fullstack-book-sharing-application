import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from './router/router'

export default function App() {
  return <RouterProvider router={router} />
}
