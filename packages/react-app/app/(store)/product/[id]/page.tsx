"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";

import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useCart from "@/hooks/use-cart";
import { weiTocUSD } from "@/lib/utils";

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  const {
    data: product,
    isPending,
    error,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_MINISTORE_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getProduct",
    args: [BigInt(params.id)],
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onAddToCart = () => {
    cart.addItem(product!!);
  };

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
              <div className="relative aspect-square rounded-xl">
                <Image
                  src={`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${product.imageIpfsCid}`}
                  alt={product.name}
                  fill
                  className="aspect-square rounded-md object-cover"
                />
              </div>
              <div className="mt-10">
                <h1 className="text-2xl font-bold">
                  {product?.name}
                </h1>
                <p className="mt-2 text-xl">
                  ${weiTocUSD(product?.price)}
                </p>
                <Separator className="my-4" />
                <p className="text-green-500">In Stock</p>
                <div className="flex items-center gap-x-3 mt-4">
                  <Button
                    onClick={onAddToCart}
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
