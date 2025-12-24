"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

// لاحظ: شيلنا سطر الـ import الغلط اللي كان هنا

export default function DeleteButton({ id, endpointName }: { id: string, endpointName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("You are not logged in!");
        return;
      }

      await axios.delete(`https://4seasons-realestate.com/api/admin/${endpointName}/${id}/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      
      router.refresh(); 
      
    } catch (error: any) {
      console.error(error);
      alert("Failed to delete item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
        variant="destructive" 
        size="sm" 
        onClick={handleDelete} 
        disabled={loading}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};