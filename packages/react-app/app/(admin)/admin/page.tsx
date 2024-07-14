"use client";

import { ArrowLeft, ChevronLeft, ChevronRight, CreditCard, DollarSign } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import { Heading } from "@/components/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);

  const {
    data: products,
    isPending: isFetchingProducts,
    error: isFetchingProductsError,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_ALFAJORES_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getProducts",
  });

  const {
    data: totalPoints,
    isPending: isFetchingTotalPoints,
    error: isFetchingTotalPointsError,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_ALFAJORES_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getTotalPointsAwarded",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex-col space-y-4">
      <Link href="/" className="flex gap-1 text-sm items-center">
        <ArrowLeft className="h-4 w-4" /> Store
      </Link>
      <Heading title="Dashboard" description="Manage your store" />
      <Separator />

      {isFetchingProductsError ? (
        <p className="mt-16 text-center text-sm text-red-500">
          Error loading dashboard.
        </p>
      ) : (
        <>
          {isFetchingProducts ? (
            <Skeleton className="aspect-square rounded-xl" />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">
                      $
                      {products?.reduce(
                        (total, product) =>
                          total +
                          product.customers.length *
                            Number(BigInt(product.price).toString()),
                        0,
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">
                      {products?.reduce(
                        (total, product) => total + product.customers.length,
                        0,
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <div className="text-lg font-medium text-muted-foreground">
                  Products
                </div>
                <Link href="/admin/products">
                  <Card className="mt-2 bg-muted">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Products In Stock
                      </CardTitle>
                      {/* // TODO: Animate this Icon */}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-medium">
                        {products?.length}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          )}

          <div>
            <div className="text-lg font-medium text-muted-foreground">
              Loyalty Program
            </div>

            {isFetchingTotalPointsError ? (
              <p className="mt-16 text-center text-sm text-red-500">
                Error fetching points loyalty program.
              </p>
            ) : (
              <>
                {isFetchingTotalPoints ? (
                  <Skeleton className="aspect-square rounded-xl" />
                ) : (
                  <>
                    <Link href="/admin/loyalty/points">
                      <Card className="mt-2 bg-muted">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          {/* Add badge showing active*/}
                          <CardTitle className="text-lg font-medium">
                            Points
                          </CardTitle>
                          {/* // TODO: Animate this Icon */}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          {totalPoints ? totalPoints.toString() : 0} points awarded
                        </CardContent>
                      </Card>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
