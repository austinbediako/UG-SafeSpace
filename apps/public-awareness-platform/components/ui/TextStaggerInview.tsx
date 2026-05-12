"use client";
import * as React from "react";
import {
  HTMLMotionProps,
  motion,
  MotionConfig,
  stagger,
  StaggerOrigin,
  Variants,
} from "framer-motion";

type AnimationT = "left" | "right" | "top" | "bottom" | "blur" | "default";

const ANIMATION_VARIANTS: Record<AnimationT, Variants> = {
  left: { hidden: { x: "-100%", opacity: 0 }, visible: { x: 0, opacity: 1 } },
  right: { hidden: { x: "100%", opacity: 0 }, visible: { x: 0, opacity: 1 } },
  top: { hidden: { y: "-100%", opacity: 0 }, visible: { y: 0, opacity: 1 } },
  bottom: { hidden: { y: "100%", opacity: 0 }, visible: { y: 0, opacity: 1 } },
  blur: {
    hidden: { filter: "blur(10px)", opacity: 0 },
    visible: { filter: "blur(0px)", opacity: 1 },
  },
  default: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

function WordStagger({
  children,
  animation,
}: {
  children: string;
  animation?: AnimationT;
}) {
  const chars = String(children).split("");
  const variants = ANIMATION_VARIANTS[animation || "default"];
  return (
    <span className="inline-block text-nowrap">
      {chars.map((char, i) => (
        <motion.span className="inline-block" variants={variants} key={i}>
          {char}
        </motion.span>
      ))}
    </span>
  );
}

interface TextStaggerInviewProps extends HTMLMotionProps<"div"> {
  staggerValue?: number;
  staggerStart?: StaggerOrigin;
  animation?: AnimationT;
}

export function TextStaggerInview({
  children,
  transition,
  className,
  viewport = { once: true, amount: "some" },
  staggerValue = 0.02,
  staggerStart = "first",
  animation,
  ...props
}: TextStaggerInviewProps) {
  const words = String(children).split(" ");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={className}
      transition={{
        delay: 0.1,
        delayChildren: stagger(staggerValue, { from: staggerStart }),
      }}
      {...props}
    >
      <MotionConfig transition={{ ease: transition?.ease || "easeOut" }}>
        {words.map((word, i) => (
          <React.Fragment key={i}>
            <WordStagger animation={animation}>{word}</WordStagger>
            {i < words.length - 1 && " "}
          </React.Fragment>
        ))}
      </MotionConfig>
    </motion.div>
  );
}
