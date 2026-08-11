import { Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const initialTasks = [
  { id: 1, title: "Review Q4 financial reports", completed: false },
  { id: 2, title: "Update product documentation", completed: true },
  { id: 3, title: "Schedule team meeting", completed: false },
  { id: 4, title: "Respond to customer feedback", completed: false },
  { id: 5, title: "Optimize database queries", completed: true },
];

export function TasksCard() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <motion.div
      className="p-6 bg-[#e2ede9] rounded-3xl
        shadow-[12px_12px_24px_#bdc9c4,-12px_-12px_24px_#ffffff]"
      whileHover={{
        boxShadow: "16px 16px 32px #bdc9c4, -16px -16px 32px #ffffff"
      }}
    >
      <div className="mb-6">
        <h2 className="text-[#1d3a2f] mb-1">Tasks</h2>
        <p className="text-[#7a9a8d] text-sm">Today's to-do list</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            className="p-4 bg-[#e2ede9] rounded-2xl
              shadow-[6px_6px_12px_#bdc9c4,-6px_-6px_12px_#ffffff]
              transition-shadow cursor-pointer"
            onClick={() => toggleTask(task.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{
              scale: 1.02,
              y: -3,
              boxShadow: "8px 8px 16px #bdc9c4, -8px -8px 16px #ffffff"
            }}
            whileTap={{
              scale: 0.98,
              boxShadow: "inset 4px 4px 8px #bdc9c4, inset -4px -4px 8px #ffffff"
            }}
          >
            <div className="flex items-start gap-3">
              <motion.div
                className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center transition-all
                  ${task.completed
                    ? "bg-[#e2ede9] shadow-[inset_3px_3px_6px_#bdc9c4,inset_-3px_-3px_6px_#ffffff]"
                    : "bg-[#e2ede9] shadow-[3px_3px_6px_#bdc9c4,-3px_-3px_6px_#ffffff]"
                  }`}
                animate={{
                  scale: task.completed ? [1, 1.2, 1] : 1,
                  rotate: task.completed ? [0, 10, 0] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence>
                  {task.completed && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Check className="w-4 h-4 text-[#009970]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <p className={`flex-1 text-sm text-[#1d3a2f] ${task.completed ? "line-through opacity-50" : ""}`}>
                {task.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
