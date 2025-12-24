"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/lib/api";

export default function ContactPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || null,
      message: formData.get('message') as string,
    };

    try {
      await submitContactForm(data);

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });

      event.currentTarget.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:py-20">
      <div className="text-center mb-12">
        <div className="overflow-hidden py-1">
            <h1 className="text-4xl md:text-5xl font-bold font-headline animate-title-reveal">Get In Touch</h1>
        </div>
        <div className="overflow-hidden py-1">
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-title-reveal" style={{ animationDelay: '0.1s' }}>
              Have a question or ready to start your property journey? We're here to help.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Send Us a Message</CardTitle>
                    <CardDescription>Fill out the form and we'll get back to you shortly.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" placeholder="Your Name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone (Optional)</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="+20 123 456 7890" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" name="message" placeholder="Type your message here..." rows={5} required />
                        </div>
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            'Send Message'
                          )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div>
                 <div className="overflow-hidden py-1">
                    <h2 className="text-2xl font-bold font-headline mb-4 animate-title-reveal">Contact Information</h2>
                 </div>
                <div className="space-y-4 text-muted-foreground">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full mt-1">
                            <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Our Office</h3>
                            <p>18 Ezzat Salama,Nasr City, Cairo, Egypt</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full mt-1">
                            <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Email Us</h3>
                            <p>Admin@4seasons-realestate.com</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full mt-1">
                            <Phone className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Call Us</h3>
                            <p>+201015670391</p>
                        </div>
                    </div>
                </div>
            </div>
             <div>
                <div className="overflow-hidden py-1">
                    <h2 className="text-2xl font-bold font-headline mb-4 animate-title-reveal">Find Us On The Map</h2>
                </div>
                <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-md">
    <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.3671648100103!2d31.34054717428721!3d30.055008318072435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583ff5227cbdd1%3A0x50192f1b4bd6f410!2z2YHZiNixINiz2YrYstmI2YbYsiDZhNmE2YjYs9in2LfZhyDYp9mE2LnZgtin2LHZitip!5e0!3m2!1sen!2seg!4v1765377648883!5m2!1sen!2seg"
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen={true}
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Location map"
        className="w-full h-full object-cover"
    ></iframe>
</div>
            </div>
        </div>
      </div>
    </div>
  );
}
