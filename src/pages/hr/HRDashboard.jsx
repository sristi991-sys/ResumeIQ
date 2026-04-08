import { useState } from 'react'

const CANDIDATES = [
  { id: 1, name: 'Arjun Mehta', role: 'Frontend Developer', score: 92, status: 'Shortlisted', experience: '3 years', college: 'IIT Delhi', skills: ['React', 'JavaScript', 'CSS'], reason: 'Strong portfolio with relevant React projects. Excellent skill match.', bias: null },
  { id: 2, name: 'Priya Sharma', role: 'Data Scientist', score: 88, status: 'Shortlisted', experience: '2 years', college: 'NIT Trichy', skills: ['Python', 'ML', 'NLP'], reason: 'Solid ML background with NLP experience directly relevant to the role.', bias: null },
  { id: 3, name: 'Rahul Verma', role: 'Backend Engineer', score: 76, status: 'Under Review', experience: '4 years', college: 'VIT Vellore', skills: ['Python', 'FastAPI'], reason: 'Good backend experience but missing PostgreSQL expertise mentioned in JD.', bias: { type: 'College Bias Risk', detail: 'Candidate from tier-2 college — ensure evaluation is skill-based only.' } },
  { id: 4, name: 'Sneha Patel', role: 'HR Business Partner', score: 85, status: 'Shortlisted', experience: '5 years', college: 'XLRI Jamshedpur', skills: ['Recruiting', 'Strategy'], reason: 'Extensive HR experience with proven track record in inclusive hiring.', bias: null },
  { id: 5, name: 'Karan Singh', role: 'Frontend Developer', score: 61, status: 'Rejected', experience: '1 year', college: 'Local College', skills: ['HTML', 'CSS'], reason: 'Insufficient React experience. Only basic HTML/CSS skills found in resume.', bias: { type: 'Gender Bias Risk', detail: 'Name may indicate gender — ensure rejection is purely skill-based.' } },
  { id: 6, name: 'Ananya Roy', role: 'Data Scientist', score: 79, status: 'Under Review', experience: '2 years', college: 'BITS Pilani', skills: ['Python', 'TensorFlow'], reason: 'Good Python skills. Needs more NLP-specific experience for full match.', bias: null },
]

