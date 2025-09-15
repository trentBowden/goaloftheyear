import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div 
        className="landing-section women-section"
        onClick={() => navigate('/women')}
        style={{
          backgroundImage: 'url(/images/women-background.jpg)', // You can add this image later
        }}
      >
        <span>Women's</span>
      </div>
      <div 
        className="landing-section men-section"
        onClick={() => navigate('/men')}
        style={{
          backgroundImage: 'url(/images/men-background.jpg)', // You can add this image later
        }}
      >
        <span>Men's</span>
      </div>
    </div>
  );
};

export default LandingPage;
