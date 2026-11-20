import React from 'react';

const About = () => {
  return (
    <section className="info-section" id="about">
      <h1 className="section-title">Hello, There 👋</h1>
      <div className="info-cards">
        <div className="card">
          <h1>Hi there, I'm Prem</h1>
          <p>
            B.Tech in CSE at RVR & JC College of Engineering with practical experience building scalable web applications with Java, Spring Boot, and React.js.
          </p>
          <img src="/images/grid1.png" alt="Profile details" />
        </div>

        <div className="card">
          <h1>Tech Stack</h1>
          <p>
            Java, Spring Boot, Spring MVC, React.js, MySQL, REST APIs, Python, Hibernate, JPA, Docker, and Git.
          </p>
          <img src="/images/grid2.png" alt="Tech Stack" />
        </div>

        <div className="card">
          <h1>Flexible with time zones & locations</h1>
          <p>
            Based in India and open to remote work or relocation worldwide.
          </p>
          <video src="/video/glob.mp4" autoPlay loop muted playsInline></video>
          <a href="#contact">
            <button>
              <i className="bx bx-send"></i> Contact Me
            </button>
          </a>
        </div>

        <div className="card">
          <h1>My Passion for Coding</h1>
          <p>
            I love architecting robust backend systems, solving complex data structure challenges, and building high-performance web applications.
          </p>
          <img src="/images/grid4.png" alt="Passion for coding" />
        </div>
      </div>
    </section>
  );
};

export default About;
