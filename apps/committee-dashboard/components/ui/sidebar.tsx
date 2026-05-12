"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Link from "next/link";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => (
  <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
    {children}
  </SidebarProvider>
);

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => (
  <>
    <DesktopSidebar {...props} />
    <MobileSidebar {...(props as React.ComponentProps<"div">)} />
  </>
);

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-screen fixed left-0 top-0 px-4 py-4 hidden md:flex md:flex-col bg-[#153D6F] w-[260px] overflow-y-auto z-40",
        className
      )}
      animate={{ width: animate ? (open ? "260px" : "64px") : "260px" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className="h-14 px-4 flex flex-row md:hidden items-center justify-between bg-[#153D6F] w-full"
      {...props}
    >
      <div className="flex justify-end z-20 w-full">
        <IconMenu2
          className="text-white cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed h-full w-full inset-0 bg-[#153D6F] p-10 z-[100] flex flex-col justify-between",
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-white cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  active,
}: {
  link: Links;
  className?: string;
  active?: boolean;
}) => {
  const { open, animate } = useSidebar();
  const collapsed = animate && !open;
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-3 transition-colors",
        collapsed
          ? "justify-center py-2 px-0"
          : "justify-start py-2.5 px-3",
        active
          ? collapsed
            ? "text-[#e8b84b]"
            : "bg-[#c8962b]/20 text-[#e8b84b]"
          : "text-white/80 hover:bg-white/10 hover:text-white",
        className
      )}
    >
      {collapsed && active ? (
        <span className="flex h-9 w-9 items-center justify-center bg-[#c8962b]/25">
          {link.icon}
        </span>
      ) : (
        link.icon
      )}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm font-medium whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

export const SidebarSection = ({ label }: { label: string }) => {
  const { open, animate } = useSidebar();
  const collapsed = animate && !open;
  return collapsed ? (
    <div className="mx-3 my-2 h-px bg-white/10" />
  ) : (
    <motion.p
      animate={{
        display: animate ? (open ? "block" : "none") : "block",
        opacity: animate ? (open ? 1 : 0) : 1,
      }}
      className="px-3 pt-5 pb-1 text-[9px] font-bold uppercase tracking-widest text-[#c8962b]/70 select-none"
    >
      {label}
    </motion.p>
  );
};
