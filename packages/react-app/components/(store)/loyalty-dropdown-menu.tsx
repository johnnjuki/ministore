"use client";

import { ChevronRight, CircleCheck, Gift } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";

const LoyaltyDropdownMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Gift className="hover:cursor-pointer bg-background rounded-md" size={30} />
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
              <CircleCheck className="mr-2 h-4 w-4" />
              <span>Earn</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push("/loyalty/redeem-points");
            }}
            disabled={pathname === "/loyalty/redeem-points"}
            className="flex justify-between hover:cursor-pointer"
          >
            <div className="flex">
              <Gift className="mr-2 h-4 w-4" />
              <span>Redeem</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LoyaltyDropdownMenu;
