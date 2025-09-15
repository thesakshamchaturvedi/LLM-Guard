# 🛡️ LLM-Guard - AI Security Code Analyst

LLM-Guard is an open-source web application that leverages AI to analyze code snippets and configuration files for security vulnerabilities. Built with FastAPI backend and React frontend, it provides educational insights into secure coding practices.

## ✨ Features

- **AI-Powered Analysis**: Uses Google Gemini API for intelligent security vulnerability detection
- **Multi-Language Support**: Analyze JavaScript, Python, Dockerfile, YAML, and more
- **Educational Focus**: Detailed explanations and actionable recommendations
- **Modern UI**: Clean, responsive interface with Monaco code editor
- **Free Tier**: Completely free to use with Google Gemini's generous free tier

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Google Gemini API key (free from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Backend Setup

1. **Clone and setup backend:**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

2. **Run the backend:**
```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. **Setup and run frontend:**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔧 API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `POST /analyze` - Analyze code for security vulnerabilities

### Example API Usage

```bash
curl -X POST "http://127.0.0.1:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "code_snippet": "const password = \"admin123\";",
    "language": "javascript"
  }'
```

## 📁 Project Structure

```
llm-guard/
├── main.py              # FastAPI backend
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
├── README.md           # This file
└── frontend/
    ├── package.json    # Node.js dependencies
    ├── index.html      # HTML template
    ├── src/
    │   ├── App.tsx     # Main React component
    │   ├── App.css     # Styles
    │   ├── api.ts      # API client
    │   └── components/ # React components
    │       ├── Header.tsx
    │       ├── CodeInput.tsx
    │       └── ResultsDisplay.tsx
```

## 🛠️ Development

### Adding New Languages

1. Add the language to the select dropdown in `App.tsx`
2. The Monaco editor automatically supports syntax highlighting for most languages

### Customizing Security Rules

Modify the `SYSTEM_PROMPT` in `main.py` to adjust the AI's focus areas and analysis depth.

### Rate Limiting

The backend includes basic rate limiting (10 requests per minute). Customize in the `check_rate_limit` function.

## 🔒 Security Features Detected

- SQL Injection vulnerabilities
- Cross-Site Scripting (XSS)
- Hardcoded secrets and credentials
- Insecure deserialization
- Authentication/authorization flaws
- Infrastructure misconfigurations
- OWASP Top 10 vulnerabilities

## 📊 Example Vulnerable Code

Try analyzing this JavaScript code:

```javascript
const express = require('express');
const mysql = require('mysql');
const app = express();

const db_password = "admin123"; // Hardcoded password

app.get('/user/:id', (req, res) => {
    const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
    // SQL Injection vulnerability
    db.query(query, (err, results) => {
        res.send(results);
    });
});
```

## 🚀 Deployment

### Backend (Railway)

1. Create account at [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add `GEMINI_API_KEY` environment variable
4. Deploy automatically

### Frontend (Vercel)

1. Create account at [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [Google Gemini API](https://makersuite.google.com/app/apikey)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## 💡 Support

If you encounter issues or have questions:

1. Check the Issues section on GitHub
2. Review the API documentation at `http://127.0.0.1:8000/docs`
3. Ensure your Gemini API key is properly configured

---

**Built with ❤️ for the security community**