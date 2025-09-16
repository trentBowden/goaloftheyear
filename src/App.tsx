import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: '16px',
              padding: '16px',
              borderRadius: '8px',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App
