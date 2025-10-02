import { useState, useEffect } from 'react'

const CATEGORIES = ['Work', 'Personal', 'Health', 'Bills', 'Shopping', 'Other']
const RECURRING_OPTIONS = ['none', 'daily', 'weekly', 'monthly']

function ReminderForm({ reminder, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    priority: 'medium',
    category: 'Personal',
    recurring: 'none',
    advanceNotice: 0
  })

  useEffect(() => {
    if (reminder) {
      setFormData(reminder)
    } else {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      setFormData(prev => ({
        ...prev,
        date: today.toISOString().split('T')[0],
        time: '09:00'
      }))
    }
  }, [reminder])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    
    onSave(formData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const setQuickDate = (days) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    handleChange('date', date.toISOString().split('T')[0])
  }

  return (
    <div className="form-overlay">
      <form className="reminder-form" onSubmit={handleSubmit}>
        <h2 className="form-title">
          {reminder ? 'Edit Reminder' : 'Add New Reminder'}
        </h2>
        
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            className="form-input"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="What do you need to remember?"
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Add any additional details..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date & Time</label>
          <div className="quick-date-buttons">
            <button
              type="button"
              className={`recurring-btn ${formData.date === new Date().toISOString().split('T')[0] ? 'active' : ''}`}
              onClick={() => setQuickDate(0)}
            >
              Today
            </button>
            <button
              type="button"
              className={`recurring-btn ${formData.date === new Date(Date.now() + 86400000).toISOString().split('T')[0] ? 'active' : ''}`}
              onClick={() => setQuickDate(1)}
            >
              Tomorrow
            </button>
          </div>
          <div className="datetime-row">
            <input
              type="date"
              className="form-input"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
            <input
              type="time"
              className="form-input"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Priority</label>
          <div className="priority-options">
            {['high', 'medium', 'low'].map(priority => (
              <button
                key={priority}
                type="button"
                className={`priority-btn ${priority} ${formData.priority === priority ? 'active' : ''}`}
                onClick={() => handleChange('priority', priority)}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Repeat</label>
          <div className="recurring-options">
            {RECURRING_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                className={`recurring-btn ${formData.recurring === option ? 'active' : ''}`}
                onClick={() => handleChange('recurring', option)}
              >
                {option === 'none' ? 'No Repeat' : option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Advance Notice</label>
          <select
            className="form-select"
            value={formData.advanceNotice}
            onChange={(e) => handleChange('advanceNotice', parseInt(e.target.value))}
          >
            <option value={0}>At time</option>
            <option value={5}>5 minutes before</option>
            <option value={10}>10 minutes before</option>
            <option value={15}>15 minutes before</option>
            <option value={30}>30 minutes before</option>
            <option value={60}>1 hour before</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {reminder ? 'Update' : 'Save'} Reminder
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReminderForm