"use client";

import { Provider } from "react-redux";
// 👇 عدلنا المسار هنا عشان يجيب الستور من مكانه الصح
import { store } from "@/store/store"; 

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}