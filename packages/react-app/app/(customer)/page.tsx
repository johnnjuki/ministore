"use client";

import Link from "next/link";
import { useReadContract, useAccount } from "wagmi";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import ProductCard, { Product } from "@/components/ui/product-card";

export default function CustomerPage() {
  const { address, isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);

  const {
    data: products,
    isPending,
    error,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_ALFAJORES_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getAllProducts",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="mt-6">
      {isPending ? (
        <Skeleton className="aspect-square rounded-xl" />
      ) : (
        <>
          {products?.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center text-neutral-500">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {products?.map((product: Product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
