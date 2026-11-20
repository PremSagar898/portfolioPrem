import React, { useRef, useState } from 'react';

const ProjectCard = ({ project }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="project-card">
      <div
        className="project-vidbox"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video ref={videoRef} loop muted src={project.videoSrc}></video>
        <div className={`hover-sign ${isPlaying ? 'active' : ''}`}></div>
      </div>
      <div className="project-info">
        <h1>
          {project.titlePrefix}{' '}
          <span className="gradient">{project.titleGradient}</span>{' '}
          {project.titleSuffix}
        </h1>
        <p>{project.description}</p>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>
            <i className="bx bxl-github"></i> {project.buttonText}
          </button>
        </a>
      </div>
    </div>
  );
};

const Projects = () => {
  const projectsData = [
    {
      id: 1,
      titlePrefix: 'Hospital',
      titleGradient: 'Management',
      titleSuffix: 'System',
      description:
        'Full-stack Hospital Management platform using Java, Spring Boot, Spring Security, JWT, React.js, and MySQL. Features role-based access control, 20+ RESTful APIs, BCrypt auth, and Dockerized cloud deployment.',
      videoSrc: '/video/project1.mp4',
      link: 'https://github.com/PremSagar898/hospital-management-system.git',
      buttonText: 'View Code'
    },
    {
      id: 2,
      titlePrefix: 'MetroMind',
      titleGradient: 'AI Navigation',
      titleSuffix: 'System',
      description:
        'Full-stack AI-powered metro navigation platform with Spring Boot, React.js, and MySQL. Features Random Forest ML congestion prediction integrated with Dijkstra shortest-path routing algorithm.',
      videoSrc: '/video/project2.mp4',
      link: 'https://github.com/PremSagar898/MetroMind-AI-Intelligent-Metro-Navigation-System.git',
      buttonText: 'View Code'
    },
    {
      id: 3,
      titlePrefix: 'Predictive',
      titleGradient: 'ML Analytics',
      titleSuffix: 'Models',
      description:
        'Machine learning pipelines developed using Python, Scikit-learn, and Pandas for predictive analytics, exploratory data analysis (EDA), and data preprocessing workflows.',
      videoSrc: '/video/project3.mp4',
      link: 'https://github.com/PremSagar898',
      buttonText: 'View GitHub'
    }
  ];

  return (
    <section className="my-project" id="projects">
      <h1 className="section-title">My Projects 👨‍💻</h1>
      {projectsData.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </section>
  );
};

export default Projects;
