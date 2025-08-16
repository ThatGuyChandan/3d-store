import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPromptPopup.css';

const LoginPromptPopup = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose();
    navigate('/login');
  };

  const handleRegisterClick = () => {
    onClose();
    navigate('/register');
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Login Required</h2>
        <p>Please login or register to view product details.</p>
        <div className="popup-actions">
          <button onClick={handleLoginClick} className="popup-button primary">Login</button>
          <button onClick={handleRegisterClick} className="popup-button secondary">Register</button>
          <button onClick={onClose} className="popup-button close">Close</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptPopup;