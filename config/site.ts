export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL,
  name: "St Patrick's College",
  description: "A website for Mbatha Melusi",
  author: {
    name: "Mbatha Melusi",
    email: "mbathamelusi@gmail.com",
    url: "https://mbathamelusi.co.za",
  },
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contact",
      href: "/contact",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Inventory",
      href: "/inventory",
    },
    {
      title: "Admin",
      href: "/admin",
    },

  ],
  links: {
    x: "https://x.com/mbatha_melusie",
    github: "https://github.com/MbathaM",
  },

};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}
