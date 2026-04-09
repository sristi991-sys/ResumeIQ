import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UploadCloud, CheckCircle2, XCircle, AlertCircle,
  Loader2, ChevronRight, Trophy, Star, TrendingUp,
  Zap, Shield, AlertTriangle, CheckCheck, Rocket,
  User, Mail, Phone, Link
} from 'lucide-react';

export default function CandidatePortal() {
  const [step, setStep] = useState(1);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');

  // Phase 2: Resume
  const [file, setFile] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeReport, setResumeReport] = useState(null);
  const [resumeError, setResumeError] = useState(null);

  // Phase 3.5: Candidate Info
  const [candidateInfo, setCandidateInfo] = useState({ name: '', email: '', phone: '', linkedin: '' });
  const [infoError, setInfoError] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [candidateId, setCandidateId] = useState(null);

  // Phase 4: Interview
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [qaLoading, setQaLoading] = useState(false);
  const [qaReport, setQaReport] = useState(null);
  const [qaError, setQaError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/roles')
      .then(res => {
        setRoles(res.data.data || []);
        if (res.data.data?.length > 0) setSelectedRole(res.data.data[0].title);
      })
      .catch(console.error);
  }, []);

  // ── Step 2: Resume Upload ──────────────────────────────────────────────────
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedRole) return setResumeError("Select a role and a PDF file.");
    setResumeLoading(true);
    setResumeError(null);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('role', selectedRole);
    try {
      const { data } = await axios.post('http://localhost:5000/api/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumeReport(data.report.evaluation);
      setStep(3);
    } catch (err) {
      setResumeError(err.response?.data?.error || "Resume evaluation failed. Ensure the PDF is readable.");
    } finally {
      setResumeLoading(false);
    }
  };

  // ── Step 3.5: Register Candidate Info ────────────────────────────────────
  const handleRegisterCandidate = async (e) => {
    e.preventDefault();
    const { name, email } = candidateInfo;
    if (!name.trim() || !email.trim()) return setInfoError("Name and Email are required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setInfoError("Please enter a valid email address.");
    setInfoLoading(true);
    setInfoError(null);
    try {
      const { data } = await axios.post('http://localhost:5000/api/candidates/register', {
        ...candidateInfo,
        role: selectedRole,
        atsScore: resumeReport?.scores?.finalScore ?? null,
        atsDecision: resumeReport?.decision ?? null,
      });
      setCandidateId(data.candidateId);
      // Now generate interview questions
      const qRes = await axios.post('http://localhost:5000/api/questions', { role: selectedRole });
      setQuestions(qRes.data.data);
      setStep(4);
    } catch (err) {
      setInfoError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setInfoLoading(false);
    }
  };

  // ── Step 4: Submit Interview ──────────────────────────────────────────────
  const handleSubmitInterview = async () => {
    const qaPayload = questions.map((q, idx) => ({
      question: q.question,
      answer: answers[idx] || "No answer provided."
    }));
    setQaLoading(true);
    setQaError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/submitAnswer', {
        role: selectedRole,
        qa: qaPayload,
        candidateId,   // link answers to the registered candidate
      });
      setQaReport(response.data.report || response.data);
      setStep(5);
    } catch (err) {
      setQaError("Submission failed. Please try again.");
    } finally {
      setQaLoading(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const decisionColor = (d) => {
    if (d === 'Selected') return 'var(--success-color)';
    if (d === 'Borderline') return '#fbbf24';
    return 'var(--danger-color)';
  };

  const trackerSteps = [
    { label: '1. Select Role', active: step >= 1, current: step === 1 },
    { label: '2. ATS Screening', active: step >= 2, current: step === 2 },
    { label: '3. ATS Result', active: step >= 3, current: step === 3 },
    { label: '4. Your Details', active: step >= 3.5, current: step === 3.5 },
    { label: '5. Tech Interview', active: step >= 4, current: step === 4 },
    { label: '6. Final Review', active: step >= 5, current: step === 5 },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.5s ease-out' }}>
      <h1 className="outfit-font" style={{ fontSize: '3rem', marginBottom: '40px' }}>Application Portal</h1>

      {/* Step Tracker */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginBottom: '40px',
        padding: '16px 20px', background: 'rgba(0,0,0,0.3)', borderRadius: '14px',
        border: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '8px'
      }}>
        {trackerSteps.map((s, i) => (
          <span key={i} style={{
            color: s.active ? 'var(--accent-color)' : 'rgba(255,255,255,0.3)',
            fontWeight: s.current ? '700' : '400',
            fontSize: s.current ? '0.9rem' : '0.8rem',
            transition: 'all 0.3s',
            borderBottom: s.current ? '2px solid var(--accent-color)' : '2px solid transparent',
            paddingBottom: '4px'
          }}>{s.label}</span>
        ))}
      </div>

      {/* ── STEP 1: Select Role ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="glass-panel" style={{ padding: '40px', animation: 'fadeIn 0.4s ease-out' }}>
          <h2 className="outfit-font" style={{ marginBottom: '24px' }}>Select Target Role</h2>
          {roles.length === 0 ? (
            <p style={{ color: 'var(--danger-color)', padding: '20px', background: 'rgba(244,63,94,0.1)', borderRadius: '10px', border: '1px solid var(--danger-color)' }}>
              ⚠️ No active roles found. HR needs to open requisitions first.
            </p>
          ) : (
            <>
              <select className="input-base" value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)} style={{ marginBottom: '32px' }}>
                {roles.map((r, i) => (
                  <option key={i} value={r.title} style={{ color: '#000' }}>{r.title}</option>
                ))}
              </select>
              <button onClick={() => setStep(2)} className="btn btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
                Proceed to Resume Upload <ChevronRight size={18} style={{ verticalAlign: 'middle' }} />
              </button>
            </>
          )}
        </div>
      )}

      {/* ── STEP 2: Upload Resume ───────────────────────────────────────────── */}
      {step === 2 && (
        <div className="glass-panel" style={{ padding: '40px', animation: 'fadeIn 0.4s ease-out' }}>
          <h2 className="outfit-font" style={{ marginBottom: '8px' }}>Upload Your Resume</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Target Role: <strong style={{ color: 'white' }}>{selectedRole}</strong>
          </p>
          <form onSubmit={handleResumeUpload}>
            <div onClick={() => document.getElementById('file-upload-portal').click()} style={{
              border: '2px dashed var(--border-strong)', borderRadius: '16px',
              padding: '48px 24px', textAlign: 'center', background: 'rgba(0,0,0,0.3)',
              cursor: 'pointer', marginBottom: '24px', transition: 'all 0.3s'
            }}>
              <UploadCloud size={56} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
              <h3 className="outfit-font" style={{ marginBottom: '8px' }}>
                {file ? `✅ ${file.name}` : 'Click to select PDF'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Only PDF files accepted</p>
              <input id="file-upload-portal" type="file" accept="application/pdf"
                style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} />
            </div>
            {resumeError && (
              <div style={{ color: '#fca5a5', marginBottom: '16px', padding: '12px 16px', background: 'rgba(244,63,94,0.1)', borderRadius: '10px', border: '1px solid var(--danger-color)' }}>
                ⚠️ {resumeError}
              </div>
            )}
            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }} disabled={resumeLoading}>
              {resumeLoading
                ? <><Loader2 className="lucide-spin" size={18} /> Analyzing Resume...</>
                : 'Run ATS Screening'}
            </button>
          </form>
        </div>
      )}

      {/* ── STEP 3: ATS Result — 5 Card UI ─────────────────────────────────── */}
      {step === 3 && resumeReport && (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>

          {/* Card 1: Result Header */}
          <div style={{
            padding: '32px', borderRadius: '20px', marginBottom: '20px',
            background: resumeReport.decision === 'Selected'
              ? 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)'
              : resumeReport.decision === 'Borderline'
              ? 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.05) 100%)'
              : 'linear-gradient(135deg, rgba(244,63,94,0.15) 0%, rgba(244,63,94,0.05) 100%)',
            border: `1px solid ${decisionColor(resumeReport.decision)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {resumeReport.decision === 'Selected'
                ? <CheckCircle2 size={44} color="var(--success-color)" />
                : resumeReport.decision === 'Borderline'
                ? <AlertCircle size={44} color="#fbbf24" />
                : <XCircle size={44} color="var(--danger-color)" />}
              <div>
                <h2 className="outfit-font" style={{ fontSize: '2.2rem', color: decisionColor(resumeReport.decision), margin: 0 }}>
                  {resumeReport.decision === 'Selected' ? '🎉 Shortlisted!' : resumeReport.decision === 'Borderline' ? '⚠️ Borderline' : '❌ Not Shortlisted'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  Role: <strong style={{ color: 'white' }}>{selectedRole}</strong> &nbsp;•&nbsp;
                  Level: <strong style={{ color: 'white' }}>{resumeReport.experienceLevel || 'N/A'}</strong>
                </p>
              </div>
            </div>
            <div style={{
              width: '110px', height: '110px', borderRadius: '50%',
              background: `conic-gradient(${decisionColor(resumeReport.decision)} ${resumeReport.scores?.finalScore || 0}%, rgba(255,255,255,0.05) 0)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 24px ${decisionColor(resumeReport.decision)}44`
            }}>
              <div style={{
                width: '86px', height: '86px', borderRadius: '50%', background: 'var(--bg-primary)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', lineHeight: 1 }}>{resumeReport.scores?.finalScore ?? '--'}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>/ 100</span>
              </div>
            </div>
          </div>

          {/* Card 2: Score Breakdown */}
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '20px' }}>
            <h3 className="outfit-font" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
              <Star size={22} color="#fbbf24" /> 🟡 Score & Fairness
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px' }}>
              {[
                { label: 'ATS Score', value: `${resumeReport.scores?.finalScore ?? '--'}/100`, color: decisionColor(resumeReport.decision) },
                { label: 'Skill Match', value: `${resumeReport.scores?.skillMatch ?? '--'}%`, color: 'var(--accent-color)' },
                { label: 'Fairness Score', value: resumeReport.fairnessScore != null ? Number(resumeReport.fairnessScore).toFixed(2) : '1.00', color: '#10b981' },
                { label: 'Bias Adjusted', value: resumeReport.biasAdjusted ? '✅ Yes' : '❌ No', color: resumeReport.biasAdjusted ? '#10b981' : '#f43f5e' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '14px', padding: '18px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: '800', color: item.color, margin: 0 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Strengths */}
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '20px', borderLeft: '4px solid var(--success-color)' }}>
            <h3 className="outfit-font" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--success-color)', fontSize: '1.2rem' }}>
              <Shield size={22} /> 💪 Strengths
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(resumeReport.strengths?.length > 0 ? resumeReport.strengths : ['No specific strengths detected.']).map((s, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#d1fae5', lineHeight: '1.6' }}>
                  <CheckCheck size={16} color="var(--success-color)" style={{ marginTop: '4px', flexShrink: 0 }} /> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Card 4: Weaknesses */}
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '20px', borderLeft: '4px solid var(--danger-color)' }}>
            <h3 className="outfit-font" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--danger-color)', fontSize: '1.2rem' }}>
              <AlertTriangle size={22} /> ⚠️ Weaknesses
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(resumeReport.weaknesses?.length > 0 ? resumeReport.weaknesses : ['No major weaknesses found.']).map((w, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#fecaca', lineHeight: '1.6' }}>
                  <XCircle size={16} color="var(--danger-color)" style={{ marginTop: '4px', flexShrink: 0 }} /> {w}
                </li>
              ))}
            </ul>
          </div>

          {/* Card 5: Improvements */}
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px', borderLeft: '4px solid #a855f7' }}>
            <h3 className="outfit-font" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#a855f7', fontSize: '1.2rem' }}>
              <Rocket size={22} /> 🚀 Improvements
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(resumeReport.improvements?.length > 0 ? resumeReport.improvements : ['Keep up the great work!']).map((imp, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)',
                  borderRadius: '12px', padding: '14px 16px', color: '#e9d5ff', lineHeight: '1.6'
                }}>
                  <Zap size={16} color="#a855f7" style={{ marginTop: '4px', flexShrink: 0 }} /> {imp}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA → Enter Details */}
          <button onClick={() => setStep(3.5)} className="btn btn-primary"
            style={{ width: '100%', padding: '18px', fontSize: '1.15rem' }}>
            Continue — Enter Your Details <ChevronRight size={18} style={{ verticalAlign: 'middle' }} />
          </button>
        </div>
      )}

      {/* ── STEP 3.5: Candidate Personal Info Form ─────────────────────────── */}
      {step === 3.5 && (
        <div className="glass-panel" style={{ padding: '40px', animation: 'fadeIn 0.4s ease-out' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h2 className="outfit-font" style={{ fontSize: '2rem', marginBottom: '8px' }}>👤 Your Details</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Fill in your contact information. This will be shared with the HR team along with your ATS score
              (<strong style={{ color: decisionColor(resumeReport?.decision) }}>{resumeReport?.decision}</strong> — {resumeReport?.scores?.finalScore}/100).
            </p>
          </div>

          {/* ATS Summary Banner */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px 20px',
            border: `1px solid ${decisionColor(resumeReport?.decision)}33`, marginBottom: '32px', flexWrap: 'wrap', gap: '10px'
          }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Role Applied: <strong style={{ color: 'white' }}>{selectedRole}</strong>
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              ATS Score: <strong style={{ color: decisionColor(resumeReport?.decision) }}>{resumeReport?.scores?.finalScore}/100</strong>
            </span>
            <span style={{
              background: `${decisionColor(resumeReport?.decision)}22`,
              color: decisionColor(resumeReport?.decision),
              padding: '4px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700',
              border: `1px solid ${decisionColor(resumeReport?.decision)}44`
            }}>{resumeReport?.decision}</span>
          </div>

          <form onSubmit={handleRegisterCandidate}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Name */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <User size={16} /> Full Name <span style={{ color: 'var(--danger-color)' }}>*</span>
                </label>
                <input type="text" className="input-base"
                  placeholder="e.g. Shreya Sharma"
                  value={candidateInfo.name}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, name: e.target.value })}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <Mail size={16} /> Email Address <span style={{ color: 'var(--danger-color)' }}>*</span>
                </label>
                <input type="email" className="input-base"
                  placeholder="e.g. shreya@gmail.com"
                  value={candidateInfo.email}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, email: e.target.value })}
                  required
                />
              </div>

              {/* Phone + LinkedIn side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <Phone size={16} /> Phone Number
                  </label>
                  <input type="tel" className="input-base"
                    placeholder="e.g. +91 9876543210"
                    value={candidateInfo.phone}
                    onChange={(e) => setCandidateInfo({ ...candidateInfo, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <Link size={16} /> LinkedIn URL
                  </label>
                  <input type="url" className="input-base"
                    placeholder="e.g. linkedin.com/in/shreya"
                    value={candidateInfo.linkedin}
                    onChange={(e) => setCandidateInfo({ ...candidateInfo, linkedin: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {infoError && (
              <div style={{ marginTop: '20px', padding: '12px 16px', background: 'rgba(244,63,94,0.1)', border: '1px solid var(--danger-color)', borderRadius: '10px', color: '#fca5a5' }}>
                ⚠️ {infoError}
              </div>
            )}

            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', padding: '18px', fontSize: '1.15rem', marginTop: '32px' }}
              disabled={infoLoading}>
              {infoLoading
                ? <><Loader2 className="lucide-spin" size={18} /> Saving & Generating Questions...</>
                : <>Save & Proceed to Tech Interview <ChevronRight size={18} style={{ verticalAlign: 'middle' }} /></>}
            </button>
          </form>
        </div>
      )}

      {/* ── STEP 4: Tech Interview ──────────────────────────────────────────── */}
      {step === 4 && (
        <div className="glass-panel" style={{ padding: '40px', animation: 'fadeIn 0.4s ease-out' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 className="outfit-font" style={{ fontSize: '2rem', marginBottom: '8px' }}>🧠 Tech Interview</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Role: <strong style={{ color: 'white' }}>{selectedRole}</strong> &nbsp;•&nbsp;
              {questions.length} AI-generated questions — answer all for best evaluation
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
            {questions.map((q, idx) => (
              <div key={idx} style={{
                background: 'rgba(0,0,0,0.35)', padding: '28px', borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                borderLeft: `4px solid ${q.difficulty === 'Hard' ? 'var(--danger-color)' : q.difficulty === 'Medium' ? '#fbbf24' : 'var(--success-color)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--accent-color)', fontWeight: '800', background: 'rgba(59,130,246,0.15)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.9rem' }}>Q{idx + 1}</span>
                  {q.skill && (
                    <span style={{ background: 'rgba(168,85,247,0.15)', color: '#c4b5fd', borderRadius: '6px', padding: '3px 10px', fontSize: '0.8rem', fontWeight: '600' }}>🔧 {q.skill}</span>
                  )}
                  {q.difficulty && (
                    <span style={{
                      background: q.difficulty === 'Hard' ? 'rgba(244,63,94,0.15)' : q.difficulty === 'Medium' ? 'rgba(251,191,36,0.15)' : 'rgba(16,185,129,0.15)',
                      color: q.difficulty === 'Hard' ? '#fca5a5' : q.difficulty === 'Medium' ? '#fde68a' : '#6ee7b7',
                      borderRadius: '6px', padding: '3px 10px', fontSize: '0.8rem', fontWeight: '600'
                    }}>{q.difficulty === 'Hard' ? '🔴' : q.difficulty === 'Medium' ? '🟡' : '🟢'} {q.difficulty}</span>
                  )}
                </div>
                <h3 style={{ marginBottom: '16px', lineHeight: '1.7', fontSize: '1.05rem', color: 'white' }}>{q.question}</h3>
                <textarea className="input-base"
                  placeholder="Type your detailed answer here... The AI will evaluate clarity, depth, and technical accuracy."
                  value={answers[idx] || ''}
                  onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                  style={{ minHeight: '130px' }}
                />
              </div>
            ))}
          </div>

          {qaError && (
            <div style={{ padding: '14px', background: 'rgba(244,63,94,0.1)', border: '1px solid var(--danger-color)', borderRadius: '10px', color: '#fca5a5', marginBottom: '16px' }}>
              ⚠️ {qaError}
            </div>
          )}

          <button onClick={handleSubmitInterview} className="btn btn-primary"
            style={{ width: '100%', padding: '18px', fontSize: '1.15rem' }} disabled={qaLoading}>
            {qaLoading
              ? <><Loader2 className="lucide-spin" size={18} /> Evaluating Answers...</>
              : <>Submit Interview Answers <ChevronRight size={18} style={{ verticalAlign: 'middle' }} /></>}
          </button>
        </div>
      )}

      {/* ── STEP 5: Final Review ────────────────────────────────────────────── */}
      {step === 5 && qaReport && (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>

          <div className="glass-panel" style={{ padding: '36px', marginBottom: '24px', textAlign: 'center', borderTop: '4px solid var(--success-color)' }}>
            <CheckCircle2 size={72} color="var(--success-color)" style={{ margin: '0 auto 20px' }} />
            <h1 className="outfit-font" style={{ fontSize: '2.8rem', marginBottom: '10px' }}>Application Submitted! 🎉</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '8px' }}>
              Hey <strong style={{ color: 'white' }}>{candidateInfo.name || 'Candidate'}</strong> — your profile has been sent to HR!
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Confirmation sent to: <strong style={{ color: 'var(--accent-color)' }}>{candidateInfo.email}</strong>
            </p>
          </div>

          {/* Combined Score Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'ATS Resume Score', value: `${resumeReport?.scores?.finalScore ?? '--'}/100`, icon: <Trophy size={24} color="#fbbf24" />, color: '#fbbf24' },
              { label: 'Interview Score', value: `${qaReport.finalScore ?? '--'}/10`, icon: <Star size={24} color="var(--accent-color)" />, color: 'var(--accent-color)' },
              { label: 'ATS Decision', value: resumeReport?.decision ?? '--', icon: <Shield size={24} color={decisionColor(resumeReport?.decision)} />, color: decisionColor(resumeReport?.decision) },
            ].map((card, i) => (
              <div key={i} className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ marginBottom: '10px' }}>{card.icon}</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{card.label}</p>
                <p style={{ fontSize: '1.7rem', fontWeight: '900', color: card.color, margin: 0 }}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Interview Metrics */}
          {(qaReport.clarity || qaReport.reasoning) && (
            <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
              <h3 className="outfit-font" style={{ marginBottom: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={22} color="var(--accent-color)" /> Interview Metrics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '14px' }}>
                {[
                  { label: 'Clarity', value: `${qaReport.clarity ?? '--'}/10` },
                  { label: 'Reasoning', value: `${qaReport.reasoning ?? '--'}/10` },
                  { label: 'Overall', value: `${qaReport.overallScore ?? '--'}%` },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>{m.label}</p>
                    <p style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-color)', margin: 0 }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Per-Question Feedback */}
          {qaReport.detailedFeedback?.length > 0 && (
            <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
              <h3 className="outfit-font" style={{ marginBottom: '24px', fontSize: '1.2rem' }}>🔍 Question-by-Question Feedback</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {qaReport.detailedFeedback.map((fb, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-panel)', padding: '20px', borderRadius: '14px',
                    border: '1px solid var(--border-subtle)',
                    borderLeft: `6px solid ${fb.score > 7 ? 'var(--success-color)' : fb.score > 4 ? '#fbbf24' : 'var(--danger-color)'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <p style={{ fontWeight: 600, color: 'white', maxWidth: '80%', lineHeight: '1.5', margin: 0 }}>
                        <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>Q:</span>{fb.question}
                      </p>
                      <span style={{
                        background: fb.score > 7 ? 'rgba(16,185,129,0.2)' : fb.score > 4 ? 'rgba(251,191,36,0.2)' : 'rgba(244,63,94,0.2)',
                        color: fb.score > 7 ? 'var(--success-color)' : fb.score > 4 ? '#fbbf24' : 'var(--danger-color)',
                        padding: '4px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '700', whiteSpace: 'nowrap'
                      }}>{fb.score}/10</span>
                    </div>
                    <p style={{ color: '#d1d5db', margin: '0 0 10px', fontStyle: 'italic', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontStyle: 'normal' }}>Your answer: </span>{answers[i] || '(no answer)'}
                    </p>
                    <div style={{ background: 'rgba(59,130,246,0.08)', padding: '12px 16px', borderRadius: '8px', borderLeft: '2px solid var(--accent-color)', color: '#e5e7eb', fontSize: '0.95rem' }}>
                      <AlertTriangle size={14} style={{ verticalAlign: 'text-bottom', marginRight: '8px' }} color="var(--accent-color)" />
                      {fb.feedback}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvements */}
          {qaReport.improvements?.length > 0 && (
            <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px', borderLeft: '4px solid #a855f7' }}>
              <h3 className="outfit-font" style={{ marginBottom: '16px', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                <Rocket size={22} /> 🚀 What to Improve
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {qaReport.improvements.map((imp, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', color: '#e9d5ff', lineHeight: '1.6', background: 'rgba(168,85,247,0.08)', padding: '12px 16px', borderRadius: '10px' }}>
                    <Zap size={14} color="#a855f7" style={{ marginTop: '5px', flexShrink: 0 }} /> {imp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={() => {
            setStep(1); setFile(null); setResumeReport(null);
            setQaReport(null); setQuestions([]); setAnswers({});
            setCandidateInfo({ name: '', email: '', phone: '', linkedin: '' });
            setCandidateId(null);
          }} className="btn btn-secondary" style={{ width: '100%', padding: '16px', fontSize: '1.05rem' }}>
            Start New Application
          </button>
        </div>
      )}
    </div>
  );
}
