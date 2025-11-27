/**
 * Get Monday of current week at 00:00:00
 */
export function getCurrentWeekMonday(): Date {
  const today = new Date()
  const monday = new Date(today)
  const dayOfWeek = today.getDay()
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  monday.setDate(today.getDate() - daysFromMonday)
  monday.setHours(0, 0, 0, 0)
  return monday
}

/**
 * Check if a date falls within the current week (Monday to Sunday)
 */
export function isWithinCurrentWeek(dateString: string): boolean {
  const checkInDate = new Date(dateString)
  const monday = getCurrentWeekMonday()

  // Get Sunday of current week
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return checkInDate >= monday && checkInDate <= sunday
}
