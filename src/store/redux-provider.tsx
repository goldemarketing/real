"use client";

import { Provider } from "react-redux";
// تأكد إن ملف الستور بتاعك اسمه store.ts وموجود في نفس الفولدر
import { store } from "./store"; 

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}