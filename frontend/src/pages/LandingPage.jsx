import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ShieldCheck, Play } from 'lucide-react';
import heroBgImage from '../../../images/4.png';
import img3 from '../../../images/3.png';
import img2 from '../../../images/2.png';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const LandingPage = () => {
  return (
    <div className="landing-page">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="top-nav"
      >
        <div className="brand">
          <ShieldCheck className="text-teal" size={24} />
          <span>Municipal Excellence</span>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="nav-link">Log in</Link>
          <Link to="/register" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Sign up</Link>
        </div>
      </motion.header>

      <section className="hero-section" style={{ backgroundImage: `url(${heroBgImage})` }}>
        <div className="hero-image-overlay"></div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="hero-content"
        >
          <motion.h1 variants={fadeInUp} className="hero-title">
            Building <br />
            <span className="text-teal">Smarter Bharat</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="hero-subtitle">
            Empowering citizens with digital infrastructure for better governance, seamless services, and smarter cities across India.
          </motion.p>
          <motion.div variants={fadeInUp} className="hero-actions">
            <button className="btn-surface">
              <Play size={18} />
              Play Overview
            </button>
            <Link to="/report" className="btn-primary">
              Access Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="stats-grid"
      >
        <motion.div variants={fadeInUp} className="stat-card">
          <h3>1.4k+</h3>
          <p>Open Issues Resolved</p>
        </motion.div>
        <motion.div variants={fadeInUp} className="stat-card">
          <h3>98.2%</h3>
          <p>Citizen Survey Positive</p>
        </motion.div>
        <motion.div variants={fadeInUp} className="stat-card">
          <h3>12m</h3>
          <p>Avg Response Time</p>
        </motion.div>
      </motion.section>

      <section className="complaint-examples-section">
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="section-title"
        >
          Example of Complaint
        </motion.h2>
        <div className="example-images-container">
          <motion.div
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="example-card example-card-left"
          >
            <img src={img3} alt="Dirt road with potholes" className="example-img" />
            <p className="example-desc">A deep pothole has formed near Kharghar. It is causing traffic slowdowns and poses a serious risk of accidents for two-wheelers and cars. The condition worsens during rainfall as it becomes difficult to spot. Requesting immediate repair to ensure public safety.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="example-card example-card-right"
          >
            <p className="example-desc">There is stagnant water on the road near Kharghar Haily due to clogged drainage. This is creating difficulties for commuters and may lead to mosquito breeding and unhygienic conditions. Requesting prompt action to clear the blockage and resolve the issue.</p>
            <img src={img2} alt="Water logged street scene" className="example-img" />
          </motion.div>
        </div>
      </section>

      <section className="workflow-section">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
          className="workflow-container"
        >
          <motion.div variants={fadeInUp} className="workflow-header">
            <h2>Smart <br /><span className="text-teal">Governance Workflow</span></h2>
          </motion.div>
          <div className="workflow-steps">
            <motion.div variants={fadeInUp} className="step-item">
              <div className="step-number">01</div>
              <div className="step-content">
                <h4>Report an Issue</h4>
                <p>Capture evidence of potholes, garbage, or water logging with photos and location details. Dispatch instantly to local authorities.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="step-item">
              <div className="step-number">02</div>
              <div className="step-content">
                <h4>Track Complaint Status</h4>
                <p>Monitor your complaint in real-time as it moves from Submitted &gt; In Progress &gt; Resolved. Get updates and notifications instantly.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="step-item">
              <div className="step-number">03</div>
              <div className="step-content">
                <h4>Resolution & Feedback</h4>
                <p>Once resolved, verify the fix and share your feedback to improve quality control and civic accountability.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <footer>
        <div className="footer-brand">
          <span className="text-teal font-bold">Municipal Excellence</span>
          <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>© 2024 Municipal Excellence Strategy. Built for Civic Architects.</p>
        </div>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Accessibility</a>
          <a href="#">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
