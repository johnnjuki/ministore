"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import { Separator } from "@/components/ui/separator";

export default function ProductPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const {
    data: product,
    isPending,
    error,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_ALFAJORES_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getProduct",
    args: [`${params.slug[0]!!}` as `0x${string}`, BigInt(params.slug[1])],
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="">
      {isPending ? (
        <Skeleton className="aspect-square rounded-xl" />
      ) : (
        <>
          {error ? (
            <div className="text-center text-sm text-red-500">
              Error fetching product
            </div>
          ) : (
            <div className="">
              <div className="relative aspect-square rounded-xl bg-gray-100">
                <Image
                  src={`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${product.imageIpfsCid}`}
                  alt={product.name}
                  fill
                  className="aspect-square rounded-md object-cover"
                />
              </div>
              <div className="mt-10">
                <h1 className="text-2xl font-bold text-gray-900">
                  {product?.name}
                </h1>
                <p className="mt-2 text-xl text-gray-500">
                  ${BigInt(product.price).toString()}
                </p>
                <Separator className="my-4" />
                <div className="flex items-center gap-x-3">
                  <Button
                    onClick={() => {
                      // TODO: Add product to cart
                    }}
                    className="flex items-center gap-x-2 rounded-full"
                  >
                    Add To Cart
                    <ShoppingCart size={20} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
