import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { OnboardingFlow } from './components/onboarding/OnboardingFlow'
import { Dashboard } from './pages/dashboard/Dashboard'
import { WalletConnect } from './components/auth/WalletConnect'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Routes>
          <Route path="/" element={<OnboardingFlow />} />
          <Route path="/connect" element={<WalletConnect />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* More routes will be added */}
        </Routes>
      </div>
    </Router>
  )
}

export default App