"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image"; 
import { usePathname } from "next/navigation";
import { Menu, Home, Rocket, Tag, Info, Newspaper, Mail, Building, Search, Globe } from "lucide-react";
// 👇 استيراد هوك اللغة ومكون التبديل
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "./language-switcher";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../theme-toggle";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const [scrollY, setScrollY] = React.useState(0);
  const isHomePage = pathname === '/';
  
  // 👇 1. استخدام Context اللغة بدلاً من State محلي
  const { t, language, setLanguage } = useLanguage();

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 👇 2. نقلنا الروابط هنا لتفعيل الترجمة t()
  const navLinks = [
    { href: "/", label: t('home'), icon: Home },
    { href: "/search", label: t('search'), icon: Search },
    { href: "/new-launches", label: t('newLaunches'), icon: Rocket },
    { href: "/developers", label: t('developers'), icon: Building },
    { href: "/sell-my-property", label: t('sellProperty'), icon: Tag },
    { href: "/about", label: t('aboutUs'), icon: Info },
    { href: "/blog", label: t('blog'), icon: Newspaper },
    { href: "/contact", label: t('contact'), icon: Mail },
  ];

  const mobileBottomNavLinks = [
    { href: "/", label: t('home'), icon: Home },
    { href: "/search", label: t('search'), icon: Search },
    { href: "/developers", label: t('developers'), icon: Building },
    { href: "/sell-my-property", label: "Sell", icon: Tag }, // كلمة قصيرة للموبايل
  ];
  
  const isTransparent = isHomePage && scrollY < 50;
  const barStyles = isTransparent ? 'bg-black/30 backdrop-blur-sm' : 'bg-background/95 shadow-lg';
  
  return (
    <>
      {/* Desktop Header */}
      <header className={cn(
          "sticky top-0 z-50 w-full hidden md:block transition-colors duration-300 py-2",
      )}>
        <div className="container mx-auto">
          <div className={cn(
              "flex h-16 w-full items-center rounded-2xl px-4 transition-all duration-300",
              barStyles
          )}>
            {/* Left Side: Logo Section */}
            <div className="flex-1 justify-start">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo.png"  // تأكد أن الاسم في public هو logo.png
                  alt="4 Seasons"
                  width={93}
                  height={15} 
                  className="object-contain mt-2"
                  priority 
                />
              </Link>
            </div>

            {/* Centered Navigation */}
            <nav className="flex-shrink-0">
              <div className="flex items-center justify-center gap-1.5">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href} // غيرنا المفتاح لـ href لتجنب تكرار الأسماء عند الترجمة
                    href={href}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-2 py-2 text-sm font-medium transition-colors",
                      {
                        'bg-primary/10 text-primary': pathname === href && !isTransparent,
                        'bg-white/20 text-white font-semibold': pathname === href && isTransparent,
                        'text-white hover:text-white hover:bg-white/10': pathname !== href && isTransparent,
                         'text-muted-foreground hover:text-primary': pathname !== href && !isTransparent,
                      }
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Right Side: Tools */}
            <div className="flex flex-1 items-center justify-end gap-2">
                <ThemeToggle isTransparent={isTransparent}/>
                
                {/* 👇 3. استبدلنا الزر اليدوي بمكون LanguageSwitcher */}
                <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-50 h-16 rounded-2xl border border-border/40 bg-background/80 backdrop-blur-md shadow-lg overflow-hidden">
        <nav className="flex h-full items-center justify-around text-muted-foreground">
          {mobileBottomNavLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col flex-1 items-center justify-center gap-1 p-1 text-xs font-medium transition-colors",
                pathname === href ? "text-primary" : "hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
          {/* More Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col flex-1 items-center justify-center gap-1 p-1 text-xs font-medium transition-colors hover:text-primary">
                <Menu className="h-5 w-5" />
                <span>More</span>
              </button>
            </SheetTrigger>
              <SheetContent side="bottom" className="p-0 bg-background h-auto max-h-[85vh] rounded-t-2xl flex flex-col">
                <SheetHeader className="p-4 border-b text-left flex flex-row justify-between items-center">
                  <SheetTitle>
                      <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
                        <Image 
                          src="/logo.png" 
                          alt="4 Seasons"
                          width={120} 
                          height={40} 
                          className="object-contain"
                        />
                      </Link>
                  </SheetTitle>
                  <ThemeToggle />
                </SheetHeader>
                <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {/* زر تغيير اللغة للموبايل */}
                  <Button 
                    variant="outline" 
                    onClick={()=>{
                        setLanguage(language === "en" ? "ar" : "en"); // استخدام دالة الـ context
                        setOpen(false);
                    }} 
                    className="w-full"
                  >
                    <Globe className="mr-2 h-5 w-5" />
                    Switch to {language === "en" ? "العربية" : "English"}
                  </Button>

                  {navLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary p-3 rounded-md",
                        pathname === href ? "bg-primary/10 text-primary" : "text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
          </Sheet>
        </nav>
      </div>
    </>
  );
}