import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Course = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  price: number | null;
  affiliate_url: string | null;
  category_id: string | null;
  featured: boolean;
  published: boolean;
  is_demo: boolean;
};
export type Category = { id: string; name: string; slug: string; sort_order: number };

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const { data, error } = await supabase.from("categories").select("*").order("sort_order");
    if (error) throw error;
    return data as Category[];
  },
});

export const coursesQuery = queryOptions({
  queryKey: ["courses"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Course[];
  },
});

export const formatPrice = (p: number | null) =>
  p == null ? null : Number(p).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function isSafeUrl(u: string | null | undefined) {
  if (!u) return false;
  try {
    const url = new URL(u);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

// Privacy-friendly tracking: no cookies, no IP, no personal data.
export function trackEvent(type: "view" | "click", opts: { path?: string; courseId?: string } = {}) {
  if (typeof window === "undefined") return;
  void supabase
    .from("events")
    .insert({ type, path: opts.path?.slice(0, 290) ?? null, course_id: opts.courseId ?? null })
    .then(() => {});
}
