import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import img1 from '../../../images/1.png';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/admin');
  };

  return (
    <div className="auth-container">
      <div className="auth-image-side">
        <div className="auth-image-wrapper">
          <img
            src={img1}
            alt="Cityscape illustration asset"
            className="auth-bg-image"
          />
          <div className="auth-image-overlay"></div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-box">
          <h2>Create an account</h2>
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-checkbox">
              <label className="checkbox-label">
                <input type="checkbox" id="terms" required />
                <span className="checkbox-text">
                  I agree to the <span className="text-teal font-medium">Terms and Conditions</span>
                </span>
              </label>
            </div>

            <button type="submit" className="btn-primary auth-submit">
              Get started
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
