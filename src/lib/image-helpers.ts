const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// دالة مساعدة لاستخراج الـ Origin (مثل http://localhost:8000)
// نستخدم localhost دائماً لتجنب مشاكل Next.js مع 127.0.0.1
const getBaseUrl = () => {
  const url = new URL(API_BASE_URL);
  if (url.hostname === '127.0.0.1') {
    url.hostname = 'localhost';
  }
  return url.origin;
};

const API_ORIGIN = getBaseUrl();

export function getImageUrl(imagePath: string | null | undefined, fallback?: string): string {
  if (!imagePath) return fallback || 'https://placehold.co/800x600.png';
  
  // لو الرابط كامل وجاهز
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // إصلاح المشكلة هنا: لو الرابط جاي من الداتابيز 127.0.0.1 نحوله localhost
  return imagePath.replace('127.0.0.1', '4seasons-realestate.com').replace('http://', 'https://');
  }
  
  // تنظيف المسارات
  let normalizedPath = imagePath.replace(/\\/g, '/');

  if (normalizedPath.startsWith('/api/')) {
    normalizedPath = normalizedPath.replace(/^\/api\/+/i, '/');
  }

  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`;
  }

  normalizedPath = normalizedPath.replace(/\/+/g, '/');

  // إضافة /media/ لو مش موجودة
  if (!normalizedPath.startsWith('/media/')) {
     normalizedPath = `/media${normalizedPath}`;
  }

  return `${API_ORIGIN}${normalizedPath}`;
}

export function getPlaceholderImage(type: 'property' | 'compound' | 'developer' | 'blog' | 'author' | 'partner'): string {
  const placeholders = {
    property: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&h=600&fit=crop',
    compound: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&h=600&fit=crop',
    developer: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&h=600&fit=crop',
    blog: 'https://images.unsplash.com/photo-1560518883-ce09059ee41f?q=80&w=800&h=600&fit=crop',
    author: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&fit=crop',
    partner: 'https://images.unsplash.com/photo-1611108018339-b7b5391c6e43?q=80&w=150&h=80&fit=crop',
  };
  return placeholders[type];
}

export function formatPrice(price: string | number): string {
  if (typeof price === 'number') {
    return `EGP ${price.toLocaleString()}`;
  }
  const numericPrice = parseFloat(price);
  if (!isNaN(numericPrice)) {
    return `EGP ${numericPrice.toLocaleString()}`;
  }
  return price;
}

export function getLocationName(location: string | { name: string } | null | undefined): string {
  if (!location) return 'N/A';
  if (typeof location === 'string') return location;
  return location.name || 'N/A';
}

export function getDeveloperName(developer: string | { name: string } | null | undefined): string {
  if (!developer) return 'N/A';
  if (typeof developer === 'string') return developer;
  return developer.name || 'N/A';
}

export function getCompoundName(compound: string | { name: string } | null | undefined): string {
  if (!compound) return 'N/A';
  if (typeof compound === 'string') return compound;
  return compound.name || 'N/A';
}
