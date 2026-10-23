import { cn, initials } from "@/lib/utils";

const palettes = [
  "bg-[#FFE8A8] text-[#7D5A0E] ring-[#E7C45E]",
  "bg-[#E8EFCF] text-[#53652C] ring-[#C9D9A2]",
  "bg-[#F7E4CB] text-[#84552A] ring-[#E9C9A3]",
  "bg-[#E7F1F2] text-[#416B73] ring-[#C7DFE3]",
];

function paletteFor(name: string) {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash + name.charCodeAt(index) * (index + 1)) % 997;
  }
  return palettes[hash % palettes.length] ?? palettes[0]!;
}

export function Avatar({
  name,
  image,
  size = "md",
  className,
}: {
  name: string;
  image?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    xs: "size-7 text-[0.6rem]",
    sm: "size-9 text-[0.7rem]",
    md: "size-11 text-xs",
    lg: "size-16 text-lg",
  };

  const palette = paletteFor(name);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-black ring-2 ring-white/80",
        sizes[size],
        palette,
        className,
      )}
      title={name}
      aria-label={name}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}
