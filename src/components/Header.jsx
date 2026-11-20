import React, { useState, useEffect } from 'react';

const Header = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Background darkens on scroll
      setScrolled(window.scrollY > 50);

      // Active section detection
      const sections = ['home', 'about', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="header"
      style={{
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.8)'
      }}
    >
      <div className="container">
        <h1 className="logo">
          <a href="#home"><span>P</span>rem<span className="logo-s">.</span></a>
        </h1>

        <nav className="nav-list">
          <ul className="ul-list">
            <li>
              <a
                href="#home"
                className={activeSection === 'home' ? 'active' : ''}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={activeSection === 'about' ? 'active' : ''}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#projects"
                className={activeSection === 'projects' ? 'active' : ''}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={activeSection === 'contact' ? 'active' : ''}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <div className="box-icons">
          <a
            href="https://github.com/PremSagar898"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <i className="bx bxl-github"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/prem-sagar-ajmira-498a46260/"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
          >
            <i className="bx bxl-linkedin-square"></i>
          </a>
          <a
            href="mailto:premsagarajmira@gmail.com"
            title="Email"
          >
            <i className="bx bx-envelope"></i>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
