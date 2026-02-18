import { MetadataRoute } from "next";
import { createServiceClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://winpicks.online";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/picks`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vip`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/responsible-gambling`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  let pickRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = createServiceClient();
    const { data: picks } = await supabase
      .from("picks")
      .select("id, created_at")
      .eq("is_vip", false)
      .order("created_at", { ascending: false })
      .limit(500);

    if (picks) {
      pickRoutes = picks.map((pick) => ({
        url: `${baseUrl}/picks/${pick.id}`,
        lastModified: new Date(pick.created_at),
        changeFrequency: "daily" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Error fetching picks for sitemap:", error);
  }

  return [...staticRoutes, ...pickRoutes];
}
