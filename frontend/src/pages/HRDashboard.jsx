import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Trash2, Users, Target, CheckCircle2, AlertCircle, Loader2, BriefcaseBusiness, RefreshCw, Mail, Phone } from 'lucide-react';

export default function HRDashboard() {
  const [roles, setRoles] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [newRole, setNewRole] = useState({ title: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [stats, setStats] = useState({ total: '--', selected: '--' });
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchCandidates();
    fetchStats();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/roles');
      setRoles(res.data.data || []);
    } catch (e) {
      setError('Could not load roles. Is the backend running?');
    }
  };

  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/candidates');
      setCandidates(res.data.data || []);
    } catch (e) {
      // fail silently
    } finally {
      setLoadingCandidates(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/stats');
      setStats({ total: res.data.totalCandidates, selected: res.data.selected });
    } catch (e) {}
  };

  const showSuccess = (msg) => {
    setSuccess(msg); setError(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRole.title.trim()) return setError('Role title cannot be empty.');
    setCreating(true); setError(null);
    try {
      await axios.post('http://localhost:5000/api/roles', { title: newRole.title.trim(), description: newRole.description.trim() });
      setNewRole({ title: '', description: '' });
      await fetchRoles();
      showSuccess(`✅ Role "${newRole.title.trim()}" added!`);
    } catch (e) {
      setError(`❌ ${e.response?.data?.error || e.message || 'Failed to create role.'}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteRole = async (title) => {
    setDeleting(title); setError(null);
    try {
      await axios.delete(`http://localhost:5000/api/roles/${encodeURIComponent(title)}`);
      await fetchRoles();
      showSuccess(`🗑️ Role "${title}" removed.`);
    } catch (e) {
      setError('Failed to delete role.');
    } finally {
      setDeleting(null);
    }
  };

  const decisionColor = (d) => {
    if (d === 'Selected') return 'var(--success-color)';
    if (d === 'Borderline') return '#fbbf24';
    if (d === 'Rejected') return 'var(--danger-color)';
    return 'var(--text-secondary)';
  };

  const decisionBg = (d) => {
    if (d === 'Selected') return 'rgba(16,185,129,0.15)';
    if (d === 'Borderline') return 'rgba(251,191,36,0.15)';
    if (d === 'Rejected') return 'rgba(244,63,94,0.15)';
    return 'rgba(255,255,255,0.05)';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <h1 className="outfit-font" style={{ fontSize: '3rem', marginBottom: '12px' }}>HR Pipeline Console</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>
        Manage open roles and monitor candidate pipeline in real time.
      </p>

      {/* Toasts */}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '14px 20px', background: 'rgba(244,63,94,0.12)', border: '1px solid var(--danger-color)', borderRadius: '12px', color: '#fca5a5', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={18} /> {error}
        </motion.div>
      )}
      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '14px 20px', background: 'rgba(16,185,129,0.12)', border: '1px solid var(--success-color)', borderRadius: '12px', color: '#6ee7b7', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} /> {success}
        </motion.div>
      )}

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Total Applicants', value: candidates.length > 0 ? candidates.length : stats.total, icon: <Users size={26} color="var(--accent-color)" />, bg: 'rgba(59,130,246,0.12)' },
          { label: 'Shortlisted', value: candidates.filter(c => c.atsDecision === 'Selected').length > 0 ? candidates.filter(c => c.atsDecision === 'Selected').length : stats.selected, icon: <Target size={26} color="var(--success-color)" />, bg: 'rgba(16,185,129,0.12)' },
          { label: 'Open Roles', value: roles.length, icon: <BriefcaseBusiness size={26} color="#a855f7" />, bg: 'rgba(168,85,247,0.12)' },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ flex: 1, padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
            <div>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 4px', fontSize: '0.85rem' }}>{s.label}</p>
              <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

        {/* Left: Role Management */}
        <div className="glass-panel" style={{ flexShrink: 0, width: '300px', padding: '28px' }}>
          <h2 className="outfit-font" style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BriefcaseBusiness size={20} /> Open Roles
          </h2>
          <form onSubmit={handleCreateRole} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" className="input-base" placeholder="e.g. Full Stack Dev"
                value={newRole.title} onChange={(e) => setNewRole({ ...newRole, title: e.target.value })} style={{ flex: 1, padding: '10px 14px' }} />
              <button className="btn btn-primary" type="submit" disabled={creating}
                style={{ padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {creating ? <Loader2 className="lucide-spin" size={16} /> : <Plus size={16} />}
              </button>
            </div>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {roles.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '16px', fontSize: '0.85rem' }}>No active roles yet.</p>
            ) : roles.map((r) => (
              <div key={r.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: '10px', borderLeft: '3px solid var(--accent-color)' }}>
                <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{r.title}</span>
                <button onClick={() => handleDeleteRole(r.title)} disabled={deleting === r.title}
                  style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '4px' }}>
                  {deleting === r.title ? <Loader2 className="lucide-spin" size={15} /> : <Trash2 size={15} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Candidate Queue */}
        <div className="glass-panel" style={{ flex: 1, padding: '28px', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="outfit-font" style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <Users size={20} /> Candidate Queue
            </h2>
            <button onClick={fetchCandidates} disabled={loadingCandidates}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '7px 14px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
              <RefreshCw size={13} className={loadingCandidates ? 'lucide-spin' : ''} /> Refresh
            </button>
          </div>

          {loadingCandidates ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              <Loader2 size={28} className="lucide-spin" style={{ margin: '0 auto 10px', display: 'block' }} />
              Loading candidates...
            </div>
          ) : candidates.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--border-subtle)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
              <Users size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
              <p style={{ margin: 0, lineHeight: '1.6', fontSize: '0.9rem' }}>
                No candidates yet. Applicants will appear here after they complete the portal flow.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {candidates.map((c, i) => (
                <motion.div key={c._id || i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '12px', padding: '14px 18px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>

                  {/* Identity */}
                  <div style={{ flex: 1, minWidth: '140px' }}>
                    <p style={{ fontWeight: '700', fontSize: '0.95rem', margin: '0 0 4px', color: 'white' }}>
                      {c.name || c.anonId || 'Anonymous'}
                    </p>
                    {c.email && (
                      <p style={{ margin: '0 0 2px', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={11} /> {c.email}
                      </p>
                    )}
                    {c.phone && (
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={11} /> {c.phone}
                      </p>
                    )}
                  </div>

                  {/* Role */}
                  <div style={{ textAlign: 'center', minWidth: '90px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '3px' }}>Role</p>
                    <p style={{ fontWeight: '600', fontSize: '0.85rem', margin: 0, color: 'var(--accent-color)' }}>{c.role}</p>
                  </div>

                  {/* ATS Score */}
                  <div style={{ textAlign: 'center', minWidth: '70px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '3px' }}>ATS</p>
                    <p style={{ fontWeight: '800', fontSize: '1.2rem', margin: 0 }}>
                      {c.atsScore ?? '--'}<span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>/100</span>
                    </p>
                  </div>

                  {/* Decision */}
                  <span style={{
                    background: decisionBg(c.atsDecision),
                    color: decisionColor(c.atsDecision),
                    padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700',
                    border: `1px solid ${decisionColor(c.atsDecision)}44`, whiteSpace: 'nowrap'
                  }}>{c.atsDecision || 'Pending'}</span>

                  {/* Status */}
                  <span style={{
                    background: c.status === 'Evaluated' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
                    color: c.status === 'Evaluated' ? 'var(--success-color)' : 'var(--text-secondary)',
                    padding: '4px 11px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600'
                  }}>{c.status || 'Pending'}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
