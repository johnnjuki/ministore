"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { toast } from "sonner";

const Checkout = () => {
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(BigInt(item.price).toString());
  }, 0);

  async function onCheckout() {
    // Purchase product
  }

  return (
    <div className="px-4 mt-16 rounded-lg bg-gray-50 py-6">
      <div className="space-y-4">
        <div className=" flex items-center justify-between">
          <p className="text-base font-medium text-gray-900">
            Order total
          </p>
            <p className="text-sm text-gray-500">${totalPrice}</p>
        </div>
      </div>
      <Button onClick={onCheckout} disabled={items.length === 0} className="rounded-full w-full mt-6">
        Checkout
      </Button>
    </div>
  );
};

export default Checkout;
