import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [signupStatus, setSignupStatus] = useState(null);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    // Simulate signup logic
    const isSignupSuccessful = true; // Change to false to simulate failure

    if (isSignupSuccessful) {
      setSignupStatus('success');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after success
    } else {
      setSignupStatus('failed');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignup}>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email Id" required />
          <input type="password" placeholder="New Password" required />
          <button type="submit">Sign Up</button>
        </form>
        
        {/* Display notification */}
        {signupStatus === 'success' && (
          <div className="success-message">Signup successful! Redirecting to login...</div>
        )}
        {signupStatus === 'failed' && (
          <div className="error-message">Signup failed. Try again.</div>
        )}
        <p>
          Already have an account?{' '}
          <span 
            className="login-link" 
            onClick={() => navigate('/login')}
            style={{ color: '#865D36', cursor: 'pointer' }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
