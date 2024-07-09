"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex items-center">
      <Button className="flex items-center rounded-full bg-black hover:bg-gray-700 px-4 py-2" variant="outline" onClick={() => router.push("/cart")}>
        <ShoppingBag size={20} color="white" className="" />
        {/* // TODO: Add  number of cart items */}
      </Button>
    </div>
  );
};

export default NavbarActions;
