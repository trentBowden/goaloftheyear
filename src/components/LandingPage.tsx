import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div 
        className="landing-section women-section"
        onClick={() => navigate('/women')}
        style={{
          backgroundImage: 'url(/images/2025_women_hero.jpg)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <span>Women's</span>
      </div>
      <div 
        className="landing-section men-section"
        onClick={() => navigate('/men')}
        style={{
          backgroundImage: 'url(/images/2025_men_hero.jpg)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <span>Men's</span>
      </div>
    </div>
  );
};

export default LandingPage;
