import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaTelegramPlane } from 'react-icons/fa';
import '../styles/Home.css';
import logo from '../assets/logo.png';

const Home = () => {
    return (
        <div className="home-container">
            <nav className="home-nav">
                <div className="logo text-primary" style={{ color: '#3b82f6' }}>TBSV NEXUS</div>
                <div className="nav-links">
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/register" className="nav-link btn-primary">Register</Link>
                </div>
            </nav>

            <main className="home-main">
                <div className="hero-section">
                    <div className="hero-image-container">
                        <img src={logo} alt="TBSV NEXUS Solutions Image" className="hero-image" />
                    </div>
                    <div className="hero-content">
                        <h1 style={{ color: '#1e293b' }}>Welcome to<br/><span style={{ color: '#3b82f6' }}>TBSV NEXUS</span> <span style={{ color: '#1e293b' }}>Solutions</span></h1>
                        <p className="hero-subtitle">
                            We help businesses grow by building easy-to-use software.<br/>
                            We create smart technology solutions to make your daily<br/>
                            work smoother and faster.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/login" className="btn btn-primary-lg">Get Started &rarr;</Link>
                            <Link to="/register" className="btn btn-secondary-lg">Join Us</Link>
                        </div>
                    </div>
                </div>

                <div className="features-section">
                    <div className="feature-card">
                        <div className="feature-icon-wrapper blue-icon">
                            <span className="feature-icon">{'</>'}</span>
                        </div>
                        <div className="feature-text">
                            <h3>Custom Software<br/>Development</h3>
                            <p>We build useful and reliable apps<br/>that are made exactly for what<br/>your business needs.</p>
                        </div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrapper lightblue-icon">
                            <span className="feature-icon">🚀</span>
                        </div>
                        <div className="feature-text">
                            <h3>Digital Upgrades</h3>
                            <p>We help bring your business up<br/>to speed with the latest technology<br/>to make things run better.</p>
                        </div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrapper green-icon">
                            <span className="feature-icon">🔒</span>
                        </div>
                        <div className="feature-text">
                            <h3>Safe & Online</h3>
                            <p>We keep your data safe and<br/>ensure your systems are always<br/>online and running smoothly.</p>
                        </div>
                    </div>
                </div>

                <div className="stats-section-wrapper">
                    <div className="stats-section">
                        <div className="stat-card">
                            <h3><span className="stat-icon" style={{color: '#8b5cf6'}}>👥</span> 50+</h3>
                            <p>Projects Completed</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-card">
                            <h3><span className="stat-icon" style={{color: '#10b981'}}>😊</span> 20+</h3>
                            <p>Happy Clients</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-card">
                            <h3><span className="stat-icon" style={{color: '#3b82f6'}}>⭐</span> 99%</h3>
                            <p>Client Satisfaction</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-card">
                            <h3><span className="stat-icon" style={{color: '#f59e0b'}}>🎧</span> 24/7</h3>
                            <p>Support</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="home-footer dark-footer">
                <div className="footer-content-wrapper">
                    <div className="footer-col brand-col">
                        <h4 className="footer-logo"><span style={{color: '#3b82f6'}}>TBSV NEXUS</span> <span style={{color: '#f8fafc', fontWeight: '400'}}>SOLUTIONS</span></h4>
                        <p>Building smart solutions for a better tomorrow.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Contact Us</h4>
                        <p>✉ contact@tbsvnexus.com</p>
                        <p>📞 +91 12345 67890</p>
                    </div>
                    <div className="footer-col">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                            <span className="social-icon"><FaFacebookF /></span>
                            <span className="social-icon"><FaTwitter /></span>
                            <span className="social-icon"><FaInstagram /></span>
                            <span className="social-icon"><FaTelegramPlane /></span>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} TBSV NEXUS Solutions. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
