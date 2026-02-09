import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>
      <PostForm
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          heroImage: post.heroImage,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          metaKeywords: post.metaKeywords,
          ogImage: post.ogImage,
          published: post.published,
        }}
      />
    </div>
  );
}
