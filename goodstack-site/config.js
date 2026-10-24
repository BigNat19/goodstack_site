// Central config: colors, shader, CTA, form endpoint, links, placeholder stories. Page copy lives in index.html.
window.SITE = {
  site: "thegoodstack.example",
  colors: { bg: "#F6F4EF", ink: "#121214", accent: "#4F46FF", tint: "#E3E2FF" },
  cta: { label: "Book a call", href: "#contact" },
  form: { endpoint: "https://formsubmit.co/ajax/you@example.com" }, // swap for any JSON endpoint
  shader: { speed: 0.12, folds: 2.6, glow: 0.3, pointer: 0.3, maxDpr: 1.5, palette: ["#F6F4EF", "#DCDAFF", "#4F46FF", "#FFFFFF"] },
  socials: [{ label: "Instagram", href: "#" }, { label: "LinkedIn", href: "#" }, { label: "YouTube", href: "#" }],
  legal: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }],
  stories: [
    ["Home goods seller", "An idea and a supplier quote", "Live store and first orders"],
    ["Pet accessories", "Listings that don't convert", "Clearer offer and rewritten listings"],
    ["Skincare brand", "Ad spend with no tracking", "Tighter targeting, tracked spend"],
    ["Apparel store", "Orders handled by hand", "A repeatable fulfilment routine"],
    ["Kitchen tools", "A side hustle on weekends", "A plan to go full-time"],
    ["Stationery shop", "One product, one channel", "A product line roadmap"],
  ].map(([t, b, a]) => ({ title: "[PLACEHOLDER] " + t, before: b, after: a })),
};
