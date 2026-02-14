export default function UrgencyBadge({ date, status }) {
  // Don't show badges for completed applications
  if (status === 'Offer' || status === 'Rejected') return null;

  const appliedDate = new Date(date);
  const today = new Date();
  
  // Calculate difference in days
  const diffTime = Math.abs(today - appliedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  let config = { label: 'Recent', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
  
  if (diffDays > 14) {
    config = { label: 'Stale', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
  } else if (diffDays > 7) {
    config = { label: 'Follow Up', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
  }

  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.color}`}>
      {config.label}
    </span>
  );
}