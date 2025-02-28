
const manifestForPlugIn = {
  registerType: "prompt" as const,
  includeAssests: ["favicon.ico", "apple-touc-icon.png", "masked-icon.svg"],
  manifest: {
    name: "Sleep2Earn",
    short_name: "Sleep2Earn",
    description: "Take Sleep, Get Paid",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "favicon",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "favicon",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
      {
        src: "/maskable_icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    theme_color: "#1E65FA",
    background_color: "#020617",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

export default manifestForPlugIn;