export default function StatCard({ title, value, icon, color }) {
  // Dynamic color mapping for different stats
  const themeClasses = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400',
    purple: 'text-purple-600 bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800/50 dark:text-purple-400',
    green: 'text-green-600 bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400'
  };

  return (
    <div className={`bg-white bg-gradient-to-br from-slate-800 to-[#5459AC] p-5 rounded-3xl shadow-sm border transition-all duration-300 ${themeClasses[color] || themeClasses.blue}`}>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-inherit transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">
            {title}
          </p>
          <h2 className="text-2xl font-black tracking-tight dark:text-white transition-colors">
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
}