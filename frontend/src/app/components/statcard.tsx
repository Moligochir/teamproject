interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string; // Tailwind color classes, e.g., "bg-primary"
}

export default function StatCard({ icon, value, label, color }: StatCardProps) {
  return (
    <div className="bg-card-bg rounded-2xl p-6 border border-card-border animate-fade-up opacity-0 stagger-2 ">
      <div
        className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-muted">{label}</div>
    </div>
  );
}
