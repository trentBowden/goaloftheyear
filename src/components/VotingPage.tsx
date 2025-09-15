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
      videoUrl: '/gifs/women/2025_kor_v_bosa.webm'
    },
    {
      id: 'w2',
      title: 'Hannah Roffe',
      subtitle: 'vs Adelaide City',
      videoUrl: '/gifs/women/2025_hannah_v_adelaide_city.webm'
    },
    {
      id: 'w3',
      title: 'Lisa Rodriguez',
      subtitle: 'vs Valley FC - Quarter Final',
      videoUrl: '/gifs/women-goal-3.webm'
    },
    {
      id: 'w4',
      title: 'Kate Wilson',
      subtitle: 'vs Riverside - Round 16',
      videoUrl: '/gifs/women-goal-4.webm'
    },
    {
      id: 'w5',
      title: 'Amy Johnson',
      subtitle: 'vs North Shore - Group Stage',
      videoUrl: '/gifs/women-goal-5.webm'
    }
  ],
  men: [
    {
      id: 'm1',
      title: 'James Anderson',
      subtitle: 'vs Thunder FC - Final',
      videoUrl: '/gifs/men-goal-1.webm'
    },
    {
      id: 'm2',
      title: 'Michael Brown',
      subtitle: 'vs Eagles United - Semi Final',
      videoUrl: '/gifs/men-goal-2.webm'
    },
    {
      id: 'm3',
      title: 'David Chen',
      subtitle: 'vs Storm City - Quarter Final',
      videoUrl: '/gifs/men-goal-3.webm'
    },
    {
      id: 'm4',
      title: 'Ryan O\'Connor',
      subtitle: 'vs Phoenix FC - Round 16',
      videoUrl: '/gifs/men-goal-4.webm'
    },
    {
      id: 'm5',
      title: 'Alex Martinez',
      subtitle: 'vs Coastal Warriors - Group Stage',
      videoUrl: '/gifs/men-goal-5.webm'
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
            <video 
              src={goal.videoUrl} 
              className="goal-video"
              autoPlay
              loop
              muted
              playsInline
              onError={(e) => {
                // Fallback to a placeholder if video doesn't load
                const placeholder = document.createElement('div');
                placeholder.className = 'video-placeholder';
                placeholder.innerHTML = 'Video Placeholder';
                e.currentTarget.parentNode?.replaceChild(placeholder, e.currentTarget);
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
