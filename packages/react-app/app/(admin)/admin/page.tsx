"use client";

import { ArrowLeft, ChevronRight, CreditCard, DollarSign } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { allowedAddresses, cn, weiTocUSD } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfettiStore } from "@/hooks/use-confetti-store";

export default function AdminPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);
  const confetti = useConfettiStore();
  
  const {
    data: isPayoutProcessed,
    isPending: isProcessingPayout,
    error: isProcessingPayoutError,
    writeContractAsync,
  } = useWriteContract();

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

  const {
    data: members,
    isPending: gettingMembersPending,
    error: gettingMembersError,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_ALFAJORES_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getMembers",
  });

  const {
    data: payout,
    isPending: isWithdrawingPayout,
    error: isWithdrawingPayoutError,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_ALFAJORES_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getPayout",
  });

  async function processPayout(amount: number) {
    if (!address) {
      return;
    }
    if (!allowedAddresses.includes(address!!)) {
      toast.error("You're only allowed to explore the admin dashboard 🙂");
      return;
    }

    try {
      const hash = await writeContractAsync({
        address: process.env
          .NEXT_PUBLIC_ALFAJORES_CONTRACT_ADDRESS as `0x{string}`,
        abi: ministoreAbi,
        functionName: "processPayout",
        args: [address, BigInt(amount)],
      });
      if (hash) {
        toast.success("Payout processed");
        confetti.onOpen();
        router.refresh();
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to process payout");
      return;
    }
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex-col space-y-4">
      <Link href="/" className="flex items-center gap-1 text-sm">
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
                          (product.customers.length *
                            Number(BigInt(product.price).toString())) /
                            10 ** 18,
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

                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      className={cn("hidden", payout && "block")}
                      disabled={isProcessingPayout}
                      variant="secondary"
                    >
                      {isProcessingPayout ? "Withdrawing..." : "Withdraw"}
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader>
                        <DrawerTitle className="text-center">
                          Available Payout
                        </DrawerTitle>
                      </DrawerHeader>
                      <div className="flex items-center justify-center text-7xl font-bold tracking-tighter">
                        ${weiTocUSD(payout!!)}
                      </div>
                      <DrawerFooter>
                        <Button
                          onClick={() => processPayout(Number(payout))}
                          disabled={isProcessingPayout}
                        >
                          {isProcessingPayout ? "Withdrawing..." : "Withdraw"}
                        </Button>
                        <DrawerClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
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
            <div className="flex flex-col gap-4">
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
                            {totalPoints ? totalPoints.toString() : 0} points
                            awarded
                          </CardContent>
                        </Card>
                      </Link>
                    </>
                  )}
                </>
              )}

              {gettingMembersError ? (
                <p className="mt-16 text-center text-sm text-red-500">
                  Error fetching points loyalty program.
                </p>
              ) : (
                <>
                  {gettingMembersPending ? (
                    <Skeleton className="aspect-square rounded-xl" />
                  ) : (
                    <>
                      <Card className="mt-2 bg-muted">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-medium">
                            Members
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {members.length !== 0 ? members.length : "None yet"}
                        </CardContent>
                      </Card>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
