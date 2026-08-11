import { motion } from "motion/react";
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react";

const transactions = [
  {
    id: 1,
    merchant: "Apple Inc.",
    initial: "A",
    bg: "#1d3a2f",
    date: "Apr 06, 2023",
    amount: "$125,500.00",
    change: "-$626.00",
    positive: true,
  },
  {
    id: 2,
    merchant: "Nike",
    initial: "N",
    bg: "#009970",
    date: "Jun 02, 2023",
    amount: "$2,500.00",
    change: "-$23.00",
    positive: true,
  },
  {
    id: 3,
    merchant: "Spotify",
    initial: "S",
    bg: "#00c4a0",
    date: "Apr 04, 2023",
    amount: "-$300.00",
    change: "-$35.50",
    positive: false,
  },
  {
    id: 4,
    merchant: "Microsoft",
    initial: "M",
    bg: "#007a5e",
    date: "Jun 04, 2023",
    amount: "-$120.00",
    change: "-$18.50",
    positive: false,
  },
  {
    id: 5,
    merchant: "Amazon",
    initial: "A",
    bg: "#4a7268",
    date: "May 10, 2023",
    amount: "-$120.00",
    change: "-$13.00",
    positive: false,
  },
  {
    id: 6,
    merchant: "Google",
    initial: "G",
    bg: "#00d4ab",
    date: "May 18, 2023",
    amount: "$8,200.00",
    change: "+$410.00",
    positive: true,
  },
];

export function TransactionsHistory() {
  return (
    <motion.div
      className="p-6 bg-[#e2ede9] rounded-3xl
        shadow-[12px_12px_24px_#bdc9c4,-12px_-12px_24px_#ffffff]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      whileHover={{ boxShadow: "16px 16px 32px #bdc9c4, -16px -16px 32px #ffffff" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[#7a9a8d] text-xs font-medium uppercase tracking-wider mb-1">Recent</p>
          <h3 className="text-[#1d3a2f] text-xl font-bold">Transactions History</h3>
        </div>
        <motion.button
          className="p-2 bg-[#e2ede9] rounded-xl
            shadow-[4px_4px_8px_#bdc9c4,-4px_-4px_8px_#ffffff]"
          whileHover={{ scale: 1.1, boxShadow: "6px 6px 12px #bdc9c4, -6px -6px 12px #ffffff" }}
          whileTap={{ boxShadow: "inset 3px 3px 6px #bdc9c4, inset -3px -3px 6px #ffffff" }}
        >
          <MoreHorizontal className="w-4 h-4 text-[#4a7268]" />
        </motion.button>
      </div>

      {/* Column labels */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-2 mb-3">
        {["Merchant", "Date", "Amount", "Change"].map((h) => (
          <p key={h} className="text-[#7a9a8d] text-xs font-medium uppercase tracking-wider">{h}</p>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {transactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 items-center
              p-3 bg-[#e2ede9] rounded-2xl cursor-pointer
              shadow-[4px_4px_8px_#bdc9c4,-4px_-4px_8px_#ffffff]"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 + index * 0.08 }}
            whileHover={{
              x: 4,
              boxShadow: "6px 6px 14px #bdc9c4, -6px -6px 14px #ffffff",
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Merchant */}
            <div className="flex items-center gap-3">
              <motion.div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0
                  shadow-[inset_2px_2px_4px_rgba(255,255,255,0.2)]"
                style={{ backgroundColor: tx.bg }}
                whileHover={{ rotate: [0, -6, 6, 0] }}
                transition={{ duration: 0.4 }}
              >
                {tx.initial}
              </motion.div>
              <p className="text-[#1d3a2f] text-sm font-semibold truncate">{tx.merchant}</p>
            </div>

            {/* Date */}
            <p className="text-[#7a9a8d] text-xs">{tx.date}</p>

            {/* Amount */}
            <p className={`text-sm font-semibold ${tx.positive ? "text-[#009970]" : "text-[#1d3a2f]"}`}>
              {tx.amount}
            </p>

            {/* Change badge */}
            <div className="flex items-center">
              <motion.span
                className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-semibold
                  bg-[#e2ede9] shadow-[inset_2px_2px_4px_#bdc9c4,inset_-2px_-2px_4px_#ffffff]
                  ${tx.positive ? "text-[#009970]" : "text-[#ef4444]"}`}
                whileHover={{ scale: 1.05 }}
              >
                {tx.positive
                  ? <ArrowUpRight className="w-3 h-3" />
                  : <ArrowDownRight className="w-3 h-3" />}
                {tx.change}
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
