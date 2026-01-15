import Link from "next/link";

interface CategoryCardProps {
  icon: string;
  title: string;
  count: number;
  href: string;
  delay?: string; // optional animation delay class
}

export default function CategoryCard({
  icon,
  title,
  count,
  href,
  delay = "",
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={`pet-card bg-card-bg rounded-2xl p-6 border border-card-border text-center animate-fade-up opacity-0 ${delay}`}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-muted">{count} зарлал</p>
    </Link>
  );
}
