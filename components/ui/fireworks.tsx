"use client";

import React from "react";
import { motion } from "framer-motion";

export const Fireworks = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      {children}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [1, 0.5, 0],
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          style={{
            top: "50%",
            left: "50%",
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
};
