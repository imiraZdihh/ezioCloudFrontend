import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { toast } from "sonner";
import { BouncyButton, BouncyLink, Reveal, spring } from "./Bouncy";

export function DownloadButton({ compact = false }: { compact?: boolean }) {
  return (
    <BouncyButton
      type="button"
      onClick={() => toast("The EZIOCLOUD app download is coming soon.")}
      className={`group flex items-center gap-2 rounded-full border border-primary-glow/60 bg-background/40 text-foreground backdrop-blur hover:bg-primary hover:text-primary-foreground hover:shadow-glow ${
        compact ? "px-4 py-2 font-mono text-[11px] tracking-[0.2em]" : "px-7 py-4 font-medium"
      }`}
    >
      <motion.span animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}>↓</motion.span>
      {compact ? "DOWNLOAD NOW" : "Download now"}
    </BouncyButton>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return <motion.div style={{ scaleX: x }} className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-primary" />;
}

export function Nav() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...spring, stiffness: 160 }}
      className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/60 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-3">
          <motion.img whileHover={{ rotate: 180, scale: 1.15 }} transition={spring} src="/logo.svg" alt="" className="h-9 w-9" />
          <span className="text-lg font-bold tracking-tighter">EZIO<span className="text-primary-glow">CLOUD</span><sup className="font-mono text-[9px] text-muted-foreground">®</sup></span>
        </a>
        <nav className="hidden gap-8 font-mono text-[11px] tracking-[0.2em] text-muted-foreground md:flex">
          {[["#shift", "THE SHIFT", "01"], ["#signals", "WHAT'S INSIDE", "02"], ["#contributors", "CONTRIBUTORS", "03"]].map(([h, l, n]) => (
            <motion.a key={h} href={h} whileHover={{ y: -3, color: "var(--lilac)" }} transition={spring}>
              {l} <span className="text-primary">{n}</span>
            </motion.a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <DownloadButton compact />
          <BouncyLink href="#auth" className="hidden rounded-full border border-primary/60 px-5 py-2 font-mono text-[11px] tracking-[0.2em] hover:bg-primary hover:text-primary-foreground sm:inline-block">
            GET IN ↗
          </BouncyLink>
        </div>
      </div>
    </motion.header>
  );
}

const word = {
  hidden: { y: "110%", rotate: 6 },
  show: (i: number) => ({ y: "0%", rotate: 0, transition: { ...spring, stiffness: 120, damping: 14, delay: 0.15 + i * 0.12 } }),
};

export function HeroCopy() {
  const lines = [
    <>Your files.</>,
    <span className="text-gradient">Off the</span>,
    <>grid<span className="text-pink">.</span></>,
  ];
  return (
    <div className="relative z-10">
      <Reveal>
        <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-glow" /> FILES IN THEIR FINAL FORM
          <span className="h-px w-10 bg-primary" /> NO. 001
        </p>
      </Reveal>
      <h1 className="mt-6 text-[clamp(56px,8vw,112px)] font-semibold leading-[0.88] tracking-[-0.07em]">
        {lines.map((l, i) => (
          <span key={i} className="block overflow-hidden pb-2">
            <motion.span className="block" variants={word} initial="hidden" animate="show" custom={i}>{l}</motion.span>
          </span>
        ))}
      </h1>
      <Reveal delay={0.6}>
        <p className="mt-6 text-lg text-muted-foreground">Storage with strange ideas.<br /><strong className="text-foreground">EZIOCLOUD — Enter the Unusual.</strong></p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <BouncyLink href="#auth" className="rounded-full bg-gradient-primary px-7 py-4 font-medium text-primary-foreground shadow-glow">Open your portal ↗</BouncyLink>
          <DownloadButton />
          <motion.a href="#shift" whileHover={{ y: 3 }} className="font-mono text-xs tracking-widest text-lilac">Take the scenic route ↓</motion.a>
        </div>
      </Reveal>
    </div>
  );
}

export function PortalBackdrop() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 200]);
  const rot = useTransform(scrollY, [0, 800], [0, 25]);
  return (
    <motion.div style={{ y }} className="pointer-events-none absolute inset-0 overflow-hidden">
      <video autoPlay muted loop playsInline poster="/purple-wave-poster.png" className="absolute right-0 top-0 h-full w-full object-cover opacity-50 mix-blend-screen md:w-3/4 [mask-image:radial-gradient(ellipse_at_60%_45%,black_30%,transparent_75%)]">
        <source src="/purple-wave-background.mp4" type="video/mp4" />
      </video>
      <motion.div style={{ rotate: rot }} className="absolute right-[8%] top-[18%] h-[520px] w-[520px] rounded-full border border-primary/30" />
      <div className="absolute right-[12%] top-[24%] h-[420px] w-[420px] animate-spin-slow rounded-full border border-dashed border-pink/30" />
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/25 blur-[120px]" />
      <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-pink/20 blur-[120px]" />
    </motion.div>
  );
}

