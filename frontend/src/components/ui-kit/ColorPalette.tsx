interface Props {
  colors: string[];
  size?: "sm" | "md" | "lg";
  labels?: boolean;
}
export function ColorPalette({ colors, size = "md", labels = false }: Props) {
  const dim = size === "sm" ? "h-6 w-6" : size === "lg" ? "h-12 w-12" : "h-9 w-9";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {colors.map((c) => (
        <div key={c} className="flex flex-col items-center gap-1">
          <span
            className={`${dim} rounded-full ring-1 ring-border shadow-soft`}
            style={{ background: c }}
            title={c}
          />
          {labels && <span className="text-[10px] text-muted-foreground">{c}</span>}
        </div>
      ))}
    </div>
  );
}
