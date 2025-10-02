import ReminderCard from './ReminderCard'

function ReminderList({ reminders, filter, onEdit, onDelete, onToggleComplete, onSnooze }) {
  const filterReminders = () => {
    const today = new Date().toISOString().split('T')[0]
    const now = new Date()
    
    switch (filter) {
      case 'today':
        return reminders.filter(r => r.date === today)
      case 'upcoming':
        return reminders.filter(r => {
          const reminderDate = new Date(r.date + 'T' + r.time)
          return reminderDate > now && !r.completed
        })
      case 'completed':
        return reminders.filter(r => r.completed)
      case 'overdue':
        return reminders.filter(r => {
          const reminderDate = new Date(r.date + 'T' + r.time)
          return reminderDate < now && !r.completed
        })
      default:
        return reminders
    }
  }

  const filteredReminders = filterReminders()
  
  // Sort reminders: overdue first, then by date/time
  const sortedReminders = [...filteredReminders].sort((a, b) => {
    const now = new Date()
    const aDate = new Date(a.date + 'T' + a.time)
    const bDate = new Date(b.date + 'T' + b.time)
    
    const aOverdue = aDate < now && !a.completed
    const bOverdue = bDate < now && !b.completed
    
    if (aOverdue && !bOverdue) return -1
    if (!aOverdue && bOverdue) return 1
    
    return aDate - bDate
  })

  if (sortedReminders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <div className="empty-title">No reminders found</div>
        <div>
          {filter === 'all' 
            ? 'Create your first reminder to get started!'
            : `No ${filter} reminders at the moment.`
          }
        </div>
      </div>
    )
  }

  return (
    <div className="reminder-list">
      {sortedReminders.map(reminder => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onSnooze={onSnooze}
        />
      ))}
    </div>
  )
}

export default ReminderList