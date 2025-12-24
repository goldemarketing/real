import Link from "next/link";
import Image from "next/image";
import { WhatsappIcon } from "@/components/icons";
import { Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary/10 border-t border-primary/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* القسم الأول: اللوجو والوصف */}
          <div className="space-y-1">
            <Link href="/" className="inline-block">
               <Image 
                 src="/logo.png" 
                 alt="4 Seasons Real Estate" 
                 width={150}
                 height={10}
                 className="object-contain mb-1"
               />
            </Link>
            <p className="text-muted-foreground">Find your Dream Home with us. We are committed to providing the best properties and services.</p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/4seasonsrealestatee" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
              <Link href="https://www.instagram.com/4seasons.realestates" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
              <Link href="https://api.whatsapp.com/send?phone=201000175609" className="text-muted-foreground hover:text-primary"><WhatsappIcon className="h-6 w-6" /></Link>
            </div>
          </div>
          
          {/* باقي الأقسام */}
          <div>
            <h3 className="font-bold mb-4 font-headline">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/search" className="text-muted-foreground hover:text-primary">Find a Property</Link></li>
              <li><Link href="/new-launches" className="text-muted-foreground hover:text-primary">New Launches</Link></li>
              <li><Link href="/sell-my-property" className="text-muted-foreground hover:text-primary">Sell Your Property</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 font-headline">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 font-headline">Contact Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>18 Ezzat Salama, Nasr City, Cairo, Egypt</li>
              <li><Link href="mailto:contact@4seasons.com"> Email: contact@4seasons.com</Link></li>
              <li><Link href="tel:01015670391">Phone: +201015670391</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-muted-foreground mt-12 border-t border-primary/20 pt-8">
          &copy; {new Date().getFullYear()} 4 Seasons Real Estate. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}