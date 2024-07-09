"use client";

import { useEffect, useState } from "react";

import useCart from "@/hooks/use-cart";
import CartItem from "@/components/(customer)/cart/cart-item";
import Checkout from "@/components/(customer)/cart/checkout";

// export const revalidate = 0;

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="py-16">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <div className="mt-12">
        <div>
          {cart.items.length == 0 && (
            <p className="text-neutral-500">No items added to cart.</p>
          )}
          <ul>
            {cart.items.map((item, index) => (
              <CartItem key={index} product={item} />
            ))}
          </ul>
        </div>
        <Checkout />
      </div>
    </div>
  );
}
