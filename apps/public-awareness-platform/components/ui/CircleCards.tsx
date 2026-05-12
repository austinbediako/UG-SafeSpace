"use client";

import * as React from "react";
import {
  motion,
  HTMLMotionProps,
  useScroll,
  useTransform,
  MotionValue,
  MapInputRange,
} from "framer-motion";

interface CircleCardsContextValue {
  scrollYProgress: MotionValue<number>;
}
const CircleCardsContext = React.createContext<
  CircleCardsContextValue | undefined
>(undefined);

function useCircleCardsContext() {
  const ctx = React.useContext(CircleCardsContext);
  if (!ctx)
    throw new Error(
      "useCircleCardsContext must be used within CircleCards"
    );
  return ctx;
}

interface CircleCardsProps extends React.ComponentPropsWithRef<"div"> {
  spacerClass?: string;
}
export function CircleCards({
  spacerClass,
  className,
  children,
  ...props
}: CircleCardsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  return (
    <CircleCardsContext.Provider value={{ scrollYProgress }}>
      <div
        ref={containerRef}
        className={["relative", className].filter(Boolean).join(" ")}
        {...props}
      >
        {children}
        <div className={spacerClass ?? "h-[700px]"} />
      </div>
    </CircleCardsContext.Provider>
  );
}

interface CircleCardsWrapperProps extends HTMLMotionProps<"div"> {
  yOutput?: number[];
}
export function CircleCardsWrapper({
  yOutput = [0, 700],
  className,
  style,
  ...props
}: CircleCardsWrapperProps) {
  const { scrollYProgress } = useCircleCardsContext();
  const y = useTransform(scrollYProgress, [0, 1], yOutput);
  return (
    <motion.div
      className={[
        "relative h-[80vh] w-full overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ y, ...style }}
      {...props}
    />
  );
}

interface CircleItemProps extends HTMLMotionProps<"div"> {
  inputRange?: MapInputRange;
  outputRange?: number[];
}
export function CircleItem({
  inputRange = [0, 1],
  outputRange = [30, -30],
  className,
  style,
  ...props
}: CircleItemProps) {
  const { scrollYProgress } = useCircleCardsContext();
  const rotate = useTransform(
    scrollYProgress,
    inputRange as number[],
    outputRange
  );
  return (
    <motion.div
      className={[
        "absolute top-1/2 -left-full aspect-[1] w-[300%]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ rotate, ...style }}
      {...props}
    />
  );
}

export function CircleCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={[
        "absolute top-0 left-1/2 aspect-[3/4] max-h-[90vh] w-1/4 max-w-xs min-w-64 origin-top-left -translate-x-1/2 -translate-y-1/2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
