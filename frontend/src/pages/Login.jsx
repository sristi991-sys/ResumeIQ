import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel"
      style={{ maxWidth: '500px', margin: '140px auto', padding: '48px', textAlign: 'center' }}
    >
      <h1 className="outfit-font" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Portal Access</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Select your centralized environment</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/candidate')}
          style={{ padding: '24px', justifyContent: 'space-between', display: 'flex' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <User color="var(--accent-color)" />
             <span style={{ fontSize: '1.2rem' }}>Candidate Gateway</span>
          </div>
          <ChevronRight />
        </button>

        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/hr')}
          style={{ padding: '24px', justifyContent: 'space-between', display: 'flex' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <Briefcase color="var(--success-color)" />
             <span style={{ fontSize: '1.2rem' }}>HR Dashboard</span>
          </div>
          <ChevronRight />
        </button>
      </div>
    </motion.div>
  );
}
