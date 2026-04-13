# ResumeIQ: AI-Powered Ethical Recruitment Platform

![ResumeIQ Banner](https://img.shields.io/badge/ResumeIQ-AI--Recruitment-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Node](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)
![Python](https://img.shields.io/badge/Python-ML-3776AB?style=for-the-badge&logo=python)

**ResumeIQ** is a state-of-the-art recruitment platform designed to eliminate cognitive bias and streamline the hiring process. By combining machine learning-based ATS ranking with an AI-driven technical interview system, ResumeIQ ensures that candidates are evaluated solely on their skills and potential.

---

## 🚀 Key Features

### 1. **ML-Driven ATS & Resume Ranking**
- **Automated Screening:** Uses TF-IDF vectorization and Random Forest models to rank resumes against specific job roles.
- **Skill Extraction:** Precisely identifies technical competencies and matches them to industry-standard requirements.
- **Efficiency:** Reduces initial screening time by over 80%.

### 2. **BiasGuard™: Ethical Hiring Engine**
- **Identity Neutralization:** Automatically detects and redacts gender, pedigree, and identity markers during the evaluation phase.
- **Fairness Scoring:** Calculates a unique "Fairness Score" to ensure evaluations focus on objective capability rather than background bias.

### 3. **Dynamic AI Technical Interview**
- **LLM Questioning:** Leverages the **Groq LLaMA-3** model to generate 5+ role-specific technical questions in real-time.
- **Self-Paced Assessment:** Standardized interview flow for candidates with automated scoring and transcript generation.

### 4. **XAI (Explainable AI) HR Dashboard**
- **Decision Transparency:** Provides detailed "Strengths & Weaknesses" reports for every candidate score.
- **HR Analytics:** Real-time visibility into the candidate pipeline, conversion rates, and skill distribution across the applicant pool.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React 19 (Vite)
- **Styling:** Modern Vanilla CSS with high-performance animations.
- **Routing:** React Router 7
- **UI Architecture:** Component-driven design for maximum reusability.

### **Backend**
- **Runtime:** Node.js (Express.js)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **AI Integration:** Groq SDK (LLM), PDF-parse (Resume extraction)
- **ML Layer:** Python (Scikit-Learn, pandas)

---

## ⚙️ Installation & Setup

### **Prerequisites**
- Node.js (v18+)
- Python (v3.9+)
- MongoDB Atlas Account
- Groq Cloud API Key

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/your-username/ResumeIQ.git
cd ResumeIQ
```

### **Step 2: Backend Setup**
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   ```
4. Install Python ML requirements:
   ```bash
   pip install pandas scikit-learn
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### **Step 3: Frontend Setup**
1. Navigate back to the root:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
ResumeIQ/
├── backend/
│   ├── ml/            # Python ML models & scripts (.pkl files)
│   ├── routes/        # API Endpoints (Candidate, HR, Interview)
│   ├── services/      # Business logic (BiasGuard, Evaluation)
│   ├── models/        # MongoDB schemas
│   └── server.js      # Main entry point
├── frontend/
│   ├── src/
│   │   ├── pages/     # Main views (Dashboard, Portal, Evaluator)
│   │   ├── assets/    # Visual assets
│   │   └── index.css  # Global styles
└── README.md
```

---

## ❤️ Our Commitment to Fairness
ResumeIQ is built on the belief that **talent is universal, but opportunity is not**. By leveraging AI responsibly, we aim to build a world where your next job is determined by your hard work and skill, not your name or where you went to school.

---

## 📄 License
Distributed under the ISC License. See `LICENSE` for more information.
