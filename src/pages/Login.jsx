import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CREDENTIALS = {
  candidate: { email: 'candidate@resumeiq.com', password: 'candidate123' },
  hr: { email: 'hr@resumeiq.com', code: 'RESUMEIQ2024' }
}

export default function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState('candidate')
  const [form, setForm] = useState({ email: '', password: '', code: '' })
  const [error, setError] = useState('')

  const handleLogin = () => {
    setError('')
    if (role === 'candidate') {
      if (form.email === CREDENTIALS.candidate.email && form.password === CREDENTIALS.candidate.password) {
        navigate('/candidate')
      } else {
        setError('Invalid email or password.')
      }
    } else {
      if (form.email === CREDENTIALS.hr.email && form.code === CREDENTIALS.hr.code) {
        navigate('/hr')
      } else {
        setError('Invalid company email or HR access code.')
      }
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>

        <div style={s.logoRow}>
          <div style={s.logoIcon}>🧠</div>
          <div>
            <div style={s.logoText}>ResumeIQ</div>
            <div style={s.logoSub}>Smart Resume Screening</div>
          </div>
        </div>

        <h1 style={s.headline}>Welcome back</h1>
        <p style={s.subline}>Select your role to access your portal</p>

        <div style={s.toggle}>
          <button
            style={{ ...s.toggleBtn, ...(role === 'candidate' ? s.activeCandidate : {}) }}
            onClick={() => { setRole('candidate'); setError('') }}
          >
            👤 Candidate
          </button>
          <button
            style={{ ...s.toggleBtn, ...(role === 'hr' ? s.activeHR : {}) }}
            onClick={() => { setRole('hr'); setError('') }}
          >
            🏢 HR / Recruiter
          </button>
        </div>

        <div style={{
          ...s.hint,
          background: role === 'candidate' ? 'rgba(99,102,241,0.08)' : 'rgba(20,184,166,0.08)',
          borderColor: role === 'candidate' ? 'rgba(99,102,241,0.25)' : 'rgba(20,184,166,0.25)'
        }}>
          {role === 'candidate'
            ? <><code style={s.code}>candidate@resumeiq.com</code> / <code style={s.code}>candidate123</code></>
            : <><code style={{ ...s.code, color: '#5eead4' }}>hr@resumeiq.com</code> / <code style={{ ...s.code, color: '#5eead4' }}>RESUMEIQ2024</code></>
          }
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>{role === 'hr' ? 'Company email' : 'Email address'}</label>
          <input
            style={s.input}
            type="email"
            placeholder={role === 'hr' ? 'you@company.com' : 'you@email.com'}
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>{role === 'hr' ? 'HR access code' : 'Password'}</label>
          <input
            style={s.input}
            type="password"
            placeholder={role === 'hr' ? 'Company-issued access code' : '••••••••'}
            value={role === 'hr' ? form.code : form.password}
            onChange={e => role === 'hr'
              ? setForm({ ...form, code: e.target.value })
              : setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {error && <div style={s.error}>{error}</div>}

        <button
          style={{
            ...s.submitBtn,
            background: role === 'candidate'
              ? 'linear-gradient(135deg,#6366f1,#818cf8)'
              : 'linear-gradient(135deg,#0f766e,#14b8a6)'
          }}
          onClick={handleLogin}
        >
          {role === 'candidate' ? 'Continue to Candidate Portal →' : 'Continue to HR Dashboard →'}
        </button>

      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#0a0e1a', padding: '2rem'
  },
  card: {
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px', padding: '2.5rem',
    width: '100%', maxWidth: '420px'
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.8rem' },
  logoIcon: {
    width: '38px', height: '38px',
    background: 'linear-gradient(135deg,#6366f1,#14b8a6)',
    borderRadius: '10px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '20px'
  },
  logoText: { fontWeight: '700', fontSize: '16px', color: '#f1f5f9', letterSpacing: '-0.3px' },
  logoSub: { fontSize: '11px', color: '#64748b' },
  headline: { fontSize: '22px', fontWeight: '700', color: '#f1f5f9', marginBottom: '6px' },
  subline: { fontSize: '13px', color: '#64748b', marginBottom: '1.6rem' },
  toggle: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    background: '#0f172a', borderRadius: '12px',
    padding: '4px', marginBottom: '1.4rem',
    border: '1px solid rgba(255,255,255,0.06)'
  },
  toggleBtn: {
    padding: '10px', borderRadius: '9px', border: 'none',
    background: 'transparent', color: '#64748b',
    fontSize: '13px', fontWeight: '500', cursor: 'pointer'
  },
  activeCandidate: { background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: 'white' },
  activeHR: { background: 'linear-gradient(135deg,#0f766e,#14b8a6)', color: 'white' },
  hint: {
    border: '1px solid', borderRadius: '10px',
    padding: '10px 14px', marginBottom: '1.2rem',
    fontSize: '12px', color: '#94a3b8', lineHeight: '1.6'
  },
  code: { color: '#a5b4fc', fontFamily: 'monospace', fontSize: '12px' },
  fieldGroup: { marginBottom: '1rem' },
  label: {
    display: 'block', fontSize: '12px', color: '#94a3b8',
    fontWeight: '500', marginBottom: '6px'
  },
  input: {
    width: '100%', background: '#0f172a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', padding: '11px 14px',
    color: '#f1f5f9', fontSize: '14px', outline: 'none'
  },
  error: {
    color: '#f87171', fontSize: '12px',
    padding: '8px 12px', background: 'rgba(248,113,113,0.1)',
    borderRadius: '8px', border: '1px solid rgba(248,113,113,0.2)',
    marginBottom: '0.8rem'
  },
  submitBtn: {
    width: '100%', padding: '13px', borderRadius: '12px',
    border: 'none', fontSize: '14px', fontWeight: '500',
    color: 'white', cursor: 'pointer', marginTop: '4px'
  }
}