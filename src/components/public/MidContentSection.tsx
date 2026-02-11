import Image from "next/image";
import Link from "next/link";

export interface MidContentBlock {
  id: string;
  image: string | null;
  headline: string;
  description: string;
  linkButtons: string;
}

function parseButtons(json: string): { label: string; url: string }[] {
  try {
    const arr = JSON.parse(json || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function MidContentSection({
  blocks,
}: {
  blocks: MidContentBlock[];
}) {
  if (blocks.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-5 py-12">
      <div className="space-y-16">
        {blocks.map((block, i) => (
          <article
            key={block.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {block.image && (
                <div className="relative w-full md:w-80 aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                  <Image
                    src={block.image}
                    alt={block.headline}
                    fill
                    unoptimized={block.image.startsWith("http")}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0 text-center md:text-left">
                <h2
                  className="text-2xl font-semibold text-stone-900 mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {block.headline}
                </h2>
                {block.description && (
                  <p className="text-stone-600 leading-relaxed mb-6">
                    {block.description}
                  </p>
                )}
                {(() => {
                  const buttons = parseButtons(block.linkButtons).filter(
                    (b) => b.label.trim() && b.url.trim()
                  );
                  if (buttons.length === 0) return null;
                  return (
                    <div className="flex flex-col gap-3 w-full max-w-md mx-auto md:mx-0">
                      {buttons.map((btn, j) => (
                        <Link
                          key={j}
                          href={btn.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-medium bg-primary text-white hover:opacity-90 transition-opacity"
                        >
                          {btn.label}
                        </Link>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
