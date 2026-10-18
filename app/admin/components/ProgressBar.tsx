export function ProgressBar({
  value,
  total,
  tone = "brand",
}: {
  value: number;
  total: number;
  tone?: "brand" | "gold";
}) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  const barColor = tone === "gold" ? "bg-gold" : "bg-brand";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ink/8">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[12px] text-ink/50">
        {value}/{total}
      </span>
    </div>
  );
}
