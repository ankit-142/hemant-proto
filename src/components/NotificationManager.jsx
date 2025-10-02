import { useEffect, useRef } from 'react'

function NotificationManager({ reminders }) {
  const checkedReminders = useRef(new Set())

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      
      reminders.forEach(reminder => {
        if (reminder.completed || checkedReminders.current.has(reminder.id)) {
          return
        }

        const reminderDateTime = new Date(reminder.date + 'T' + reminder.time)
        const notificationTime = new Date(reminderDateTime.getTime() - (reminder.advanceNotice * 60000))
        
        if (now >= notificationTime && now <= reminderDateTime) {
          showNotification(reminder)
          checkedReminders.current.add(reminder.id)
        }
      })
    }

    const showNotification = (reminder) => {
      if ('Notification' in window && Notification.permission === 'granted') {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        
        const notification = new Notification(`QuickRemind: ${reminder.title}`, {
          body: `${reminder.description || 'Reminder notification'}\n${formatDateTime(reminder.date, reminder.time)}`,
          icon: '/vite.svg',
          badge: '/vite.svg',
          tag: `reminder-${reminder.id}`,
          requireInteraction: !isMobile,
          vibrate: isMobile ? [200, 100, 200] : undefined,
          silent: false
        })

        notification.onclick = () => {
          window.focus()
          notification.close()
        }

        // Auto close after 15 seconds on mobile, 10 on desktop
        setTimeout(() => {
          notification.close()
        }, isMobile ? 15000 : 10000)

        // Play notification sound
        playNotificationSound()
      }
    }

    const formatDateTime = (date, time) => {
      const dateObj = new Date(date + 'T' + time)
      return dateObj.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }

    const playNotificationSound = () => {
      // Create a simple notification beep
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    }

    // Check every 30 seconds
    const interval = setInterval(checkReminders, 30000)
    
    // Initial check
    checkReminders()

    return () => clearInterval(interval)
  }, [reminders])

  // Clean up checked reminders when reminders change
  useEffect(() => {
    const currentIds = new Set(reminders.map(r => r.id))
    checkedReminders.current = new Set(
      [...checkedReminders.current].filter(id => currentIds.has(id))
    )
  }, [reminders])

  return null // This component doesn't render anything
}

export default NotificationManager