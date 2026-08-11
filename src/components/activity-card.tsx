import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { motion } from "motion/react";

const activities = [
  { id: 1, title: "New user registered", time: "2 min ago", type: "up" },
  { id: 2, title: "Order #1234 completed", time: "15 min ago", type: "up" },
  { id: 3, title: "Server response time increased", time: "1 hour ago", type: "down" },
  { id: 4, title: "Payment processed", time: "2 hours ago", type: "up" },
  { id: 5, title: "System update", time: "3 hours ago", type: "neutral" },
  { id: 6, title: "New subscription", time: "5 hours ago", type: "up" },
];

export function ActivityCard() {
  return (
    <motion.div
      className="p-6 bg-[#e2ede9] rounded-3xl
        shadow-[12px_12px_24px_#bdc9c4,-12px_-12px_24px_#ffffff] h-full"
      whileHover={{
        boxShadow: "16px 16px 32px #bdc9c4, -16px -16px 32px #ffffff"
      }}
    >
      <div className="mb-6">
        <h2 className="text-[#1d3a2f] mb-1">Recent Activity</h2>
        <p className="text-[#7a9a8d] text-sm">Latest updates</p>
      </div>

      <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            className="p-4 bg-[#e2ede9] rounded-2xl
              shadow-[6px_6px_12px_#bdc9c4,-6px_-6px_12px_#ffffff]
              transition-shadow cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{
              scale: 1.02,
              x: 5,
              boxShadow: "8px 8px 16px #bdc9c4, -8px -8px 16px #ffffff"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1 p-2 bg-[#e2ede9] rounded-xl
                shadow-[inset_3px_3px_6px_#bdc9c4,inset_-3px_-3px_6px_#ffffff]
                ${activity.type === "up" ? "text-[#009970]" :
                  activity.type === "down" ? "text-[#ef4444]" : "text-[#4a7268]"}`}>
                {activity.type === "up" && <ArrowUpRight className="w-4 h-4" />}
                {activity.type === "down" && <ArrowDownRight className="w-4 h-4" />}
                {activity.type === "neutral" && <Minus className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-[#1d3a2f] text-sm mb-1">{activity.title}</p>
                <p className="text-[#7a9a8d] text-xs">{activity.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