export function Shift() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.85]);
  return (
    <section id="shift" ref={ref} className="grain relative overflow-hidden bg-primary py-32 text-ink">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">
        <div>
          <Reveal><p className="font-mono text-[11px] tracking-[0.2em]">● THE SHIFT IS HAPPENING</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 text-[clamp(48px,7vw,104px)] font-bold leading-[0.88] tracking-[-0.07em]">
              The cloud<br />got <span className="text-outline">weird.</span><br /><span className="text-primary-foreground">We liked it.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-md text-lg">A little less ordinary. A lot more room to roam. Give your files a space that moves at your speed and looks nothing like the rest.</p>
            <BouncyLink href="#auth" className="mt-8 inline-block rounded-full bg-ink px-7 py-4 font-medium text-foreground">Find your place ↗</BouncyLink>
          </Reveal>
        </div>
        <motion.div style={{ rotate, scale }} className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-0 rounded-full border border-dashed border-ink/40" />
          <div className="absolute inset-[10%] rounded-full border-2 border-primary-foreground/80 shadow-glow" />
          <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }} transition={spring} className="absolute inset-[28%] flex cursor-pointer flex-col items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--primary-glow),var(--primary)_55%,var(--ink))] text-primary-foreground shadow-2xl">
            <span className="text-5xl font-bold tracking-tighter">EZ</span><span className="text-2xl">∞</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function Marquee() {
  const items = Array.from({ length: 10 }, () => "NO NORMAL CLOUDS ✳");
  return (
    <div className="-rotate-2 overflow-hidden border-y border-border bg-ink py-5">
      <div className="flex w-max animate-marquee gap-10 font-mono text-sm tracking-[0.3em] text-lilac">
        {[...items, ...items].map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

const signals = [
  { tag: "01 — UNLIMITED", title: "Space without a ceiling.", body: "Every EZIOCLOUD user gets unlimited cloud storage. Keep your files without watching a storage cap.", art: ["IMG_0001 · PNG", "final_FINAL · PDF", "untitled 12 · ZIP"] },
  { tag: "02 — FLIP", title: "Your space. Your rules.", body: "Get to the good stuff fast. No maze. No spreadsheet energy.", art: ["YOUR SPACE", "YOUR RULES", "✳"] },
  { tag: "03 — PUBLIC FILES", title: "Share across EZIOCLOUD.", body: "Make files public and share them with other EZIOCLOUD users.", art: ["EZ → 1", "EZ → 2", "EZ → 3"] },
];

export function Signals() {
  return (
    <section id="signals" className="mx-auto max-w-7xl px-6 py-32">
      <Reveal><p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">A FEW THINGS TO EXPECT</p></Reveal>
      <Reveal delay={0.1}><h2 className="mt-4 text-[clamp(40px,6vw,84px)] font-semibold leading-none tracking-[-0.06em]">Less loading. <span className="text-gradient">More living.</span></h2></Reveal>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {signals.map((s, i) => (
          <Reveal key={s.tag} delay={i * 0.12}>
            <motion.article
              whileHover={{ y: -12, rotate: i % 2 ? 1.5 : -1.5, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              className="glass group h-full cursor-pointer rounded-3xl p-7 hover:shadow-glow"
            >
              <div className="flex justify-between font-mono text-[11px] tracking-[0.2em] text-primary-glow"><span>{s.tag}</span><span className="transition-transform group-hover:rotate-45">↗</span></div>
              <div className="my-8 space-y-2">
                {s.art.map((a, j) => (
                  <motion.div key={a} initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ ...spring, delay: 0.2 + j * 0.08 }}
                    className="rounded-xl border border-border bg-background/60 px-4 py-3 font-mono text-xs text-lilac transition-transform group-hover:translate-x-2" style={{ transitionDelay: `${j * 40}ms` }}>
                    {a}
                  </motion.div>
                ))}
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-muted-foreground">{s.body}</p>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const crew = [
  { name: "EzioBot", img: "/assets/contributors/ezio-bot.jpg", short: "The 24/7 file-handling magic behind countless uploads and downloads.", bio: "The man behind countless uploads, downloads, and all the file-handling magic. Keeping everything running 24/7 like it has no life outside this website." },
  { name: "File Hora 2.0", img: "/assets/contributors/file-hora-2.jpg", short: "A lifelong file enthusiast who knows how to keep files safe.", bio: "A true file enthusiast since childhood. Steals files (in a good way), keeps them safe in an end-to-end encrypted environment, and probably dreams about storage space. Bro was born to handle files." },
  { name: "Imira Herath", img: "/assets/contributors/imira-herath.jpg", short: "Founder, CEO, and developer behind EZIOCLOUD.", bio: "The brain behind EzioCloud. Main Developer, Founder & CEO, responsible for bringing this whole thing to life. Got questions or business inquiries? Hit up @ezio_xyzz on Instagram." },
];

export function Contributors() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="contributors" className="mx-auto max-w-6xl px-6 py-32">
      <Reveal><p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">THE PEOPLE BEHIND THE PORTAL</p></Reveal>
      <Reveal delay={0.1}><h2 className="mt-4 text-[clamp(40px,6vw,84px)] font-semibold leading-none tracking-[-0.06em]">Meet the <span className="text-gradient">crew.</span></h2></Reveal>
      <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-lilac">FILE-FANATICS, BUILDERS, AND OTHER CLOUD-WIZARDS.</p>
      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {crew.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.12}>
            <motion.div layout whileHover={{ y: -10 }} transition={spring} className="glass flex flex-col items-center rounded-3xl p-6 text-center">
              <motion.div whileHover={{ scale: 1.1, rotate: -6 }} whileTap={{ scale: 0.9 }} transition={spring} className="rounded-full bg-gradient-primary p-1 shadow-glow">
                <img src={c.img} alt={c.name} className="h-28 w-28 rounded-full object-cover" />
              </motion.div>
              <h3 className="mt-5 text-xl font-semibold">{c.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.short}</p>
              <AnimatePresence>
                {open === i && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden text-sm text-lilac">
                    {c.bio}
                  </motion.p>
                )}
              </AnimatePresence>
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} transition={spring} onClick={() => setOpen(open === i ? null : i)}
                className="mt-5 rounded-full border border-primary/50 px-4 py-2 font-mono text-[10px] tracking-[0.2em] hover:bg-primary hover:text-primary-foreground">
                {open === i ? "CLOSE BIO" : "READ FULL BIO"} ↗
              </motion.button>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Finale() {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-32 text-center">
        <Reveal><p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">THAT'S YOUR CUE</p></Reveal>
        <Reveal delay={0.1}><h2 className="mt-4 text-[clamp(56px,10vw,160px)] font-bold leading-none tracking-[-0.07em] text-gradient">Let's make space.</h2></Reveal>
        <Reveal delay={0.2}><BouncyLink href="#auth" className="mt-10 inline-block rounded-full bg-gradient-primary px-8 py-4 font-medium text-primary-foreground shadow-glow">Back to the portal ↗</BouncyLink></Reveal>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between border-t border-border px-6 py-6 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
        <span>© EZIOCLOUD — ENTER THE UNUSUAL</span>
        <motion.a href="#top" whileHover={{ y: -3 }}>BACK TO TOP ↑</motion.a>
      </div>
    </footer>
  );
}
