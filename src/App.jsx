import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DonorHomePage from './pages/donorHomePage/DonorHomePage'
// import DonorSignupFrom from './pages/donorSignupFrom/DonorSignupFrom'
// import DonateNowPopup from './pages/donorHomePage/DonateNowPopup'
import DonorSignupForm from './pages/donorSignupForm/DonorSignupForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <DonorSignupForm/>
    <DonorHomePage/>
    </>
  )
}

export default App
