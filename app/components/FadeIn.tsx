import { PictureProps } from "@/types/ui/types";
import { motion } from "framer-motion";

export default function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-50px", amount: 0.2, once: true }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}
