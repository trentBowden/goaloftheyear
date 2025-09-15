import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import LandingPage from './components/LandingPage';
import VotingPage from './components/VotingPage';
import ManagementPage from './components/ManagementPage';
import ResultsPage from './components/ResultsPage';
import './App.css';

function App() {
  const initializeUser = useStore((state) => state.initializeUser);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/women" element={<VotingPage category="women" />} />
          <Route path="/men" element={<VotingPage category="men" />} />
          <Route path="/management" element={<ManagementPage />} />
          <Route path="/results/women" element={<ResultsPage category="women" />} />
          <Route path="/results/men" element={<ResultsPage category="men" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
