import { Link } from 'react-router-dom'
import { usePartnership } from '../../hooks/usePartnership'
import { useCheckIns } from '../../hooks/useCheckIns'
import { TrendChart } from './TrendChart'
import { StatsCards } from './StatsCards'
import { BattleStatus } from './BattleStatus'
import { HALTChart } from './HALTChart'
import { TriggerPatterns } from './TriggerPatterns'
import { WinsHighlight } from './WinsHighlight'
import { WeeklyComparison } from './WeeklyComparison'
import { RecentCheckIns } from './RecentCheckIns'
import { UpcomingChallenges } from './UpcomingChallenges'

export function Dashboard() {
  const { partnership, loading: partnershipLoading } = usePartnership()
  const { checkIns, loading: checkInsLoading } = useCheckIns(partnership?.id)

  if (partnershipLoading || checkInsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!partnership) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🤝</div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Welcome to Hurdle</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">You need to set up a partnership to get started.</p>
        <Link
          to="/settings"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Set Up Partnership
        </Link>
      </div>
    )
  }

  const lastCheckIn = checkIns[0]
  const daysSinceLastCheckIn = lastCheckIn
    ? Math.floor((Date.now() - new Date(lastCheckIn.check_in_date).getTime()) / (1000 * 60 * 60 * 24))
    : null

  const checkInsDue = daysSinceLastCheckIn === null || daysSinceLastCheckIn >= 3

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Partnership with {partnership.friend?.full_name || partnership.partner?.full_name}
          </p>
        </div>
        <div className="flex gap-3">
          {checkInsDue && (
            <Link
              to="/check-in"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 animate-pulse flex items-center gap-2"
            >
              <span>📝</span> New Check-In Due!
            </Link>
          )}
          {!checkInsDue && (
            <Link
              to="/check-in"
              className="px-4 py-2 border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              New Check-In
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards checkIns={checkIns} daysSinceLastCheckIn={daysSinceLastCheckIn} />

      {/* Main Content Grid */}
      {checkIns.length > 0 ? (
        <>
          {/* Row 1: Trends & Weekly Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 overflow-hidden">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">📈 Trends Over Time</h2>
              <div className="overflow-hidden">
                <TrendChart checkIns={checkIns} />
              </div>
            </div>
            <WeeklyComparison checkIns={checkIns} />
          </div>

          {/* Row 2: Battle Status & HALT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BattleStatus checkIns={checkIns} />
            <HALTChart checkIns={checkIns} />
          </div>

          {/* Row 3: Trigger Patterns */}
          <TriggerPatterns checkIns={checkIns} />

          {/* Row 4: Wins & Looking Ahead */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WinsHighlight checkIns={checkIns} />
            <UpcomingChallenges checkIns={checkIns} />
          </div>

          {/* Row 5: Recent Check-Ins */}
          <RecentCheckIns checkIns={checkIns} />
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">No check-ins yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start your first check-in to see your dashboard come to life with insights and trends.
          </p>
          <Link
            to="/check-in"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Start First Check-In
          </Link>
        </div>
      )}
    </div>
  )
}
