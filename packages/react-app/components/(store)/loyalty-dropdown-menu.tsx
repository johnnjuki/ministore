"use client";

import { ChevronRight, Gem, Gift } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LoyaltyDropdownMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Gift className="hover:cursor-pointer" size={30} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>MiniStore Rewards</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              router.push("/loyalty/earn-points");
            }}
            disabled={pathname === "/loyalty/earn-points"}
            className="flex justify-between hover:cursor-pointer"
          >
            <div className="flex">
              <Gem className="mr-2 h-4 w-4" />
              <span>Mini Coins</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LoyaltyDropdownMenu;
