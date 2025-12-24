'use client'; // ضروري عشان نقدر نستخدم useEffect

import { useState, useEffect } from 'react';

export default function CompoundsList() {
  const [compounds, setCompounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. رابط الـ API بتاعك (تأكد من البورت)
    const apiUrl = 'https://4seasons-realestate.com/api/compounds/'; 

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error('فشل الاتصال بالسيرفر');
        }
        return res.json();
      })
      .then((data) => {
        // لو الـ API بيرجع pagination (زي count, next, results) بناخد results بس
        // لو بيرجع array علطول، بناخد data
        const results = data.results ? data.results : data;
        setCompounds(results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">جاري التحميل...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">أحدث المشروعات</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {compounds.map((compound) => (
          <div key={compound.id} className="border rounded-lg overflow-hidden shadow-lg bg-white">
            
            {/* صورة المشروع */}
            <div className="h-48 overflow-hidden bg-gray-200 relative">
              <img 
                src={compound.main_image || '/placeholder.png'} 
                alt={compound.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
                onError={(e) => e.target.src = '/placeholder.png'} // حل سريع للصور المكسورة
              />
            </div>

            {/* تفاصيل المشروع */}
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{compound.name}</h3>
              
              {/* الموقع لو موجود */}
              {compound.location && (
                <p className="text-gray-600 text-sm mb-2">
                  📍 {compound.location.name}
                </p>
              )}

              {/* السعر */}
              <p className="text-blue-600 font-bold">
                {compound.min_price 
                  ? `يبدأ من: ${compound.min_price.toLocaleString()} جنيه` 
                  : 'السعر عند الطلب'}
              </p>

              {/* زرار التفاصيل */}
              <button className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                التفاصيل
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}