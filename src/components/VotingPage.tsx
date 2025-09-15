import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Goal, Category } from '../types';

interface VotingPageProps {
  category: Category;
}

// Sample goals data - you can replace this with your actual goals
const sampleGoals: { [key in Category]: Goal[] } = {
  women: [
    {
      id: 'w1',
      title: 'Karina Sapio',
      subtitle: 'vs BOSA',
      gifUrl: '/gifs/women/2025_kor_v_bosa.gif'
    },
    {
      id: 'w2',
      title: 'Hannah Roffe',
      subtitle: 'vs Adelaide City',
      gifUrl: '/gifs/women/2025_hannah_v_adelaide_city.gif'
    },
    {
      id: 'w3',
      title: 'Lisa Rodriguez',
      subtitle: 'vs Valley FC - Quarter Final',
      gifUrl: '/gifs/women-goal-3.gif'
    },
    {
      id: 'w4',
      title: 'Kate Wilson',
      subtitle: 'vs Riverside - Round 16',
      gifUrl: '/gifs/women-goal-4.gif'
    },
    {
      id: 'w5',
      title: 'Amy Johnson',
      subtitle: 'vs North Shore - Group Stage',
      gifUrl: '/gifs/women-goal-5.gif'
    }
  ],
  men: [
    {
      id: 'm1',
      title: 'James Anderson',
      subtitle: 'vs Thunder FC - Final',
      gifUrl: '/gifs/men-goal-1.gif'
    },
    {
      id: 'm2',
      title: 'Michael Brown',
      subtitle: 'vs Eagles United - Semi Final',
      gifUrl: '/gifs/men-goal-2.gif'
    },
    {
      id: 'm3',
      title: 'David Chen',
      subtitle: 'vs Storm City - Quarter Final',
      gifUrl: '/gifs/men-goal-3.gif'
    },
    {
      id: 'm4',
      title: 'Ryan O\'Connor',
      subtitle: 'vs Phoenix FC - Round 16',
      gifUrl: '/gifs/men-goal-4.gif'
    },
    {
      id: 'm5',
      title: 'Alex Martinez',
      subtitle: 'vs Coastal Warriors - Group Stage',
      gifUrl: '/gifs/men-goal-5.gif'
    }
  ]
};

const VotingPage = ({ category }: VotingPageProps) => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    womenGoals,
    menGoals,
    hasVotedWomen,
    hasVotedMen,
    currentVoteWomen,
    currentVoteMen,
    setGoals,
    submitVote,
    subscribeToVoteCounts
  } = useStore();

  const goals = category === 'women' ? womenGoals : menGoals;
  const hasVoted = category === 'women' ? hasVotedWomen : hasVotedMen;
  const currentVote = category === 'women' ? currentVoteWomen : currentVoteMen;

  useEffect(() => {
    // Set sample goals if not already set
    if (goals.length === 0) {
      setGoals(category, sampleGoals[category]);
    }
    
    // Subscribe to vote counts for real-time updates
    subscribeToVoteCounts(category);
    
    // Set current selection if user has already voted
    if (hasVoted && currentVote) {
      setSelectedGoal(currentVote);
    }
  }, [category, goals.length, hasVoted, currentVote, setGoals, subscribeToVoteCounts]);

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
  };

  const handleSubmitVote = async () => {
    if (!selectedGoal) return;
    
    setIsSubmitting(true);
    try {
      await submitVote(category, selectedGoal);
      alert(hasVoted ? 'Vote updated successfully!' : 'Vote submitted successfully!');
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Error submitting vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const effectiveGoals = goals.length > 0 ? goals : sampleGoals[category];

  return (
    <div className="voting-page">
      <button 
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Back
      </button>
      
      <div className="voting-header">
        {category === 'women' ? "Women's Goal of the Year" : "Men's Goal of the Year"}
      </div>
      
      <div className="goals-grid">
        {effectiveGoals.map((goal) => (
          <div
            key={goal.id}
            className={`goal-card ${selectedGoal === goal.id ? 'selected' : ''}`}
            onClick={() => handleGoalSelect(goal.id)}
          >
            <img 
              src={goal.gifUrl} 
              alt={`${goal.title} goal`}
              className="goal-gif"
              onError={(e) => {
                // Fallback to a placeholder if GIF doesn't load
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdJRiBQbGFjZWhvbGRlcjwvdGV4dD48L3N2Zz4=';
              }}
            />
            <div className="goal-info">
              <div className="goal-title">{goal.title}</div>
              <div className="goal-subtitle">{goal.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedGoal && (
        <button
          className="submit-button"
          onClick={handleSubmitVote}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : hasVoted ? 'Update Vote' : 'Submit Vote'}
        </button>
      )}
    </div>
  );
};

export default VotingPage;
