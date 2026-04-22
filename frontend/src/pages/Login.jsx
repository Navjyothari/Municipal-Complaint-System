import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@municipal.gov');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userConfig', JSON.stringify(data.user));
        
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        setErrorMsg(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const useAdmin = () => {
    setEmail('admin@municipal.gov');
    setPassword('admin123');
  };

  const useCitizen = () => {
    setEmail('john.doe@example.com');
    setPassword('user123');
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="auth-image-side"
      >
        <div className="auth-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop"
            alt="Cityscape illustration asset"
            className="auth-bg-image"
          />
          <div className="auth-image-overlay"></div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="auth-form-side"
      >
        <div className="auth-form-box">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Please enter your details to sign in.</p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <Button type="button" onClick={useAdmin} variant="outline" size="sm" style={{ padding: '6px 12px', fontSize: '11px', background: 'rgba(0,199,182,0.1)', color: '#00c7b6', borderColor: '#00c7b6' }}>Fill Admin Test Acc</Button>
            <Button type="button" onClick={useCitizen} variant="outline" size="sm" style={{ padding: '6px 12px', fontSize: '11px', background: 'rgba(255,255,255,0.05)', color: '#bbb', borderColor: 'rgba(255,255,255,0.1)' }}>Fill Citizen Test Acc</Button>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}
              >
                {errorMsg}
              </motion.div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <div className="form-label-row">
                 <label htmlFor="password">Password</label>
                 <a href="#" className="forgot-password">Forgot password?</a>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="btn-primary auth-submit group" disabled={isLoading}>
              {isLoading ? 'Signing in...' : (
                <>
                  Log in
                  <ArrowRight className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5" size={16} strokeWidth={2} aria-hidden="true" />
                </>
              )}
            </Button>
          </form>

          <p className="auth-footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
