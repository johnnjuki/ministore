"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import ProductCard from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types";
import Navbar from "@/components/navbar";

export default function CustomerPage() {
  const { address, isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);

  const {
    data: products,
    isPending,
    error,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_MINISTORE_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getProducts",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <Navbar />

      {!isConnected ? (
        <p className="text-center text-sm text-red-500">
          Please connect your wallet
        </p>
      ) : (
        <>
          {error ? (
            <p className="mt-16 text-center text-sm text-red-500">
              Error fetching products.
            </p>
          ) : (
            <>
              {isPending ? (
                <Skeleton className="aspect-square rounded-xl" />
              ) : (
                <>
                  {products?.length === 0 ? (
                    <div className="mt-16 flex h-full w-full items-center justify-center text-neutral-500">
                      No products found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {products
                        ?.slice()
                        .reverse()
                        .map((product: Product, index) => (
                          <Link href={`/product/${product.id}`} key={index}>
                            <ProductCard product={product} />
                          </Link>
                        ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