const statusColor = { Shortlisted: { bg: 'rgba(52,211,153,0.12)', color: '#34d399' }, 'Under Review': { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24' }, Rejected: { bg: 'rgba(248,113,113,0.12)', color: '#f87171' } }

export default function HRDashboard() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')
  const [scheduled, setScheduled] = useState([])

  const total = CANDIDATES.length
  const shortlisted = CANDIDATES.filter(c => c.status === 'Shortlisted').length
  const avgScore = Math.round(CANDIDATES.reduce((a, c) => a + c.score, 0) / total)
  const biasFlags = CANDIDATES.filter(c => c.bias).length

  const filtered = filter === 'All' ? CANDIDATES : CANDIDATES.filter(c => c.status === filter)

  const toggleSchedule = (id) => {
    setScheduled(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <div style={s.logoRow}>
          <div style={s.logoIcon}>🧠</div>
          <div>
            <div style={s.logoText}>ResumeIQ</div>
            <div style={s.logoSub}>HR Dashboard</div>
          </div>
        </div>
        <div style={s.headerBadge}>🏢 HR Portal</div>
      </div>

      <div style={s.layout}>

        {/* LEFT PANEL */}
        <div style={s.leftPanel}>

          {/* Stats */}
          <div style={s.statsGrid}>
            <div style={s.statCard}>
              <div style={s.statNum}>{total}</div>
              <div style={s.statLabel}>Total Applicants</div>
            </div>
            <div style={s.statCard}>
              <div style={{ ...s.statNum, color: '#34d399' }}>{shortlisted}</div>
              <div style={s.statLabel}>Shortlisted</div>
            </div>
            <div style={s.statCard}>
              <div style={{ ...s.statNum, color: '#818cf8' }}>{avgScore}%</div>
              <div style={s.statLabel}>Avg Score</div>
            </div>
            <div style={s.statCard}>
              <div style={{ ...s.statNum, color: '#fbbf24' }}>{biasFlags}</div>
              <div style={s.statLabel}>Bias Flags</div>
            </div>
          </div>

          {/* Filter */}
          <div style={s.filterRow}>
            {['All', 'Shortlisted', 'Under Review', 'Rejected'].map(f => (
              <button key={f} style={{ ...s.filterBtn, background: filter === f ? '#6366f1' : '#1e293b', color: filter === f ? 'white' : '#94a3b8' }}
                onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>

          {/* Candidate List */}
          <div style={s.candidateList}>
            {filtered.sort((a, b) => b.score - a.score).map(c => (
              <div key={c.id}
                style={{ ...s.candidateCard, border: selected?.id === c.id ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)' }}
                onClick={() => setSelected(c)}>
                <div style={s.cardTop}>
                  <div style={s.avatar}>{c.name.split(' ').map(n => n[0]).join('')}</div>
                  <div style={{ flex: 1 }}>
                    <div style={s.candidateName}>
                      {c.name}
                      {c.bias ? <span style={s.biasFlag}>⚠️ Bias Flag</span> : null}
                    </div>
                    <div style={s.candidateRole}>{c.role}</div>
                  </div>
                  <div style={s.scoreCircle}>{c.score}</div>
                </div>
                <div style={s.cardBottom}>
                  <span style={{ ...s.statusBadge, background: statusColor[c.status].bg, color: statusColor[c.status].color }}>{c.status}</span>
                  <span style={s.expText}>{c.experience}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={s.rightPanel}>
          {selected ? (
            <div>
              {/* Candidate Header */}
              <div style={s.detailHeader}>
                <div style={{ ...s.avatarLg, background: selected.bias ? 'rgba(251,191,36,0.2)' : 'rgba(99,102,241,0.2)', color: selected.bias ? '#fbbf24' : '#818cf8' }}>
                  {selected.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 style={s.detailName}>{selected.name}</h2>
                  <div style={s.detailRole}>{selected.role} • {selected.college}</div>
                  <span style={{ ...s.statusBadge, background: statusColor[selected.status].bg, color: statusColor[selected.status].color }}>{selected.status}</span>
                </div>
                <div style={{ ...s.bigScore, color: selected.score >= 80 ? '#34d399' : selected.score >= 65 ? '#fbbf24' : '#f87171' }}>
                  {selected.score}<span style={{ fontSize: '14px', color: '#64748b' }}>/100</span>
                </div>
              </div>

              {/* AI Score Bar */}
              <div style={s.section}>
                <div style={s.sectionTitle}>AI Match Score</div>
                <div style={s.scoreBar}>
                  <div style={{ ...s.scoreBarFill, width: selected.score + '%', background: selected.score >= 80 ? 'linear-gradient(90deg,#34d399,#059669)' : selected.score >= 65 ? 'linear-gradient(90deg,#fbbf24,#d97706)' : 'linear-gradient(90deg,#f87171,#dc2626)' }} />
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>{selected.score}% match with job requirements</div>
              </div>

              {/* Skills */}
              <div style={s.section}>
                <div style={s.sectionTitle}>Skills Detected</div>
                <div style={s.tagRow}>
                  {selected.skills.map(sk => <span key={sk} style={s.skillTag}>{sk}</span>)}
                </div>
              </div>

              {/* AI Reason */}
              <div style={s.section}>
                <div style={s.sectionTitle}>🤖 AI Evaluation Reason</div>
                <div style={s.reasonBox}>{selected.reason}</div>
              </div>

              {/* Bias Report */}
              {selected.bias ? (
                <div style={s.biasBox}>
                  <div style={s.biasTitle}>⚠️ {selected.bias.type}</div>
                  <div style={s.biasDetail}>{selected.bias.detail}</div>
                </div>
              ) : (
                <div style={s.noBiasBox}>
                  <div style={{ color: '#34d399', fontWeight: '600', fontSize: '13px' }}>✅ No Bias Detected</div>
                  <div style={{ color: '#475569', fontSize: '12px', marginTop: '4px' }}>This evaluation appears fair and skill-based.</div>
                </div>
              )}

              {/* Actions */}
              <div style={s.actionRow}>
                <button
                  style={{ ...s.actionBtn, background: scheduled.includes(selected.id) ? 'rgba(52,211,153,0.15)' : 'rgba(99,102,241,0.15)', color: scheduled.includes(selected.id) ? '#34d399' : '#818cf8', border: scheduled.includes(selected.id) ? '1px solid #34d399' : '1px solid #6366f1' }}
                  onClick={() => toggleSchedule(selected.id)}>
                  {scheduled.includes(selected.id) ? '✅ Interview Scheduled' : '📅 Schedule Interview'}
                </button>
                <button style={{ ...s.actionBtn, background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid #f87171' }}>
                  ❌ Reject
                </button>
              </div>
            </div>
          ) : (
            <div style={s.emptyState}>
              <div style={{ fontSize: '48px', marginBottom: '1rem' }}>👈</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '6px' }}>Select a candidate</div>
              <div style={{ fontSize: '13px', color: '#475569' }}>Click any candidate from the list to view their details, AI evaluation, and bias report.</div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#0a0e1a', color: '#f1f5f9' },
  header: { background: '#111827', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { width: '32px', height: '32px', background: 'linear-gradient(135deg,#6366f1,#14b8a6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' },
  logoText: { fontWeight: '700', fontSize: '15px', color: '#f1f5f9' },
  logoSub: { fontSize: '11px', color: '#64748b' },
  headerBadge: { fontSize: '12px', padding: '6px 14px', background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: '20px', color: '#14b8a6' },
  layout: { display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: 'calc(100vh - 65px)' },
  leftPanel: { borderRight: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem', overflowY: 'auto' },
  rightPanel: { padding: '1.5rem', overflowY: 'auto' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.2rem' },
  statCard: { background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1rem', textAlign: 'center' },
  statNum: { fontSize: '24px', fontWeight: '700', color: '#f1f5f9' },
  statLabel: { fontSize: '11px', color: '#64748b', marginTop: '2px' },
  filterRow: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' },
  filterBtn: { fontSize: '11px', padding: '5px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '500' },
  candidateList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  candidateCard: { background: '#111827', borderRadius: '12px', padding: '1rem', cursor: 'pointer' },
  cardTop: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  candidateName: { fontSize: '13px', fontWeight: '600', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '6px' },
  candidateRole: { fontSize: '11px', color: '#64748b', marginTop: '2px' },
  scoreCircle: { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' },
  cardBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  statusBadge: { fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' },
  expText: { fontSize: '11px', color: '#475569' },
  biasFlag: { fontSize: '10px', padding: '2px 8px', background: 'rgba(251,191,36,0.15)', color: '#fbbf24', borderRadius: '10px' },
  detailHeader: { display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  avatarLg: { width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', flexShrink: 0 },
  detailName: { fontSize: '20px', fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' },
  detailRole: { fontSize: '13px', color: '#64748b', marginBottom: '8px' },
  bigScore: { fontSize: '36px', fontWeight: '700', marginLeft: 'auto' },
  section: { marginBottom: '1.2rem' },
  sectionTitle: { fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  scoreBar: { height: '8px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: '10px', transition: 'width 0.5s' },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  skillTag: { fontSize: '12px', padding: '4px 12px', background: 'rgba(99,102,241,0.12)', borderRadius: '20px', color: '#818cf8' },
  reasonBox: { background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1rem', fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' },
  biasBox: { background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '12px', padding: '1rem', marginBottom: '1.2rem' },
  biasTitle: { fontSize: '13px', fontWeight: '600', color: '#fbbf24', marginBottom: '6px' },
  biasDetail: { fontSize: '12px', color: '#92400e', lineHeight: '1.5' },
  noBiasBox: { background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '12px', padding: '1rem', marginBottom: '1.2rem' },
  actionRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  actionBtn: { padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', textAlign: 'center', color: '#475569' }
}