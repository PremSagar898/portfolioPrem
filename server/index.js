import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Send email via Web3Forms HTTP API (no SMTP ports needed)
const sendEmailViaWeb3Forms = async (record) => {
  const apiKey = process.env.WEB3FORMS_KEY;
  if (!apiKey) return { success: false, reason: 'WEB3FORMS_KEY not set' };

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: apiKey,
        subject: `[Portfolio Inquiry] ${record.subject}`,
        from_name: record.name,
        replyto: record.email,
        name: record.name,
        email: record.email,
        message: `From: ${record.name} <${record.email}>\nSubject: ${record.subject}\n\n${record.message}\n\nSent at: ${new Date(record.createdAt).toLocaleString()}`
      })
    });

    const data = await response.json();
    if (data.success) {
      console.log(`[SUCCESS] Email delivered to ${RECIPIENT_EMAIL} via Web3Forms`);
      return { success: true };
    } else {
      console.error('[ERROR] Web3Forms API error:', data.message);
      return { success: false, reason: data.message };
    }
  } catch (err) {
    console.error('[ERROR] Web3Forms fetch failed:', err.message);
    return { success: false, reason: err.message };
  }
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    emailConfigured: Boolean(process.env.WEB3FORMS_KEY)
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

  // 2. Send email via Web3Forms (HTTP API — works on all hosts)
  const result = await sendEmailViaWeb3Forms(record);

  if (result.success) {
    return res.json({
      success: true,
      delivered: true,
      message: '✨ Message sent successfully! I will get back to you soon.'
    });
  } else {
    console.log('[NOTE] Email not sent:', result.reason);
    return res.json({
      success: true,
      delivered: false,
      message: '✨ Message received! I will get back to you soon.'
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
