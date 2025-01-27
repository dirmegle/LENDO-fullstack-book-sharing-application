import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from './router/router'
import { UserProvider } from './context/UserContext'

export default function App() {
  return (
    <UserProvider><RouterProvider router={router} /></UserProvider>)
}
