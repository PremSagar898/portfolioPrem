import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    needsActivation: false,
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus({
      submitting: true,
      success: false,
      error: false,
      needsActivation: false,
      message: ''
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: result.message || '✨ Message received successfully!'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(result.error || 'Failed to submit message.');
      }
    } catch (err) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Backend server not reached. Click below to open your email app and send directly.'
      });
    }
  };

  const handleMailtoFallback = () => {
    const mailSubject = encodeURIComponent(
      formData.subject || `Portfolio Message from ${formData.name || 'Visitor'}`
    );
    const mailBody = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:premsagarajmira@gmail.com?subject=${mailSubject}&body=${mailBody}`;
  };

  return (
    <section className="contact-section" id="contact">
      <h1 className="section-title">Get In Touch 📬</h1>
      <p className="contact-subtitle">
        Have a project in mind, an opportunity, or a question? Send a message below and it will be delivered directly to my email!
      </p>

      <div className="contact-container-centered">
        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status.submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status.submitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="What is this regarding?"
                value={formData.subject}
                onChange={handleChange}
                disabled={status.submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Type your message here..."
                required
                value={formData.message}
                onChange={handleChange}
                disabled={status.submitting}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-contact-submit"
              disabled={status.submitting}
            >
              {status.submitting ? (
                <>
                  <i className="bx bx-loader-alt bx-spin"></i> Sending...
                </>
              ) : (
                <>
                  <i className="bx bx-send"></i> Send Message
                </>
              )}
            </button>

            {/* Success Message */}
            {status.success && (
              <div className="form-status-alert success">
                <i className="bx bx-check-circle"></i> {status.message}
              </div>
            )}


            {/* Error / Fallback Option */}
            {status.error && (
              <div className="form-status-alert error">
                <div>
                  <p><i className="bx bx-error-circle"></i> {status.message}</p>
                  <button
                    type="button"
                    onClick={handleMailtoFallback}
                    className="btn-mailto-fallback"
                  >
                    <i className="bx bx-envelope"></i> Open in Email App (premsagarajmira@gmail.com)
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
