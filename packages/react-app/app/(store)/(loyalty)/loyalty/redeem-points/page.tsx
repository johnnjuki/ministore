"use client";

import { ArrowLeft, Package, Ship, ShoppingCart, TicketPercent } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function RedeemPointsPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);

  const {
    isPending: isRedeeming,
    error: isRedeemingError,
    writeContractAsync,
  } = useWriteContract();

  const {
    data: points,
    isPending: gettingPointsPending,
    error: gettingPointsError,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_MINISTORE_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getCustomerPoints",
    args: [address as `0x{string}`],
  });

  const {
    data: waysToRedeem,
    isPending: waysToRedeemPending,
    error: waysToRedeemError,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_MINISTORE_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getWaysToRedeem",
  });

  async function handleClick(wayToRedeemId: number) {
    if (!address) return;
    const hash = await writeContractAsync({
      address: process.env
        .NEXT_PUBLIC_MINISTORE_CONTRACT_ADDRESS as `0x{string}`,
      abi: ministoreAbi,
      functionName: "redeemPoints",
      args: [BigInt(wayToRedeemId)],
    });

    if (hash) {
      toast.success("Use your reward on the next order 🎉");
      router.refresh();
    }
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      <ArrowLeft onClick={() => router.back()} />
      <Heading title="Redeem" description="Turn your Mini Coins into rewards" />
      <Separator />

      {!isConnected ? (
        <p className="text-center text-sm text-red-500">
          Please connect your wallet
        </p>
      ) : (
        <>
          {waysToRedeemError || gettingPointsError ? (
            <p className="text-center text-sm text-red-500">
              Something went wrong
            </p>
          ) : (
            <>
              {waysToRedeemPending || gettingPointsPending ? (
                <Skeleton className="aspect-square rounded-xl" />
              ) : (
                <>
                  <div>
                    {points ? (
                      <p className="font-medium">
                        {BigInt(points).toString()} Mini Coins
                      </p>
                    ) : (
                      <>
                      <p>0 Mini Coins</p>
                      {isRedeemingError && <p className="text-red-500 mt-2">Couldn&apos;t redeem right now. Try again later</p>}
                      </>
                    )}
                  </div>

                  {waysToRedeem?.length !== 0 && (
                    <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        {waysToRedeem.map((wayToRedeem, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center gap-2 rounded-lg bg-card p-4 text-card-foreground"
                          >
                            {wayToRedeem.name.includes("Discount") && (
                              <ShoppingCart className="h-8 w-8" />
                            )}

                            {wayToRedeem.name.includes("coupon") && (
                              <TicketPercent className="h-8 w-8" />
                            )}

                            {wayToRedeem.name.includes("Shipping") && (
                              <Ship className="h-8 w-8" />
                            )}

                            {wayToRedeem.name.includes("Product") && (
                              <Package className="h-8 w-8" />
                            )}

                            <h3 className="font-medium">{wayToRedeem.name}</h3>
                            <p className="text-center text-sm text-muted-foreground">
                              {wayToRedeem.description.replace("points", "Mini Coins")}
                            </p>
                            <Button
                              variant="secondary"
                              disabled={
                                isRedeeming ||
                                gettingPointsPending ||
                                points!! < wayToRedeem.points
                              }
                              onClick={() => {
                                handleClick(index);
                              }}
                              size="sm"
                            >
                              Redeem
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {waysToRedeem?.length === 0 && <p className="pt-4 text-muted-foreground">Coming soon</p>}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
