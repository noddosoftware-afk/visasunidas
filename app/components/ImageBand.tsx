"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export function ImageBand() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9 }}
      className="relative h-[48vh] w-full overflow-hidden bg-ink md:h-[62vh]"
    >
      <Image src="/hero.jpg" alt="" fill priority={false} className="object-cover" />
    </motion.div>
  );
}
