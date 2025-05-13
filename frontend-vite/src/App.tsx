import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import AgentArenaPage from './pages/AgentArenaPage'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [walletConnected, setWalletConnected] = useState(false)
  
  return (
    <div className="app">
      <Header walletConnected={walletConnected} setWalletConnected={setWalletConnected} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/arena" element={<AgentArenaPage walletConnected={walletConnected} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
