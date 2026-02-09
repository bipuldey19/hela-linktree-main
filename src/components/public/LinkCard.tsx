import Image from "next/image";

interface LinkCardProps {
  title: string;
  url: string;
  icon: string | null;
  logoImage: string | null;
  color: string | null;
}

export default function LinkCard({
  title,
  url,
  icon,
  logoImage,
  color,
}: LinkCardProps) {
  const bgColor = color || "var(--color-primary)";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center w-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] shadow-md"
      style={{ backgroundColor: bgColor }}
    >
      {/* Subtle shine overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Logo circle */}
      {logoImage ? (
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-white/25 shrink-0 ml-2 my-2">
          <Image
            src={logoImage}
            alt={title}
            width={56}
            height={56}
            unoptimized={logoImage.startsWith("http")}
            className="w-full h-full object-cover"
          />
        </div>
      ) : icon ? (
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 ml-2 my-2 text-xl">
          {icon}
        </div>
      ) : null}

      {/* Title */}
      <span className="relative flex-1 text-center text-white font-semibold text-[15px] py-4 px-4 tracking-wide">
        {title}
      </span>

      {/* Spacer for balance */}
      {(logoImage || icon) && (
        <div className="w-12 sm:w-14 shrink-0 mr-2" />
      )}

      {/* Arrow indicator */}
      <svg
        className="absolute right-4 w-4 h-4 text-white/40 group-hover:text-white/70 transition-all duration-300 group-hover:translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}
