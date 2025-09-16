import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { useStore } from '../store/useStore';
import { sampleGoals } from '../data/goals';
import type { Category } from '../types';

interface VotingPageProps {
  category: Category;
}

const VotingPage = ({ category }: VotingPageProps) => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState(new Set<string>());
  const [videoProgress, setVideoProgress] = useState<{ [key: string]: number }>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});
  
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

  const handleVideoLoaded = (goalId: string) => {
    setLoadedVideos(prev => new Set([...prev, goalId]));
  };

  const updateVideoProgress = (goalId: string, currentTime: number, duration: number) => {
    const progress = (currentTime / duration) * 100;
    setVideoProgress(prev => ({ ...prev, [goalId]: progress }));
  };

  const handleSubmitVote = async () => {
    if (!selectedGoal) return;
    
    setIsSubmitting(true);
    try {
      await submitVote(category, selectedGoal);
      
      // Show success toast
      toast.success(hasVoted ? 'Vote updated successfully!' : 'Vote submitted successfully!');
      
      // Trigger confetti celebration
      confetti({
        particleCount: 400,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
      });
      
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error('Error submitting vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const effectiveGoals = goals.length > 0 ? goals : sampleGoals[category];
  const allVideosLoaded = loadedVideos.size === effectiveGoals.length;
  const loadingProgress = (loadedVideos.size / effectiveGoals.length) * 100;

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
      
      <div className="voting-instructions">
        Tap on a goal video to select it, then submit your vote!
      </div>
      
      {!allVideosLoaded && (
        <div className="loading-container">
          <div className="loading-text">Loading videos...</div>
          <div className="loading-bar">
            <div 
              className="loading-progress" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="goals-grid">
        {effectiveGoals.map((goal) => (
          <div
            key={goal.id}
            className={`goal-card ${selectedGoal === goal.id ? 'selected' : ''}`}
            onClick={() => handleGoalSelect(goal.id)}
          >
            <div className="video-container">
              <video 
                ref={(el) => {
                  if (el) videoRefs.current[goal.id] = el;
                }}
                src={goal.videoUrl} 
                className="goal-video"
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => handleVideoLoaded(goal.id)}
                onTimeUpdate={(e) => {
                  const video = e.currentTarget;
                  updateVideoProgress(goal.id, video.currentTime, video.duration);
                }}
                onError={(e) => {
                  // Fallback to a placeholder if video doesn't load
                  const placeholder = document.createElement('div');
                  placeholder.className = 'video-placeholder';
                  placeholder.innerHTML = 'Video Placeholder';
                  e.currentTarget.parentNode?.replaceChild(placeholder, e.currentTarget);
                }}
              />
              <div className="video-progress-bar">
                <div 
                  className="video-progress-fill"
                  style={{ width: `${videoProgress[goal.id] || 0}%` }}
                ></div>
              </div>
            </div>
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
