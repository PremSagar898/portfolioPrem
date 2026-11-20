import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <h2 className="footer-logo">Prem Sagar</h2>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-socials">
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
          <a href="mailto:premsagarajmira@gmail.com" title="Email">
            <i className="bx bx-envelope"></i>
          </a>
        </div>

        <p className="footer-copy">© 2026 Prem Sagar Ajmira | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
