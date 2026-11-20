import React from 'react';

const Hero = () => {
  return (
    <section className="home" id="home">
      <div className="container-home">
        <img
          className="avatar"
          src="/images/prem_profile.jpg?v=2"
          alt="Prem Sagar"
        />
        <div className="text-home">
          <h4>Hi, I'm Prem Sagar 👾</h4>
          <h2>Full Stack Developer</h2>
          <p className="p-home">
            I'm Prem Sagar Ajmira, a passionate Full Stack Developer specializing in <br />
            building secure, scalable web applications with Spring Boot, React.js, and MySQL.
          </p>
        </div>
        <div className="butn-hom">
          <a href="#contact">
            <button className="btn btn-home1">Contact me</button>
          </a>
          <a href="#projects">
            <button className="btn btn-home2">My work</button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
