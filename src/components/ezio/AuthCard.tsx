import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { BouncyButton, spring } from "./Bouncy";

type Mode = "login" | "create";

function Field({
  label,
  icon,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: string;
  error?: string | undefined;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <motion.label
      layout
      className="block"
      animate={error ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <motion.span
        animate={{ scale: focus ? 1.02 : 1 }}
        transition={spring}
        className={`flex items-center gap-3 rounded-xl border bg-background/60 px-4 py-3 transition-colors ${
          error ? "border-destructive" : focus ? "border-primary shadow-glow" : "border-input"
        }`}
      >
        <span className="font-mono text-sm text-primary-glow">{icon}</span>
        <input
          {...props}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </motion.span>
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 block text-xs text-destructive"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.label>
  );
}

export function AuthCard() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setCheckingSession(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [k]: e.target.value });
    setErrors({ ...errors, [k]: "" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (mode === "create" && !form.name.trim()) er["name"] = "Tell us what to call you.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er["email"] = "That email looks a little off.";
    if (form.password.length < 8) er["password"] = "At least 8 characters, please.";
    if (mode === "create" && form.confirm !== form.password)
      er["confirm"] = "Passwords don't match.";
    setErrors(er);
    if (Object.keys(er).length) return;
    if (!supabase) {
      toast.error(
        "Authentication is not connected yet. Add the Supabase values from .env.example.",
      );
      return;
    }

    setLoading(true);
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
        : await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: { data: { display_name: form.name.trim() } },
          });

    setLoading(false);
    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    if (mode === "create" && !result.data.session) {
      toast.success("Account created. Check your email to confirm it, then log in.");
      setMode("login");
      setForm({ ...form, name: "", confirm: "" });
    } else {
      toast.success("Portal opening… welcome back.");
    }
  };

  const resetPassword = async () => {
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setErrors({ email: "Enter your email first so we know where to send the link." });
      return;
    }
    if (!supabase) {
      toast.error(
        "Authentication is not connected yet. Add the Supabase values from .env.example.",
      );
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent. Check your inbox.");
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
    toast.success("You have been signed out.");
  };

  if (checkingSession) {
    return (
      <section id="auth" className="glass relative w-full max-w-md rounded-3xl p-7 shadow-glow">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
          CHECKING PORTAL ACCESS…
        </p>
      </section>
    );
  }

  if (user) {
    return (
      <motion.section
        id="auth"
        layout
        initial={{ opacity: 0, y: 60, rotate: 3, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
        className="glass relative w-full max-w-md rounded-3xl p-7 shadow-glow"
      >
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-glow" /> PORTAL OPEN
          </span>
          <span>EZ—001</span>
        </div>
        <p className="mt-6 font-mono text-[10px] tracking-[0.2em] text-lilac">ACCESS CONFIRMED</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          Welcome back<span className="text-pink">.</span>
        </h2>
        <p className="mt-4 break-all text-sm text-muted-foreground">{user.email}</p>
        <p className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-lilac">
          Your account is connected. The Windows app can use these same Supabase credentials and
          account sessions.
        </p>
        <button
          type="button"
          onClick={signOut}
          className="mt-6 w-full rounded-2xl border border-input px-5 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          Sign out
        </button>
      </motion.section>
    );
  }

  return (
    <motion.section
      id="auth"
      layout
      initial={{ opacity: 0, y: 60, rotate: 3, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      transition={{ ...spring, stiffness: 140, delay: 0.3 }}
      whileHover={{ y: -4 }}
      className="glass relative w-full max-w-md rounded-3xl p-7 shadow-glow"
    >
      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-glow" /> PORTAL ACCESS
        </span>
        <span>EZ—001</span>
      </div>

      <div className="mt-5 flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-lilac">YOUR SPACE IS WAITING</p>
          <AnimatePresence mode="wait">
            <motion.h2
              key={mode}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="mt-1 text-3xl font-semibold tracking-tight"
            >
              {mode === "login" ? "Slip inside" : "Join the weird"}
              <span className="text-pink">.</span>
            </motion.h2>
          </AnimatePresence>
        </div>
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="text-2xl text-primary-glow"
        >
          ✳
        </motion.span>
      </div>

      <div className="relative mt-6 grid grid-cols-2 rounded-2xl border border-border bg-background/50 p-1">
        {(["login", "create"] as Mode[]).map((m) => (
          <BouncyButton
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setErrors({});
            }}
            className={`relative z-10 rounded-xl py-2.5 text-sm transition-colors ${mode === m ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {mode === m && (
              <motion.span
                layoutId="tab-pill"
                transition={spring}
                className="absolute inset-0 -z-10 rounded-xl bg-gradient-primary"
              />
            )}
            {m === "login" ? "Log in" : "Create account ↗"}
          </BouncyButton>
        ))}
      </div>

      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <AnimatePresence initial={false}>
          {mode === "create" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Field
                label="YOUR NAME"
                icon="✳"
                placeholder="What should we call you?"
                value={form.name}
                onChange={set("name")}
                error={errors["name"]}
                autoComplete="name"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Field
          label="EMAIL ADDRESS"
          icon="@"
          type="email"
          placeholder="you@somewhere.cool"
          value={form.email}
          onChange={set("email")}
          error={errors["email"]}
          autoComplete="email"
        />
        <div className="relative">
          <Field
            label="PASSWORD"
            icon="⌑"
            type={showPw ? "text" : "password"}
            placeholder="At least 8 characters"
            value={form.password}
            onChange={set("password")}
            error={errors["password"]}
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-4 top-[38px] font-mono text-[10px] tracking-widest text-primary-glow"
          >
            {showPw ? "HIDE" : "SHOW"}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {mode === "create" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Field
                label="CONFIRM PASSWORD"
                icon="⌑"
                type={showPw ? "text" : "password"}
                placeholder="One more time"
                value={form.confirm}
                onChange={set("confirm")}
                error={errors["confirm"]}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" className="accent-primary" />{" "}
            {mode === "login" ? "Keep me in the loop" : "I'm ready to get weird"}
          </label>
          {mode === "login" && (
            <button
              type="button"
              onClick={resetPassword}
              className="text-lilac hover:text-primary-glow"
            >
              Forgot password?
            </button>
          )}
        </div>

        <BouncyButton
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-between rounded-2xl bg-gradient-primary px-5 py-4 font-medium text-primary-foreground shadow-glow disabled:opacity-70"
        >
          <span>
            {loading ? "Opening portal…" : mode === "login" ? "Log in to EZIO" : "Create my space"}
          </span>
          <motion.span
            animate={loading ? { rotate: 360 } : { rotate: 0 }}
            transition={loading ? { repeat: Infinity, duration: 0.8, ease: "linear" } : spring}
            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          >
            {loading ? "◌" : "↗"}
          </motion.span>
        </BouncyButton>
      </form>

      <div className="mt-6 flex justify-between border-t border-border pt-4 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
        <span>✳ MADE FOR THE WAY YOU MOVE</span>
        <span>SECURE SPACE / 001</span>
      </div>
    </motion.section>
  );
}
