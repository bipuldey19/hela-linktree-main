import Image from "next/image";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  image: string | null;
  logo: string | null;
}

export default function HeroSection({
  title,
  subtitle,
  description,
  image,
  logo,
}: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background */}
      {image ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt=""
            fill
            unoptimized={image.startsWith("http")}
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-background" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-linear-to-b from-primary via-primary/70 to-background" />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-5 pt-16 pb-8 sm:pt-20 sm:pb-10">
        {/* Logo with ring */}
        {logo && (
          <div className="animate-scale-in mb-5">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-white/90 shadow-xl shadow-black/10">
              <Image
                src={logo}
                alt={title}
                width={128}
                height={128}
                unoptimized={logo.startsWith("http")}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Site name */}
        <h1
          className="animate-fade-in-up text-2xl sm:text-3xl font-bold tracking-tight text-center text-white drop-shadow-lg"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>

        {/* Subtitle - short tagline under the title */}
        {subtitle && (
          <p className="animate-fade-in-up stagger-2 mt-3 text-sm sm:text-[15px] max-w-sm mx-auto text-center leading-relaxed text-white/85 drop-shadow-sm">
            {subtitle}
          </p>
        )}
      </div>

      {/* Site description card - displayed after hero texts */}
      {description && (
        <div className="relative z-10 px-5 pb-4">
          <div className="animate-fade-in-up stagger-3 max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-xl border border-stone-200/60 px-5 py-4 shadow-sm">
            <p className="text-center text-[15px] font-medium text-stone-700 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
