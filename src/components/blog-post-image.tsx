'use client';

// رابط السيرفر المحلي
const DOMAIN_URL = 'https://4seasons-realestate.com';

interface BlogPostImageProps {
  src: string | null | undefined;
  alt: string;
}

export function BlogPostImage({ src, alt }: BlogPostImageProps) {
  
  // دالة تصحيح الرابط
  const getFullUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${DOMAIN_URL}${cleanPath}`;
  };

  const finalSrc = getFullUrl(src);

  if (!finalSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
        No Image Available
      </div>
    );
  }

  return (
    <img
      src={finalSrc}
      alt={alt}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        // ممكن تظهر رسالة خطأ أو صورة بديلة هنا
        e.currentTarget.parentElement!.style.backgroundColor = '#f3f4f6';
      }}
    />
  );
}