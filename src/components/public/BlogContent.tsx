export default function BlogContent({ html }: { html: string }) {
  return (
    <article
      className="prose max-w-3xl mx-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
