"use client";

import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { useEffect, useState } from "react";

import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { productColumns } from "./product-columns";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const { address, isConnected } = useAccount();

  const {
    data: products,
    isPending,
    error,
  } = useReadContract({
    address: process.env
      .NEXT_PUBLIC_MINISTORE_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getProducts",
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <main className="flex-col space-y-4">
      <Link href="/admin">
        <ArrowLeft />
      </Link>
      <div className="flex items-center justify-between">
        <Heading
          title="Products"
          description="Manage products for your store"
        />
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </Link>
      </div>
      <Separator />

      {!isConnected ? (
        <p className="text-center text-sm text-red-500">
          Please connect your wallet <br /> or access using <Link target="_blank" href="https://www.opera.com/products/minipay" className="underline ">MiniPay</Link>
        </p>
      ) : (
        <>
          {error ? (
            <p className="text-center text-sm text-red-500">
              Something went wrong
            </p>
          ) : (
            <>
              {isPending ? (
                <Skeleton className="h-[350px] w-full rounded-xl" />
              ) : (
                <DataTable
                  searchKey="name"
                  columns={productColumns}
                  data={[...products!!]}
                />
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
