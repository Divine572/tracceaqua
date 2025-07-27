import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
// import Dashboard from './pages/dashboard/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingFlow />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* More routes will be added */}
      </Routes>
    </Router>
  )
}

export default App
