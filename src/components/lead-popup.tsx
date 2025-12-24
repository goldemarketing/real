'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitContactForm } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageCircle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
});

export function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const ADMIN_WHATSAPP = "201015670391"; 

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    // تشغيل مباشر للاختبار (بدون تايمر وبدون شروط)
    setOpen(true);
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // 1. حفظ البيانات في الباك إند
      await submitContactForm({
        name: data.name,
        phone: data.phone,
        email: 'whatsapp-lead@no-email.com',
        message: 'Lead from Popup (Redirected to WhatsApp)',
      });

      localStorage.setItem('lead_submitted', 'true');
      setOpen(false);

      toast({
        title: "جاري التحويل للواتساب...",
        description: "سيتم فتح المحادثة الآن.",
      });

      // 2. فتح الواتساب
      const message = `أهلاً، أنا مهتم بمشروعات 4 Seasons.\n\nالاسم: ${data.name}\nرقمي: ${data.phone}`;
      const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');

    } catch (error) {
      console.error(error);
      toast({
        title: "خطأ",
        description: "حدث خطأ، يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px] text-center">
        <DialogHeader>
          <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-2">
            <MessageCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold font-headline">تواصل معنا عبر واتساب</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            سجل بياناتك وسيتم تحويلك فوراً لمحادثة واتساب مع أحد مستشارينا العقاريين.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-2 text-right">
            <Input 
              placeholder="الاسم بالكامل" 
              {...register('name')} 
              className="text-right"
            />
            {errors.name && <p className="text-red-500 text-xs">{(errors.name as any).message}</p>}
          </div>

          <div className="space-y-2 text-right">
            <Input 
              placeholder="رقم الهاتف / الواتساب" 
              type="tel"
              {...register('phone')} 
              className="text-right"
            />
            {errors.phone && <p className="text-red-500 text-xs">{(errors.phone as any).message}</p>}
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : (
              <span className="flex items-center gap-2">
                إرسال ومتابعة عبر واتساب <MessageCircle className="h-4 w-4" />
              </span>
            )}
          </Button>
          
          <p className="text-[10px] text-muted-foreground">
            بضغطك على إرسال، أنت توافق على سياسة الخصوصية.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}