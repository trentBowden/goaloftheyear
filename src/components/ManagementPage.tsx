import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const MANAGEMENT_PASSCODE = '0880';

const ManagementPage = () => {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const { resetVotes } = useStore();

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === MANAGEMENT_PASSCODE) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect passcode. Please try again.');
      setPasscode('');
    }
  };

  const handleResetVotes = async (category: 'women' | 'men') => {
    if (!confirm(`Are you sure you want to reset all ${category}'s votes? This action cannot be undone.`)) {
      return;
    }
    
    setIsResetting(true);
    try {
      await resetVotes(category);
      alert(`All ${category}'s votes have been reset successfully.`);
    } catch (error) {
      console.error('Error resetting votes:', error);
      alert('Error resetting votes. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="management-page">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Back
        </button>
        
        <div className="management-container">
          <h1 className="management-title">Management Access</h1>
          
          <form onSubmit={handlePasscodeSubmit} className="passcode-form">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              className="passcode-input"
              maxLength={4}
              autoFocus
            />
            <button 
              type="submit" 
              className="reset-button"
              style={{ 
                background: '#28a745', 
                color: 'white',
                marginTop: '1rem'
              }}
            >
              Access Management
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="management-page">
      <button 
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Back
      </button>
      
      <div className="management-container">
        <h1 className="management-title">Vote Management</h1>
        
        <div className="management-actions">
          <button
            className="reset-button reset-women"
            onClick={() => handleResetVotes('women')}
            disabled={isResetting}
          >
            {isResetting ? 'Resetting...' : "Reset Women's Votes"}
          </button>
          
          <button
            className="reset-button reset-men"
            onClick={() => handleResetVotes('men')}
            disabled={isResetting}
          >
            {isResetting ? 'Resetting...' : "Reset Men's Votes"}
          </button>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              onClick={() => navigate('/results/women')}
              style={{
                background: '#ff6b9d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                marginRight: '10px',
                cursor: 'pointer'
              }}
            >
              View Women's Results
            </button>
            
            <button
              onClick={() => navigate('/results/men')}
              style={{
                background: '#4a90e2',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              View Men's Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementPage;
