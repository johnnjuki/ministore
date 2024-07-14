"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function EarnPointsPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);

  const {
    isPending: isEarning,
    error: isEarningError,
    writeContractAsync,
  } = useWriteContract();

  const {
    data: socialWaysToEarn,
    isPending: socialWaysToEarnPending,
    error: socialWaysToEarnError,
  } = useReadContract({
    address: process.env.NEXT_PUBLC_MINISTORE_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getSocialWaysToEarn",
  });

  async function handleClick(wayToEarnId: number) {
    if (!address) return;
    const hash = await writeContractAsync({
      address: process.env
        .NEXT_PUBLC_MINISTORE_CONTRACT_ADDRESS as `0x{string}`,
      abi: ministoreAbi,
      functionName: "completeSocialWayToEarn",
      args: [BigInt(wayToEarnId)],
    });

    if (hash) {
      router.refresh();
      router.push("/loyalty/redeem-points");
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
      <Heading
        title="Earn"
        description="Earn Mini Coins and turn them into awesome rewards"
      />
      <Separator />

      {!isConnected ? (
        <p className="text-center text-sm text-red-500">
          Please connect your wallet
        </p>
      ) : (
        <>
          {socialWaysToEarnError ? (
            <p className="text-center text-sm text-red-500">
              Something went wrong
            </p>
          ) : (
            <>
              {socialWaysToEarnPending ? (
                <Skeleton className="aspect-square rounded-xl" />
              ) : (
                <>
                  {socialWaysToEarn?.length === 0 ? (
                    <p className="pt-4 text-muted-foreground">Coming soon</p>
                  ) : (
                    <div className="flex flex-col gap-6 pt-4">
                      {socialWaysToEarn?.map((socialWayToEarn, index) => (
                        <div className="" key={index}>
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <div className="">{socialWayToEarn?.name}</div>
                              <p className="text-sm text-muted-foreground">
                                {BigInt(socialWayToEarn?.points).toString()}{" "}
                                Mini Coins
                              </p>
                            </div>

                            <Button
                              disabled={
                                isEarning ||
                                socialWayToEarn?.usersRewarded.includes(
                                  address!!,
                                )
                              }
                              onClick={() => handleClick(index)}
                              variant="secondary"
                              className="flex-1"
                            >
                              <p>
                                {socialWayToEarn?.usersRewarded.includes(
                                  address!!,
                                )
                                  ? "rewarded"
                                  : socialWayToEarn?.name.split(" ")[0]}
                              </p>
                            </Button>
                            {socialWaysToEarnError && (
                              <p className="mt-2 text-center text-red-500">
                                Failed
                              </p>
                            )}
                          </div>
                        </div>
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
