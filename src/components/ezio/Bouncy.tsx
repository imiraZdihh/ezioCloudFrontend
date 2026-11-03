import { motion, type HTMLMotionProps } from "motion/react";

export const spring = { type: "spring", stiffness: 420, damping: 16 } as const;

/** Button with a springy hover/press bounce. */
export function BouncyButton({ className = "", ...props }: HTMLMotionProps<"button">) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.92 }}
      transition={spring}
      className={className}
      {...props}
    />
  );
}

export function BouncyLink({ className = "", ...props }: HTMLMotionProps<"a">) {
  return (
    <motion.a
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.92 }}
      transition={spring}
      className={className}
      {...props}
    />
  );
}

/** Fades + lifts children into view on scroll. */
export function Reveal({
  children,
  delay = 0,
  x = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  x?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, x, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
