import LinkCard from "./LinkCard";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  logoImage: string | null;
  color: string | null;
}

export default function LinkList({ links }: { links: LinkItem[] }) {
  if (links.length === 0) return null;

  return (
    <section className="max-w-md mx-auto px-5 py-6 space-y-3">
      {links.map((link, i) => (
        <div
          key={link.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${0.15 + i * 0.06}s` }}
        >
          <LinkCard
            title={link.title}
            url={link.url}
            icon={link.icon}
            logoImage={link.logoImage}
            color={link.color}
          />
        </div>
      ))}
    </section>
  );
}
