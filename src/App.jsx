import { useState, useEffect } from 'react'
import './App.css'
import ReminderForm from './components/ReminderForm'
import ReminderList from './components/ReminderList'
import FilterBar from './components/FilterBar'
import Header from './components/Header'
import NotificationManager from './components/NotificationManager'

function App() {
  const [reminders, setReminders] = useState([])
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingReminder, setEditingReminder] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('quickremind-data')
    if (saved) {
      setReminders(JSON.parse(saved))
    }
    requestNotificationPermission()
  }, [])

  useEffect(() => {
    localStorage.setItem('quickremind-data', JSON.stringify(reminders))
  }, [reminders])

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const addReminder = (reminder) => {
    const newReminder = {
      ...reminder,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString()
    }
    setReminders(prev => [...prev, newReminder])
    setShowForm(false)
  }

  const updateReminder = (updatedReminder) => {
    setReminders(prev => prev.map(r => r.id === updatedReminder.id ? updatedReminder : r))
    setEditingReminder(null)
    setShowForm(false)
  }

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  const toggleComplete = (id) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ))
  }

  const snoozeReminder = (id, minutes) => {
    const newTime = new Date(Date.now() + minutes * 60000)
    setReminders(prev => prev.map(r => 
      r.id === id ? { 
        ...r, 
        date: newTime.toISOString().split('T')[0],
        time: newTime.toTimeString().slice(0, 5)
      } : r
    ))
  }

  return (
    <div className="app">
      <Header 
        reminders={reminders}
        onAddClick={() => setShowForm(true)}
      />
      
      {(showForm || editingReminder) && (
        <div className="form-backdrop">
          <ReminderForm
            reminder={editingReminder}
            onSave={editingReminder ? updateReminder : addReminder}
            onCancel={() => {
              setShowForm(false)
              setEditingReminder(null)
            }}
          />
        </div>
      )}

      <FilterBar 
        filter={filter}
        onFilterChange={setFilter}
        reminders={reminders}
      />

      <ReminderList
        reminders={reminders}
        filter={filter}
        onEdit={setEditingReminder}
        onDelete={deleteReminder}
        onToggleComplete={toggleComplete}
        onSnooze={snoozeReminder}
      />

      <NotificationManager reminders={reminders} />
    </div>
  )
}

export default App