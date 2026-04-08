import { useState } from 'react'

const JOBS = [
  { id: 1, title: 'Frontend Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', skills: ['React', 'JavaScript', 'CSS'], desc: 'Build beautiful user interfaces for our AI-powered platform.' },
  { id: 2, title: 'Data Scientist', department: 'AI/ML', location: 'Hybrid', type: 'Full-time', skills: ['Python', 'ML', 'NLP'], desc: 'Develop and improve our resume screening AI models.' },
  { id: 3, title: 'HR Business Partner', department: 'Human Resources', location: 'On-site', type: 'Full-time', skills: ['Recruiting', 'Communication', 'Strategy'], desc: 'Help build fair and inclusive hiring processes.' },
  { id: 4, title: 'Backend Engineer', department: 'Engineering', location: 'Remote', type: 'Contract', skills: ['Python', 'FastAPI', 'PostgreSQL'], desc: 'Build robust APIs and data pipelines for our platform.' }
]

export default function CandidatePortal() {
  const [step, setStep] = useState(1)
  const [selectedJob, setSelectedJob] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', resume: null })
  const [errors, setErrors] = useState({})
  const [submittedData, setSubmittedData] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    if (!form.resume) e.resume = 'Please upload your resume (PDF)'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setSubmittedData({ ...form, job: selectedJob })
    setStep(4)
  }

  return (
    <div style={s.page}>

      <div style={s.header}>
        <div style={s.logoRow}>
          <div style={s.logoIcon}>🧠</div>
          <div style={s.logoText}>ResumeIQ</div>
        </div>
        <div style={s.stepIndicator}>
          {['Jobs', 'Apply', 'Review', 'Done'].map((label, i) => (
            <div key={i} style={s.stepItem}>
              <div style={{
                ...s.stepDot,
                background: step > i + 1 ? '#6366f1' : step === i + 1 ? '#818cf8' : '#1e293b',
                border: step === i + 1 ? '2px solid #818cf8' : '2px solid #1e293b',
                color: step >= i + 1 ? 'white' : '#475569'
              }}>{step > i + 1 ? '✓' : i + 1}</div>
              <span style={{ ...s.stepLabel, color: step === i + 1 ? '#f1f5f9' : '#475569' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={s.content}>

        {step === 1 && (
          <div>
            <h2 style={s.pageTitle}>Open Positions</h2>
            <p style={s.pageSubtitle}>Select a role you would like to apply for</p>
            <div style={s.jobGrid}>
              {JOBS.map(job => (
                <div key={job.id}
                  style={{ ...s.jobCard, border: selectedJob?.id === job.id ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)' }}
                  onClick={() => setSelectedJob(job)}>
                  <div style={s.jobCardTop}>
                    <div>
                      <div style={s.jobTitle}>{job.title}</div>
                      <div style={s.jobDept}>{job.department}</div>
                    </div>
                    {selectedJob?.id === job.id ? <div style={s.selectedBadge}>Selected</div> : null}
                  </div>
                  <p style={s.jobDesc}>{job.desc}</p>
                  <div style={s.tagRow}>
                    <span style={s.tag}>{job.location}</span>
                    <span style={s.tag}>{job.type}</span>
                    {job.skills.map(sk => <span key={sk} style={s.skillTag}>{sk}</span>)}
                  </div>
                </div>
              ))}
            </div>
            <button
              style={{ ...s.primaryBtn, opacity: selectedJob ? 1 : 0.4, cursor: selectedJob ? 'pointer' : 'not-allowed' }}
              onClick={() => { if (selectedJob) setStep(2) }}>
              {selectedJob ? 'Apply for ' + selectedJob.title + ' →' : 'Select a role to continue'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <button style={s.backBtn} onClick={() => setStep(1)}>← Back to Jobs</button>
            <h2 style={s.pageTitle}>Your Application</h2>
            <p style={s.pageSubtitle}>Applying for: {selectedJob ? selectedJob.title : ''}</p>
            <div style={s.formCard}>
              <div style={s.formGrid}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Full Name</label>
                  <input style={{ ...s.input, borderColor: errors.name ? '#f87171' : 'rgba(255,255,255,0.08)' }}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }) }} />
                  {errors.name ? <span style={s.errText}>{errors.name}</span> : null}
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Email Address</label>
                  <input style={{ ...s.input, borderColor: errors.email ? '#f87171' : 'rgba(255,255,255,0.08)' }}
                    type="email" placeholder="you@email.com"
                    value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }) }} />
                  {errors.email ? <span style={s.errText}>{errors.email}</span> : null}
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Phone Number</label>
                  <input style={{ ...s.input, borderColor: errors.phone ? '#f87171' : 'rgba(255,255,255,0.08)' }}
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: '' }) }} />
                  {errors.phone ? <span style={s.errText}>{errors.phone}</span> : null}
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Role</label>
                  <input style={{ ...s.input, color: '#64748b' }} value={selectedJob ? selectedJob.title : ''} disabled />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <label style={s.label}>Resume (PDF only)</label>
                <div style={{ ...s.uploadBox, borderColor: errors.resume ? '#f87171' : form.resume ? '#6366f1' : 'rgba(255,255,255,0.12)', background: form.resume ? 'rgba(99,102,241,0.06)' : '#0f172a' }}
                  onClick={() => document.getElementById('resumeInput').click()}>
                  {form.resume ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '28px' }}>📄</div>
                      <div style={{ color: '#818cf8', fontWeight: '500', fontSize: '14px' }}>{form.resume.name}</div>
                      <div style={{ color: '#64748b', fontSize: '12px' }}>Click to change</div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '28px' }}>⬆️</div>
                      <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>Click to upload resume</div>
                      <div style={{ color: '#475569', fontSize: '12px' }}>PDF only, max 5MB</div>
                    </div>
                  )}
                </div>
                <input id="resumeInput" type="file" accept=".pdf" style={{ display: 'none' }}
                  onChange={e => { if (e.target.files[0]) { setForm({ ...form, resume: e.target.files[0] }); setErrors({ ...errors, resume: '' }) } }} />
                {errors.resume ? <span style={s.errText}>{errors.resume}</span> : null}
              </div>

              <button style={{ ...s.primaryBtn, marginTop: '1.5rem' }} onClick={() => {
                const e = validate()
                if (Object.keys(e).length > 0) { setErrors(e); return }
                setStep(3)
              }}>Review Application →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <button style={s.backBtn} onClick={() => setStep(2)}>← Back</button>
            <h2 style={s.pageTitle}>Review and Submit</h2>
            <p style={s.pageSubtitle}>Confirm your details before submitting</p>
            <div style={s.formCard}>
              <div style={s.reviewRow}><span style={s.reviewLabel}>Full Name</span><span style={s.reviewValue}>{form.name}</span></div>
              <div style={s.divider} />
              <div style={s.reviewRow}><span style={s.reviewLabel}>Email</span><span style={s.reviewValue}>{form.email}</span></div>
              <div style={s.divider} />
              <div style={s.reviewRow}><span style={s.reviewLabel}>Phone</span><span style={s.reviewValue}>{form.phone}</span></div>
              <div style={s.divider} />
              <div style={s.reviewRow}><span style={s.reviewLabel}>Role</span><span style={{ ...s.reviewValue, color: '#818cf8' }}>{selectedJob ? selectedJob.title : ''}</span></div>
              <div style={s.divider} />
              <div style={s.reviewRow}><span style={s.reviewLabel}>Resume</span><span style={{ ...s.reviewValue, color: '#818cf8' }}>📄 {form.resume ? form.resume.name : ''}</span></div>
              <button style={{ ...s.primaryBtn, marginTop: '1.5rem' }} onClick={handleSubmit}>Submit Application 🚀</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '52px', margin: '1rem 0' }}>🎉</div>
            <h2 style={{ ...s.pageTitle, textAlign: 'center' }}>Application Submitted!</h2>
            <p style={{ ...s.pageSubtitle, textAlign: 'center', marginBottom: '2rem' }}>We will review your resume and get back to you soon.</p>
            <div style={s.formCard}>
              <div style={s.statusHeader}>Application Status</div>
              {[
                { label: 'Application Received', done: true, desc: 'Your application has been submitted.' },
                { label: 'Resume Screening (AI)', done: true, desc: 'AI is analyzing your resume.' },
                { label: 'Under Review', done: false, desc: 'HR team will review shortlisted candidates.' },
                { label: 'Interview Scheduled', done: false, desc: 'You will get an email if selected.' }
              ].map((item, i) => (
                <div key={i} style={s.statusItem}>
                  <div style={{ ...s.statusDot, background: item.done ? '#6366f1' : '#1e293b', border: item.done ? '2px solid #6366f1' : '2px solid #334155' }}>
                    {item.done ? '✓' : ''}
                  </div>
                  <div>
                    <div style={{ ...s.statusLabel, color: item.done ? '#f1f5f9' : '#475569' }}>{item.label}</div>
                    <div style={s.statusDesc}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ ...s.formCard, maxWidth: '400px', margin: '1.5rem auto' }}>
              <div style={s.reviewRow}><span style={s.reviewLabel}>Applicant</span><span style={s.reviewValue}>{submittedData ? submittedData.name : ''}</span></div>
              <div style={s.divider} />
              <div style={s.reviewRow}><span style={s.reviewLabel}>Role</span><span style={{ ...s.reviewValue, color: '#818cf8' }}>{submittedData ? submittedData.job.title : ''}</span></div>
              <div style={s.divider} />
              <div style={s.reviewRow}><span style={s.reviewLabel}>Status</span><span style={{ ...s.reviewValue, color: '#34d399' }}>✅ Applied</span></div>
            </div>
            <button style={{ ...s.primaryBtn, maxWidth: '280px', margin: '0 auto' }}
              onClick={() => { setStep(1); setForm({ name: '', email: '', phone: '', resume: null }); setSelectedJob(null) }}>
              Apply for Another Role
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#0a0e1a', color: '#f1f5f9' },
  header: { background: '#111827', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { width: '32px', height: '32px', background: 'linear-gradient(135deg,#6366f1,#14b8a6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' },
  logoText: { fontWeight: '700', fontSize: '15px', color: '#f1f5f9' },
  stepIndicator: { display: 'flex', alignItems: 'center', gap: '8px' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '6px' },
  stepDot: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' },
  stepLabel: { fontSize: '12px', fontWeight: '500' },
  content: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  pageTitle: { fontSize: '22px', fontWeight: '700', color: '#f1f5f9', marginBottom: '6px' },
  pageSubtitle: { fontSize: '13px', color: '#64748b', marginBottom: '1.5rem' },
  jobGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  jobCard: { background: '#111827', borderRadius: '14px', padding: '1.25rem', cursor: 'pointer' },
  jobCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  jobTitle: { fontSize: '15px', fontWeight: '600', color: '#f1f5f9' },
  jobDept: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  jobDesc: { fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '12px' },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  tag: { fontSize: '11px', padding: '3px 10px', background: '#1e293b', borderRadius: '20px', color: '#94a3b8' },
  skillTag: { fontSize: '11px', padding: '3px 10px', background: 'rgba(99,102,241,0.12)', borderRadius: '20px', color: '#818cf8' },
  selectedBadge: { fontSize: '11px', padding: '3px 10px', background: 'rgba(99,102,241,0.2)', borderRadius: '20px', color: '#818cf8', fontWeight: '600' },
  primaryBtn: { display: 'block', width: '100%', padding: '13px', background: 'linear-gradient(135deg,#6366f1,#818cf8)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  backBtn: { background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer', marginBottom: '1rem', padding: '0' },
  formCard: { background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  fieldGroup: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '12px', color: '#94a3b8', fontWeight: '500', marginBottom: '6px' },
  input: { background: '#0f172a', border: '1px solid', borderRadius: '10px', padding: '11px 14px', color: '#f1f5f9', fontSize: '14px', outline: 'none' },
  errText: { fontSize: '11px', color: '#f87171', marginTop: '4px' },
  uploadBox: { border: '2px dashed', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  reviewRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' },
  reviewLabel: { fontSize: '13px', color: '#64748b' },
  reviewValue: { fontSize: '13px', color: '#f1f5f9', fontWeight: '500' },
  divider: { height: '1px', background: 'rgba(255,255,255,0.06)' },
  statusHeader: { fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '1.2rem' },
  statusItem: { display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '1rem' },
  statusDot: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', flexShrink: 0 },
  statusLabel: { fontSize: '13px', fontWeight: '500', marginBottom: '2px' },
  statusDesc: { fontSize: '12px', color: '#475569' }
}