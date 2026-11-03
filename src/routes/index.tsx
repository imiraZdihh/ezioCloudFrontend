import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AuthCard } from "@/components/ezio/AuthCard";
import { Contributors, Finale, HeroCopy, Marquee, Nav, PortalBackdrop, ScrollProgress, Shift, Signals } from "@/components/ezio/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EZIOCLOUD — Enter the Unusual" },
      { name: "description", content: "Create your EZIOCLOUD account. Unlimited cloud storage with public file sharing." },
      { name: "theme-color", content: "#0d0912" },
      { property: "og:title", content: "EZIOCLOUD — Enter the Unusual" },
      { property: "og:description", content: "Your files, off the grid. Unlimited cloud storage with public sharing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div id="top">
      <ScrollProgress />
      <Nav />
      <main>
        <section className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16">
          <PortalBackdrop />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.1fr_1fr]">
            <HeroCopy />
            <div className="flex justify-center lg:justify-end"><AuthCard /></div>
          </div>
        </section>
        <Shift />
        <Marquee />
        <Signals />
        <Contributors />
      </main>
      <Finale />
      <Toaster theme="dark" position="top-center" />
    </div>
  );
}
