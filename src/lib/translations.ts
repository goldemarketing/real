export const translations = {
  en: {
    // Navbar
    home: "Home",
    search: "Search",
    newLaunches: "New Launches",
    developers: "Developers",
    sellProperty: "Sell Your Property",
    aboutUs: "About Us",
    blog: "Blog",
    contact: "Contact",
    
    // Buttons
    callUs: "Call Us Now",
    whatsapp: "WhatsApp",
    viewDetails: "View Details",
    
    // General
    loading: "Loading...",
    error: "Error",
    featured: "Featured",
    project: "Project",
  },
  ar: {
    // Navbar
    home: "الرئيسية",
    search: "بحث",
    newLaunches: "أحدث المشروعات",
    developers: "المطورين",
    sellProperty: "اعرض عقارك",
    aboutUs: "من نحن",
    blog: "المقالات",
    contact: "تواصل معنا",
    
    // Buttons
    callUs: "اتصل بنا الآن",
    whatsapp: "واتساب",
    viewDetails: "التفاصيل",
    
    // General
    loading: "جاري التحميل...",
    error: "خطأ",
    featured: "متميز",
    project: "مشروع",
  }
};

export type Language = 'en' | 'ar';
export type TranslationKey = keyof typeof translations.en;