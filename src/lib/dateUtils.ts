/**
 * Check if a date falls within the current week (Monday to Sunday)
 */
export function isWithinCurrentWeek(dateString: string): boolean {
  const checkInDate = new Date(dateString)
  const today = new Date()

  // Get Monday of current week
  const monday = new Date(today)
  const dayOfWeek = today.getDay()
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  monday.setDate(today.getDate() - daysFromMonday)
  monday.setHours(0, 0, 0, 0)

  // Get Sunday of current week
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return checkInDate >= monday && checkInDate <= sunday
}
