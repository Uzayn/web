import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/account",
          "/api",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: "https://winpicks.online/sitemap.xml",
  };
}
