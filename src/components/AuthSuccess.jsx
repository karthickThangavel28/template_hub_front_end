import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/auth/user', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(() => {
        navigate('/', { replace: true }); 
      })
      .catch(() => {
        navigate('/', { replace: true });
      });
  }, [navigate]);

  return <p>Logging you in...</p>;
};

export default AuthSuccess;
