
import { useState } from 'react'
import './App.css'

const initialStudents = [
  { id: 1, name: 'Arjun Kumar', email: 'arjun@gmail.com', course: 'Computer Science', attendance: 92 },
  { id: 2, name: 'Priya Sharma', email: 'priya@gmail.com', course: 'Information Technology', attendance: 85 },
  { id: 3, name: 'Rahul Verma', email: 'rahul@gmail.com', course: 'Computer Science', attendance: 68 },
  { id: 4, name: 'Sneha Reddy', email: 'sneha@gmail.com', course: 'Electronics', attendance: 96 },
]

const pages = ['Dashboard', 'Students', 'Attendance', 'Prediction', 'Subjects & Courses']

function App() {
  const [page, setPage] = useState('Dashboard')
  const [students, setStudents] = useState(initialStudents)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [notice, setNotice] = useState('')
  const [attendance, setAttendance] = useState({})
  const [form, setForm] = useState({
    name: '', email: '', course: 'Computer Science', attendance: 75,
  })

  const average = students.length
    ? Math.round(students.reduce((sum, s) => sum + Number(s.attendance), 0) / students.length)
    : 0

  const atRisk = students.filter(s => Number(s.attendance) < 75).length

  function openAdd() {
    setEditingId(null)
    setForm({ name: '', email: '', course: 'Computer Science', attendance: 75 })
    setShowForm(true)
  }

  function openEdit(student) {
    setEditingId(student.id)
    setForm({ ...student })
    setShowForm(true)
  }

  function saveStudent(e) {
    e.preventDefault()

    if (editingId !== null) {
      setStudents(old => old.map(s =>
        s.id === editingId ? { ...form, id: s.id, attendance: Number(form.attendance) } : s
      ))
      setNotice('Student updated successfully.')
    } else {
      setStudents(old => [...old, {
        ...form, id: Date.now(), attendance: Number(form.attendance),
      }])
      setNotice('Student added successfully.')
    }

    setShowForm(false)
  }

  function deleteStudent(id) {
    if (!window.confirm('Delete this student?')) return
    setStudents(old => old.filter(s => s.id !== id))
    setNotice('Student deleted successfully.')
  }

  function exportCSV() {
    const rows = [
      ['ID', 'Name', 'Email', 'Course', 'Attendance'],
      ...students.map(s => [s.id, s.name, s.email, s.course, s.attendance]),
    ]
    const csv = rows.map(row => row.map(value =>
      `"${String(value).replace(/"/g, '""')}"`
    ).join(',')).join('\n')

    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'students.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const filtered = students.filter(s =>
    `${s.name} ${s.email} ${s.course}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div><strong>SmartCampus</strong><small>STUDENT MANAGEMENT</small></div>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <nav>
          {pages.map((item, i) => (
            <button key={item}
              className={`nav-item ${page === item ? 'active' : ''}`}
              onClick={() => { setPage(item); setNotice('') }}>
              <span className="nav-icon">{['▦', '♙', '✓', '↗', '▤'][i]}</span>
              {item}
              {item === 'Prediction' && <span className="ai-tag">AI</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span>✦</span>
            <strong>Smart insights</strong>
            <p>Monitor student progress and attendance in one place.</p>
          </div>
          <div className="profile">
            <div className="avatar">AD</div>
            <div><strong>Administrator</strong><small>College Admin</small></div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> {page}</div>
          <div className="top-actions"><span className="status-dot" /> Frontend preview <div className="avatar">AD</div></div>
        </header>

        <div className="page-content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">STUDENT SUCCESS, SIMPLIFIED</div>
              <h1>{page === 'Dashboard' ? 'Welcome back, Admin!' : page}</h1>
              <p className="subtitle">
                {page === 'Dashboard'
                  ? "Here's what's happening across your campus today."
                  : `Manage and monitor your ${page.toLowerCase()} information.`}
              </p>
            </div>
            <span className="date-chip">Academic Year 2026–27</span>
          </div>

          {notice && <div className="notice">{notice}<button onClick={() => setNotice('')}>×</button></div>}

          {page === 'Dashboard' && <>
            <section className="stats-grid">
              <Stat label="Total Students" value={students.length} detail="Registered students" icon="♙" color="purple" />
              <Stat label="Avg. Attendance" value={`${average}%`} detail="Across all students" icon="✓" color="green" />
              <Stat label="At Risk" value={atRisk} detail="Attendance below 75%" icon="△" color="orange" />
              <Stat label="Courses" value="4" detail="Course categories" icon="▤" color="blue" />
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div><h2>Student overview</h2><p>A quick look at student performance.</p></div>
                <button className="primary-btn" onClick={openAdd}>＋ Add student</button>
              </div>
              <StudentTable students={students.slice(0, 4)} onEdit={openEdit} onDelete={deleteStudent} />
              <button className="text-btn" onClick={() => setPage('Students')}>View all students →</button>
            </section>

            <section className="bottom-grid">
              <div className="panel">
                <div className="panel-heading"><div><h2>Attendance health</h2><p>Based on sample records</p></div></div>
                <div className="progress-row"><span>Attendance average</span><strong>{average}%</strong></div>
                <div className="progress-track"><div className="progress-fill green-fill" style={{ width: `${average}%` }} /></div>
                <div className="progress-row"><span>Students needing attention</span><strong>{atRisk}</strong></div>
                <div className="progress-track"><div className="progress-fill orange-fill" style={{ width: `${students.length ? atRisk / students.length * 100 : 0}%` }} /></div>
              </div>
              <div className="insight-card">
                <span className="insight-spark">✦</span>
                <div className="eyebrow">SMART INSIGHT</div>
                <h2>Every class counts.</h2>
                <p>{atRisk ? `${atRisk} student(s) have attendance below 75%. Consider following up with them.` : 'All students meet the 75% attendance threshold in these sample records.'}</p>
                <button className="light-btn" onClick={() => setPage('Prediction')}>Explore insights →</button>
              </div>
            </section>
          </>}

          {page === 'Students' && <section className="panel">
            <div className="panel-heading">
              <div><h2>All students</h2><p>{students.length} sample student records</p></div>
              <div className="button-row">
                <button className="secondary-btn" onClick={exportCSV}>↓ Export CSV</button>
                <button className="primary-btn" onClick={openAdd}>＋ Add student</button>
              </div>
            </div>
            <input className="search-input" placeholder="Search name, email or course..." value={search} onChange={e => setSearch(e.target.value)} />
            <StudentTable students={filtered} onEdit={openEdit} onDelete={deleteStudent} />
          </section>}

          {page === 'Attendance' && <section className="panel">
            <div className="panel-heading"><div><h2>Daily attendance</h2><p>Mark attendance for each student. Demo data only.</p></div></div>
            <div className="attendance-summary">
              <div><strong>{students.length}</strong><span>Total students</span></div>
              <div><strong>{Object.values(attendance).filter(v => v === 'Present').length}</strong><span>Present</span></div>
              <div><strong>{Object.values(attendance).filter(v => v === 'Absent').length}</strong><span>Absent</span></div>
            </div>
            <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>COURSE</th><th>MARK ATTENDANCE</th></tr></thead><tbody>
              {students.map(s => <tr key={s.id}>
                <td><strong>{s.name}</strong><small className="cell-sub">{s.email}</small></td><td>{s.course}</td>
                <td><div className="button-row">
                  <button className={`attendance-btn ${attendance[s.id] === 'Present' ? 'present-selected' : ''}`} onClick={() => setAttendance(old => ({ ...old, [s.id]: 'Present' }))}>✓ Present</button>
                  <button className={`attendance-btn ${attendance[s.id] === 'Absent' ? 'absent-selected' : ''}`} onClick={() => setAttendance(old => ({ ...old, [s.id]: 'Absent' }))}>× Absent</button>
                </div></td>
              </tr>)}
            </tbody></table></div>
          </section>}

          {page === 'Prediction' && <>
            <div className="prediction-banner"><span className="insight-spark">✦</span><div><h2>Attendance risk overview</h2><p>Rule-based demonstration using sample attendance data, not a trained AI model.</p></div></div>
            <section className="stats-grid two-stats">
              <Stat label="On track" value={students.filter(s => s.attendance >= 85).length} detail="Attendance at least 85%" icon="✓" color="green" />
              <Stat label="Needs attention" value={atRisk} detail="Attendance below 75%" icon="△" color="orange" />
            </section>
            <section className="panel"><div className="panel-heading"><div><h2>Student risk assessment</h2><p>Sample indicators to help identify students for follow-up.</p></div></div>
              <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>ATTENDANCE</th><th>INDICATOR</th></tr></thead><tbody>
                {students.map(s => <tr key={s.id}><td><strong>{s.name}</strong><small className="cell-sub">{s.course}</small></td><td><strong>{s.attendance}%</strong></td><td><span className={`badge ${s.attendance < 75 ? 'badge-risk' : s.attendance < 85 ? 'badge-watch' : 'badge-good'}`}>{s.attendance < 75 ? 'Needs attention' : s.attendance < 85 ? 'Monitor' : 'On track'}</span></td></tr>)}
              </tbody></table></div>
            </section>
          </>}

          {page === 'Subjects & Courses' && <section className="course-grid">
            {[
              { name: 'Computer Science', code: 'CS101', subjects: 'Data Structures, Java, DBMS' },
              { name: 'Information Technology', code: 'IT201', subjects: 'Web Development, Networks' },
              { name: 'Electronics', code: 'EC301', subjects: 'Digital Systems, Circuits' },
              { name: 'Mechanical Engineering', code: 'ME401', subjects: 'Thermodynamics, CAD' },
            ].map((c, i) => <article className="course-card" key={c.code}>
              <div className={`course-icon ${['purple', 'blue', 'green', 'orange'][i]}`}>▤</div>
              <span className="course-code">{c.code}</span><h2>{c.name}</h2><p>{c.subjects}</p>
              <div className="course-footer"><span>Course overview</span><span>→</span></div>
            </article>)}
          </section>}
        </div>
      </main>

      {showForm && <div className="modal-backdrop" onClick={() => setShowForm(false)}>
        <form className="student-form" onSubmit={saveStudent} onClick={e => e.stopPropagation()}>
          <div className="panel-heading"><div><h2>{editingId !== null ? 'Edit student' : 'Add student'}</h2><p>Enter student details below.</p></div><button type="button" className="close-btn" onClick={() => setShowForm(false)}>×</button></div>
          <label>Full name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" /></label>
          <label>Email address<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="student@example.com" /></label>
          <label>Course<select value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}><option>Computer Science</option><option>Information Technology</option><option>Electronics</option><option>Mechanical Engineering</option></select></label>
          <label>Attendance percentage<input type="number" min="0" max="100" required value={form.attendance} onChange={e => setForm({ ...form, attendance: e.target.value })} /></label>
          <div className="button-row form-actions"><button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="primary-btn">Save student</button></div>
        </form>
      </div>}
    </div>
  )
}

function Stat({ label, value, detail, icon, color }) {
  return <article className="stat-card"><div className={`stat-icon ${color}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></article>
}

function StudentTable({ students, onEdit, onDelete }) {
  return <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>COURSE</th><th>ATTENDANCE</th><th>ACTIONS</th></tr></thead><tbody>
    {students.map(s => <tr key={s.id}>
      <td><div className="student-name"><div className="student-avatar">{s.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div><div><strong>{s.name}</strong><small className="cell-sub">{s.email}</small></div></div></td>
      <td>{s.course}</td><td><span className={`badge ${s.attendance < 75 ? 'badge-risk' : s.attendance < 85 ? 'badge-watch' : 'badge-good'}`}>{s.attendance}%</span></td>
      <td><div className="button-row"><button className="action-btn" onClick={() => onEdit(s)} title="Edit">✎</button><button className="action-btn delete-btn" onClick={() => onDelete(s.id)} title="Delete">×</button></div></td>
    </tr>)}
    {students.length === 0 && <tr><td colSpan="4" className="empty-state">No students found.</td></tr>}
  </tbody></table></div>
}

export default App
