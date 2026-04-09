import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, FileCheck2, MoveRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '40px' }}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ padding: '8px 20px', background: 'var(--bg-panel)', border: '1px solid var(--border-strong)', borderRadius: '30px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
      >
        <Sparkles size={16} color="#8b5cf6" />
        <span style={{ fontSize: '0.9rem', color: '#e4e4e7', fontWeight: '500' }}>Next-Gen ML & AI Evaluation Platform</span>
      </motion.div>
      
      <h1 className="outfit-font" style={{ fontSize: '4.5rem', marginBottom: '24px', maxWidth: '850px', lineHeight: '1.05' }}>
        Assess Engineering Talent with <br/>
        <span className="gradient-text animate-float" style={{ display: 'inline-block', marginTop: '8px' }}>Unprecedented Precision.</span>
      </h1>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '650px', marginBottom: '70px', fontWeight: '400' }}>
        The ultimate applicant tracking system. Parse, score, and evaluate candidates automatically using state-of-the-art offline Machine Learning pipelines.
      </p>

      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', width: '100%', maxWidth: '1000px' }}>
        
        {/* ML Evaluator Card */}
        <motion.div 
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="glass-panel" 
          style={{ flex: '1', textAlign: 'left', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} 
          onClick={() => navigate('/evaluator')}
        >
          <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'var(--glow-primary)', filter: 'blur(60px)', borderRadius: '50%', zIndex: 0 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.3)', padding: '16px', borderRadius: '16px', display: 'inline-flex', marginBottom: '24px' }}>
              <FileCheck2 size={32} color="#60a5fa" />
            </div>
            <h2 className="outfit-font" style={{ fontSize: '2rem', marginBottom: '16px' }}>ML Résumé Screening</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Upload a candidate PDF. Our strict offline NLP pipeline extracts metrics, architecture skills, and calculates FAANG-level viability.
            </p>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between', fontSize: '1.1rem' }}>
              Launch Evaluator <MoveRight size={20} />
            </button>
          </div>
        </motion.div>

        {/* AI Knowledge Check Card */}
        <motion.div 
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="glass-panel" 
          style={{ flex: '1', textAlign: 'left', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} 
          onClick={() => navigate('/test')}
        >
          <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'rgba(16, 185, 129, 0.15)', filter: 'blur(60px)', borderRadius: '50%', zIndex: 0 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.3)', padding: '16px', borderRadius: '16px', display: 'inline-flex', marginBottom: '24px' }}>
              <Bot size={32} color="#34d399" />
            </div>
            <h2 className="outfit-font" style={{ fontSize: '2rem', marginBottom: '16px' }}>AI Knowledge Test</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Dynamically generate domain-specific questions. Candidate answers are mapped and evaluated strictly against generated contexts.
            </p>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between', fontSize: '1.1rem' }}>
              Start Interview <MoveRight size={20} />
            </button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
