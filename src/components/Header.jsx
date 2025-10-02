import { useState, useEffect } from 'react'

function Header({ reminders, onAddClick }) {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const updateDate = () => {
      const now = new Date()
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
    }
    
    updateDate()
    const interval = setInterval(updateDate, 60000)
    return () => clearInterval(interval)
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const todayReminders = reminders.filter(r => r.date === today && !r.completed)
  const completedToday = reminders.filter(r => r.date === today && r.completed)

  return (
    <div className="header">
      <div className="header-top">
        <div className="title-section">
          <h1 className="app-title">
            <span className="title-icon">📝</span>
            QuickRemind
          </h1>
          <div className="app-subtitle">Smart Daily Reminders</div>
        </div>
        <div className="date-section">
          <div className="current-date">{currentDate}</div>
          <div className="current-time">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
      
      <div className="stats">
        <div className="stat">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{reminders.length}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-number">{todayReminders.length}</div>
            <div className="stat-label">Today</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{completedToday.length}</div>
            <div className="stat-label">Done</div>
          </div>
        </div>
      </div>
      
      <button className="add-btn" onClick={onAddClick}>
        <span className="btn-icon">➕</span>
        <span className="btn-text">Add New Reminder</span>
        <span className="btn-shine"></span>
      </button>
    </div>
  )
}

export default Header