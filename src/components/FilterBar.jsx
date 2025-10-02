function FilterBar({ filter, onFilterChange, reminders }) {
  const today = new Date().toISOString().split('T')[0]
  const now = new Date()
  
  const getCounts = () => {
    const all = reminders.length
    const todayItems = reminders.filter(r => r.date === today).length
    const upcoming = reminders.filter(r => {
      const reminderDate = new Date(r.date + 'T' + r.time)
      return reminderDate > now && !r.completed
    }).length
    const completed = reminders.filter(r => r.completed).length
    const overdue = reminders.filter(r => {
      const reminderDate = new Date(r.date + 'T' + r.time)
      return reminderDate < now && !r.completed
    }).length
    
    return { all, today: todayItems, upcoming, completed, overdue }
  }

  const counts = getCounts()

  const filters = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'today', label: 'Today', count: counts.today },
    { key: 'upcoming', label: 'Upcoming', count: counts.upcoming },
    { key: 'completed', label: 'Completed', count: counts.completed },
    { key: 'overdue', label: 'Overdue', count: counts.overdue }
  ]

  return (
    <div className="filter-bar">
      <div className="filter-tabs">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            className={`filter-tab ${filter === key ? 'active' : ''}`}
            onClick={() => onFilterChange(key)}
          >
            {label}
            <span className="count">{count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterBar