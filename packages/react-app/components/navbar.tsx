"use client";

import { AlignLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useCart from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./ui/theme-switcher";

const Navbar = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const cart = useCart();

  if (!isMounted) {
    return null;
  }

  const navigationLinks = [
    {
      href: "/",
      text: "Store",
    },
    {
      href: "/admin",
      text: "Admin Dashboard",
    },
  ];

  return (
    <div className="mb-6 flex h-16 items-center justify-between border-b">
      <Sheet
        open={isMenuOpened}
        onOpenChange={() => {
          setIsMenuOpened(!isMenuOpened);
        }}
      >
        <SheetTrigger>
          <AlignLeft />
        </SheetTrigger>
        <SheetContent side={"left"} className="flex flex-col">
          <SheetHeader>
            <SheetTitle>MiniStore</SheetTitle>
          </SheetHeader>

          <div className="mt-8 flex w-full flex-col items-start gap-y-4">
            {navigationLinks.map(({ href, text }) => (
              <Link
                key={href}
                className={cn(
                  "text-2xl font-semibold text-muted-foreground hover:text-primary",
                  pathname === href && "text-primary",
                )}
                href={href}
                onClick={() => setIsMenuOpened(false)}
              >
                {text}
              </Link>
            ))}
          </div>

          <div className="mt-auto flex w-full flex-col space-y-4 self-end">
            <div className="w-fit">
              <ThemeSwitcher />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Link href="/">
        <p className="text-xl font-medium">MiniStore</p>
      </Link>

      <div className="flex items-center">
        <Button
          variant="outline"
          className="flex items-center rounded-full px-4 py-2"
          onClick={() => router.push("/cart")}
        >
          <ShoppingBag size={20} className="" />
          <span className="ml-2 text-lg font-medium">{cart.items.length}</span>
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
