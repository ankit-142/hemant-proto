import { useState } from 'react'

function ReminderCard({ reminder, onEdit, onDelete, onToggleComplete, onSnooze }) {
  const [showSnooze, setShowSnooze] = useState(false)
  
  const formatDateTime = (date, time) => {
    const dateObj = new Date(date + 'T' + time)
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }) + ' at ' + dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getDaysUntil = () => {
    const today = new Date()
    const reminderDate = new Date(reminder.date)
    const diffTime = reminderDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
    return `In ${diffDays} days`
  }

  const isOverdue = () => {
    const now = new Date()
    const reminderDateTime = new Date(reminder.date + 'T' + reminder.time)
    return reminderDateTime < now && !reminder.completed
  }

  const snoozeOptions = [
    { label: '5 minutes', minutes: 5 },
    { label: '10 minutes', minutes: 10 },
    { label: '15 minutes', minutes: 15 },
    { label: '30 minutes', minutes: 30 },
    { label: '1 hour', minutes: 60 }
  ]

  return (
    <div className={`reminder-card ${reminder.completed ? 'completed' : ''} ${isOverdue() ? 'overdue' : ''}`}>
      <div className="card-header">
        <div className="card-main">
          <div className="title-row">
            <h3 className="card-title">{reminder.title}</h3>
            <div className={`priority-badge ${reminder.priority}`}>
              {reminder.priority === 'high' ? '🔴' : reminder.priority === 'medium' ? '🟡' : '🟢'}
            </div>
          </div>
          <div className="card-datetime">
            <span className="datetime-icon">🕐</span>
            <span className="datetime-text">{formatDateTime(reminder.date, reminder.time)}</span>
            <span className={`days-badge ${getDaysUntil() === 'Today' ? 'today' : getDaysUntil().includes('ago') ? 'overdue' : 'upcoming'}`}>
              {getDaysUntil()}
            </span>
          </div>
        </div>
      </div>

      <div className="card-meta">
        <div className="category-section">
          <span className="category-tag">
            <span className="category-icon">🏷️</span>
            {reminder.category}
          </span>
          {reminder.recurring !== 'none' && (
            <span className="recurring-tag">
              <span className="recurring-icon">🔄</span>
              {reminder.recurring}
            </span>
          )}
        </div>
      </div>

      {reminder.description && (
        <div className="card-description">
          <span className="description-icon">📝</span>
          {reminder.description}
        </div>
      )}

      <div className="card-actions">
        <button
          className={`action-btn complete ${reminder.completed ? 'completed' : ''}`}
          onClick={() => onToggleComplete(reminder.id)}
        >
          <span className="action-icon">{reminder.completed ? '✅' : '✓'}</span>
          <span className="action-text">{reminder.completed ? 'Completed' : 'Complete'}</span>
        </button>
        
        <button
          className="action-btn edit"
          onClick={() => onEdit(reminder)}
        >
          <span className="action-icon">✏️</span>
          <span className="action-text">Edit</span>
        </button>
        
        {!reminder.completed && (
          <div className="snooze-dropdown">
            <button
              className="action-btn snooze"
              onClick={() => setShowSnooze(!showSnooze)}
            >
              <span className="action-icon">⏰</span>
              <span className="action-text">Snooze</span>
            </button>
            {showSnooze && (
              <div className="snooze-options">
                {snoozeOptions.map(option => (
                  <button
                    key={option.minutes}
                    className="snooze-option"
                    onClick={() => {
                      onSnooze(reminder.id, option.minutes)
                      setShowSnooze(false)
                    }}
                  >
                    <span className="snooze-icon">⏱️</span>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        <button
          className="action-btn delete"
          onClick={() => onDelete(reminder.id)}
        >
          <span className="action-icon">🗑️</span>
          <span className="action-text">Delete</span>
        </button>
      </div>
    </div>
  )
}

export default ReminderCard