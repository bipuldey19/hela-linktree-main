import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "h1",
  "h2",
  "h3",
  "p",
  "br",
  "strong",
  "em",
  "u",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "pre",
  "code",
];

const ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "width",
  "height",
  "class",
];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}
