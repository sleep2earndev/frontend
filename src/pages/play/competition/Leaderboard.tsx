import FadeWrapper from '@/components/animation/fade'
import { Crown, Medal, Trophy } from "lucide-react"
import { motion } from "motion/react"

interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  ethEarned: number
  isCurrentUser?: boolean
}

const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Sarah Wilson",
    avatar: "https://i.pravatar.cc/200",
    ethEarned: 1.245,
  },
  {
    rank: 2,
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/190",
    ethEarned: 1.142,
  },
  {
    rank: 3,
    name: "Emma Thompson",
    avatar: "https://i.pravatar.cc/180",
    ethEarned: 0.987,
  },
  {
    rank: 4,
    name: "James Rodriguez",
    avatar: "https://i.pravatar.cc/170",
    ethEarned: 0.876,
  },
  {
    rank: 5,
    name: "Alex Morgan",
    avatar: "https://i.pravatar.cc/160",
    ethEarned: 0.754,
    isCurrentUser: false,
  },
  {
    rank: 6,
    name: "Lisa Park",
    avatar: "https://i.pravatar.cc/150",
    ethEarned: 0.721,
  },
  {
    rank: 7,
    name: "David Kim",
    avatar: "https://i.pravatar.cc/140",
    ethEarned: 0.654,
  },
  {
    rank: 8,
    name: "Sophie Martin",
    avatar: "https://i.pravatar.cc/130",
    ethEarned: 0.543,
  },
  {
    rank: 9,
    name: "Tom Anderson",
    avatar: "https://i.pravatar.cc/120",
    ethEarned: 0.432,
  },
  {
    rank: 10,
    name: "Maria Garcia",
    avatar: "https://i.pravatar.cc/110",
    ethEarned: 0.321,
  },
]

const getTopThreeStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return {
        background: "from-yellow-500/30 to-yellow-500/5",
        border: "ring-2 ring-yellow-400/50",
        glow: "shadow-lg shadow-yellow-500/20",
        icon: "text-yellow-400",
      }
    case 2:
      return {
        background: "from-slate-400/30 to-slate-400/5",
        border: "ring-2 ring-slate-300/50",
        glow: "shadow-lg shadow-slate-500/20",
        icon: "text-slate-300",
      }
    case 3:
      return {
        background: "from-amber-700/30 to-amber-700/5",
        border: "ring-2 ring-amber-600/50",
        glow: "shadow-lg shadow-amber-700/20",
        icon: "text-amber-600",
      }
    default:
      return {
        background: "",
        border: "",
        glow: "",
        icon: "",
      }
  }
}


export default function LeaderBoardPage() {
  // Reorder top 3 for display (2nd, 1st, 3rd)
  const winner = leaderboardData[0]
  const runnerUp = leaderboardData[1]
  const thirdPlace = leaderboardData[2]
  const restOfBoard = leaderboardData.slice(3)

  return (
    <FadeWrapper className="flex flex-1 flex-col items-center justify-center bg-[#061029] bg-gradient-to-b from-background to-background/95 p-4 text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl pb-32"
      >
        <div className="pb-4">
          <h2 className="text-center text-2xl font-bold">Sleep Champions</h2>
          <p className="text-center text-sm text-white/70">Top 10 Sleep Performers</p>
        </div>
        {/* Top 3 Podium */}
        <div className="relative mb-16 mt-8">
          {/* Runner Up - Left */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-12 w-[30%]"
          >
            <div
              className={`relative rounded-xl bg-gradient-to-br ${getTopThreeStyle(2).background} ${getTopThreeStyle(2).border} ${getTopThreeStyle(2).glow} p-4`}
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={runnerUp.avatar || "/placeholder.svg"}
                    alt={runnerUp.name}
                    className={`h-16 w-16 rounded-full object-cover ${getTopThreeStyle(2).border}`}
                  />
                  <Medal className={`absolute -right-1 -top-1 h-6 w-6 ${getTopThreeStyle(2).icon}`} />
                </div>
                <p className="mt-2 text-center font-medium">{runnerUp.name}</p>
                <div className="mt-1 text-center text-sm">
                  <span className="text-primary">{runnerUp.ethEarned} ETH</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Winner - Center */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mx-auto w-[35%]"
          >
            <div
              className={`relative rounded-xl bg-gradient-to-br ${getTopThreeStyle(1).background} ${getTopThreeStyle(1).border} ${getTopThreeStyle(1).glow} p-6`}
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={winner.avatar || "/placeholder.svg"}
                    alt={winner.name}
                    className={`h-20 w-20 rounded-full object-cover ${getTopThreeStyle(1).border}`}
                  />
                  <Crown className={`absolute -right-1 -top-1 h-8 w-8 ${getTopThreeStyle(1).icon}`} />
                </div>
                <p className="mt-3 text-center text-lg font-medium">{winner.name}</p>
                <div className="mt-1 text-center">
                  <span className="text-lg font-semibold text-primary">{winner.ethEarned} ETH</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Third Place - Right */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute right-0 top-12 w-[30%]"
          >
            <div
              className={`relative rounded-xl bg-gradient-to-br ${getTopThreeStyle(3).background} ${getTopThreeStyle(3).border} ${getTopThreeStyle(3).glow} p-4`}
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={thirdPlace.avatar || "/placeholder.svg"}
                    alt={thirdPlace.name}
                    className={`h-16 w-16 rounded-full object-cover ${getTopThreeStyle(3).border}`}
                  />
                  <Trophy className={`absolute -right-1 -top-1 h-6 w-6 ${getTopThreeStyle(3).icon}`} />
                </div>
                <p className="mt-2 text-center font-medium">{thirdPlace.name}</p>
                <div className="mt-1 text-center text-sm">
                  <span className="text-primary">{thirdPlace.ethEarned} ETH</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="mb-4 border-t border-white/10" />

        {/* Rest of Leaderboard */}
        <div className="space-y-2">
          {restOfBoard.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              className={`relative overflow-hidden rounded-lg transition-colors hover:bg-white/5 ${entry.isCurrentUser ? "ring-1 ring-primary" : ""
                }`}
            >
              <div className="flex items-center gap-3 p-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center font-semibold">
                  {entry.rank}
                </div>
                <div className="flex flex-1 items-center gap-3">
                  <img
                    src={entry.avatar || "/placeholder.svg"}
                    alt={entry.name}
                    className="h-10 w-10 rounded-full bg-white/10 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{entry.name}</p>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <div className="flex items-center gap-1">
                        <span className="text-primary">{entry.ethEarned}</span> ETH
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {entry.isCurrentUser && <div className="absolute inset-y-0 right-0 w-1 bg-primary" />}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </FadeWrapper>
  )
}
