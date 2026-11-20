import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'premsagarajmira@gmail.com';

// Middleware
app.use(cors());
app.use(express.json());

// Path to local message storage
const DATA_FILE = path.join(__dirname, 'data', 'messages.json');

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Function to save message to local JSON database
const saveMessage = (msgData) => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const messages = JSON.parse(raw || '[]');
    messages.push(msgData);
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving message to database:', err);
    return false;
  }
};

// Configure Nodemailer Transporter
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass
      }
    });
  }
  return null;
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    emailConfigured: Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS)
  });
});

// View all received messages
app.get('/api/messages', (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const messages = JSON.parse(raw || '[]');
    res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to read messages' });
  }
});

// Contact Submission Endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, and message are required fields.'
    });
  }

  const record = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.trim(),
    subject: subject ? subject.trim() : `New Message from ${name}`,
    message: message.trim(),
    createdAt: new Date().toISOString()
  };

  // 1. Save to database
  saveMessage(record);
  console.log(`[INFO] New contact message received from: ${record.name} (${record.email})`);

  // 2. Dispatch Email
  const transporter = createTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"${record.name}" <${process.env.EMAIL_USER}>`,
        replyTo: record.email,
        to: RECIPIENT_EMAIL,
        subject: `[Portfolio Inquiry] ${record.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 25px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #007BFF; margin-top: 0;">New Portfolio Message</h2>
              <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 15px 0;">
              <p><strong>Name:</strong> ${record.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${record.email}">${record.email}</a></p>
              <p><strong>Subject:</strong> ${record.subject}</p>
              <p><strong>Received At:</strong> ${new Date(record.createdAt).toLocaleString()}</p>
              <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #007BFF; border-radius: 4px;">
                <p style="margin: 0; white-space: pre-wrap;">${record.message}</p>
              </div>
            </div>
          </div>
        `
      });

      console.log(`[SUCCESS] Email successfully delivered to ${RECIPIENT_EMAIL}`);
      return res.json({
        success: true,
        delivered: true,
        message: '✨ Message sent successfully and delivered to your email!'
      });
    } catch (mailErr) {
      console.error('[ERROR] Failed to send email via SMTP:', mailErr.message);
      return res.json({
        success: true,
        delivered: false,
        message: 'Message saved securely in your backend database! (Note: Check SMTP settings in .env to deliver via Gmail).'
      });
    }
  } else {
    console.log('[NOTE] EMAIL_USER/EMAIL_PASS not configured in .env; message saved to server/data/messages.json.');
    return res.json({
      success: true,
      delivered: false,
      message: '✨ Message received and saved successfully in your backend database!'
    });
  }
});

// Serve static frontend assets from dist in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Backend server is running at http://localhost:${PORT}`);
  console.log(`📁 Message database located at: ${DATA_FILE}`);
});
