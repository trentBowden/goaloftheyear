import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Category } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsPageProps {
  category: Category;
}

// Sample goals data for results display
const goalNames = {
  women: {
    w1: 'Sarah Mitchell',
    w2: 'Emma Thompson',
    w3: 'Lisa Rodriguez',
    w4: 'Kate Wilson',
    w5: 'Amy Johnson'
  },
  men: {
    m1: 'James Anderson',
    m2: 'Michael Brown',
    m3: 'David Chen',
    m4: 'Ryan O\'Connor',
    m5: 'Alex Martinez'
  }
};

const COLORS = ['#ff6b9d', '#4a90e2', '#28a745', '#ffc107', '#dc3545'];

const ResultsPage = ({ category }: ResultsPageProps) => {
  const navigate = useNavigate();
  const {
    womenVoteCounts,
    menVoteCounts,
    subscribeToVoteCounts,
    unsubscribeFromVoteCounts
  } = useStore();

  const voteCounts = category === 'women' ? womenVoteCounts : menVoteCounts;

  useEffect(() => {
    // Subscribe to real-time vote counts
    subscribeToVoteCounts(category);
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribeFromVoteCounts(category);
    };
  }, [category, subscribeToVoteCounts, unsubscribeFromVoteCounts]);

  // Prepare data for the chart
  const chartData = Object.entries(goalNames[category]).map(([goalId, playerName]) => {
    const voteCount = voteCounts.find(vc => vc.goalId === goalId)?.count || 0;
    return {
      name: playerName,
      votes: voteCount,
      goalId
    };
  }).sort((a, b) => b.votes - a.votes); // Sort by votes descending

  const totalVotes = chartData.reduce((sum, item) => sum + item.votes, 0);

  return (
    <div className="results-page">
      <button 
        className="back-button"
        onClick={() => navigate('/management')}
      >
        ← Back
      </button>
      
      <div className="results-header">
        {category === 'women' ? "Women's Results" : "Men's Results"}
      </div>
      
      <div className="results-container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#333', margin: 0 }}>Total Votes: {totalVotes}</h2>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.5rem 0' }}>
            Updates in real-time
          </p>
        </div>
        
        {chartData.length > 0 && totalVotes > 0 ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 80,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis 
                  fontSize={12}
                  allowDecimals={false}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Votes']}
                  labelStyle={{ color: '#333' }}
                />
                <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            color: '#666',
            fontSize: '1.1rem'
          }}>
            {totalVotes === 0 ? 'No votes yet. Start voting to see results!' : 'Loading results...'}
          </div>
        )}
        
        {totalVotes > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>Vote Breakdown:</h3>
            <div style={{ 
              display: 'grid', 
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}>
              {chartData.map((item, index) => (
                <div 
                  key={item.goalId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    backgroundColor: index < 3 ? '#f8f9fa' : 'transparent'
                  }}
                >
                  <span style={{ 
                    color: COLORS[index % COLORS.length],
                    fontWeight: 'bold'
                  }}>
                    {index + 1}. {item.name}
                  </span>
                  <span style={{ color: '#333' }}>
                    {item.votes} vote{item.votes !== 1 ? 's' : ''} 
                    ({totalVotes > 0 ? Math.round((item.votes / totalVotes) * 100) : 0}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
