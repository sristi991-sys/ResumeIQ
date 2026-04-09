import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle, CodeSquare, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TestKnowledge() {
  const [role, setRole] = useState('Software Engineer');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!role) return setError("Role is required.");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/questions', { role });
      setQuestions(response.data.data); 
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, val) => {
    setAnswers(prev => ({ ...prev, [index]: val }));
  };

  const handleSubmitAnswers = async () => {
    const qaPayload = questions.map((q, idx) => ({
      question: q.question, 
      answer: answers[idx] || "I don't know."
    }));

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/submitAnswer', { role, qa: qaPayload });
      setReport(response.data.report || response.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: '900px', margin: '0 auto', width: '100%', position: 'relative' }}
    >
      <div style={{ position: 'absolute', top: -50, right: '10%', width: 300, height: 300, background: 'var(--glow-secondary)', filter: 'blur(120px)', borderRadius: '50%', zIndex: -1, opacity: 0.3 }}></div>

      <h1 className="outfit-font" style={{ fontSize: '3rem', marginBottom: '16px' }}>AI Knowledge Interview</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '48px', fontSize: '1.15rem' }}>
        Dynamic interview simulation strictly paired with our advanced neural evaluation endpoints.
      </p>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '16px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--danger-color)', color: '#fca5a5', borderRadius: '12px', marginBottom: '24px' }}>
          {error}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel" 
            style={{ padding: '48px' }}
          >
             <div style={{ marginBottom: '32px' }}>
               <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Focus Domain / Job Trajectory</label>
               <input 
                 type="text" 
                 className="input-base" 
                 value={role} 
                 onChange={e => setRole(e.target.value)}
                 placeholder="e.g. Distributed Systems Engineer"
               />
             </div>
             
             <button onClick={handleGenerate} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.2rem' }} disabled={loading}>
               {loading ? <><Loader2 className="lucide-spin" /> Firing Inference Nodes...</> : "Generate AI Interview"}
             </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: 'var(--bg-panel)', borderRadius: '16px', border: '1px solid var(--border-strong)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <span className="outfit-font" style={{ fontSize: '1.2rem' }}><CodeSquare size={20} style={{ verticalAlign: 'middle', marginRight: '10px' }} color="var(--accent-color)" /> Evaluating Domain: <strong style={{ color: 'white' }}>{role}</strong></span>
              <span style={{ fontSize: '0.9rem', color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={16} /> Locked to Model State</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              {questions.map((q, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel" 
                  style={{ padding: '32px' }}
                >
                  <h3 className="outfit-font" style={{ marginBottom: '20px', fontSize: '1.3rem', lineHeight: '1.5' }}>
                    <span style={{ color: 'var(--accent-color)', marginRight: '12px' }}>0{idx + 1}</span>
                    {q.question}
                  </h3>
                  <textarea 
                    className="input-base" 
                    placeholder="Provide a comprehensive technical response..." 
                    value={answers[idx] || ''}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  />
                </motion.div>
              ))}
            </div>

            <button onClick={handleSubmitAnswers} className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.2rem' }} disabled={loading}>
              {loading ? <><Loader2 className="lucide-spin" /> Cross-Validating Semantics...</> : "Submit for AI Evaluation"}
            </button>
          </motion.div>
        )}

        {step === 3 && report && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel" 
            style={{ padding: '48px', position: 'relative' }}
          >
             <h2 className="outfit-font" style={{ fontSize: '2.5rem', marginBottom: '12px', background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Assessment Completed</h2>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>The Neural AI engine has dynamically evaluated your inputs against the generated problems.</p>

             <div style={{ display: 'flex', gap: '24px', marginBottom: '48px' }}>
               <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', padding: '24px', borderRadius: '16px', flex: 1, border: '1px solid var(--border-strong)', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                 <h4 className="outfit-font" style={{ color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.85rem' }}>Aptitude Score</h4>
                 <span style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white' }}>{report.finalScore || 'N/A'}<span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.3)' }}>/100</span></span>
               </div>
               <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', padding: '24px', borderRadius: '16px', flex: 1, border: '1px solid var(--border-strong)', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                 <h4 className="outfit-font" style={{ color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.85rem' }}>Clarity Metric</h4>
                 <span style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white' }}>{report.clarity || 'N/A'}<span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.3)' }}>/10</span></span>
               </div>
               <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', padding: '24px', borderRadius: '16px', flex: 1, border: '1px solid var(--border-strong)', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                 <h4 className="outfit-font" style={{ color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.85rem' }}>Reasoning Depth</h4>
                 <span style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white' }}>{report.reasoning || 'N/A'}<span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.3)' }}>/10</span></span>
               </div>
             </div>

             <div style={{ marginBottom: '40px' }}>
               <h3 className="outfit-font" style={{ marginBottom: '24px', fontSize: '1.4rem' }}>Semantic Trace Analysis</h3>
               {report.detailedFeedback?.map((fb, i) => (
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   key={i} 
                   style={{ background: 'var(--bg-panel)', padding: '24px', borderRadius: '16px', marginBottom: '20px', border: '1px solid var(--border-subtle)', borderLeft: `8px solid ${fb.score > 7 ? 'var(--success-color)' : fb.score > 4 ? '#fbbf24' : 'var(--danger-color)'}` }}
                 >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
                      <p className="outfit-font" style={{ fontWeight: 600, color: 'white', maxWidth: '80%', fontSize: '1.1rem', lineHeight: '1.5' }}><span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>Q:</span> {fb.question}</p>
                      <span style={{ background: 'rgba(0,0,0,0.6)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)' }}>Score: {fb.score}/10</span>
                    </div>
                    <p style={{ color: '#d1d5db', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', marginBottom: '16px', fontStyle: 'italic' }}>
                      <span style={{ color: 'var(--text-secondary)', marginRight: '8px', fontStyle: 'normal' }}>Ans:</span> {answers[i]}
                    </p>
                    <div style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.1) 0%, transparent 100%)', padding: '16px', borderRadius: '8px', color: '#e5e7eb', borderLeft: '2px solid var(--accent-color)' }}>
                      <AlertTriangle size={18} style={{ verticalAlign: 'text-bottom', marginRight: '10px' }} color="var(--accent-color)" />
                      {fb.feedback}
                    </div>
                 </motion.div>
               ))}
             </div>

             <button onClick={() => { setStep(1); setQuestions([]); setAnswers({}); setReport(null); setRole(''); }} className="btn btn-secondary" style={{ width: '100%', padding: '16px' }}>Begin New Evaluation <ChevronRight style={{ verticalAlign: 'middle' }} size={20}/></button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
