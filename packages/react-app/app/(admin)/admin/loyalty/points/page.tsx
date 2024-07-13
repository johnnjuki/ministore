"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rewards, socials } from "@/data";
import { PurchaseWayToEarn, purchaseColumns } from "./purchase-columns";
import { socialColumns } from "./social-columns";
import { RedeemDataTable } from "@/components/ui/redeem-data-table";
import { waysToRedeemColumns } from "./redeeming-columns";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { allowedAddresses } from "@/lib/utils";

export default function PointsPage() {
  const router = useRouter();
  const pathname= usePathname();
  const { address, isConnected } = useAccount();
  const [purchaseWayToEarn, setPurchaseWayToEarn] =
    useState<PurchaseWayToEarn>();

  const {
    isPending: isAddingWayToReddeem,
    error: addingWayToRedeemError,
    writeContractAsync,
  } = useWriteContract();

  const {
    data: purchasePointsAndCustomers,
    isPending: purchaseWaysToEarnPending,
    error: purchaseWaysToEarnError,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_ALFAJORES_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getPurchasePointsAndCustomers",
  });

  const {
    data: socialWaysToEarn,
    isPending: socialWaysToEarnPending,
    error: socialWaysToEarnError,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_ALFAJORES_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getSocialWaysToEarn",
  });

  const {
    data: waysToRedeem,
    isPending: waysToRedeemPending,
    error: waysToRedeemError,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_ALFAJORES_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getWaysToRedeem",
  });

  async function handleClick(
    name: string,
    description: string,
    points: number,
  ) {
    if (!address) return;
    if (!allowedAddresses.includes(address!!)) {
      toast.error("You're only allowed to explore the admin dashboard 🙂");
      return;
    }
    const hash = await writeContractAsync({
      address: process.env
        .NEXT_PUBLIC_ALFAJORES_CONTRACT_ADDRESS as `0x{string}`,
      abi: ministoreAbi,
      functionName: "addWayToRedeem",
      args: [name, description, BigInt(points)],
    });

    if (hash) {
      router.refresh();
      toast.success(`Added ${name} as a way to redeem`);
    }
  }

  useEffect(() => {
    if (purchasePointsAndCustomers) {
      setPurchaseWayToEarn({
        name: "Place an order",
        points: purchasePointsAndCustomers[0],
        totalCustomers: purchasePointsAndCustomers[1],
      });
    }
  }, [purchasePointsAndCustomers]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex-col space-y-4">
      <Link href="/admin">
        <ArrowLeft />
      </Link>

      <Heading
        title="Points"
        description="Add ways to earn and redeem points when customers engage with your brand"
      />

      <Separator />

      <Tabs defaultValue="earning">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="earning">Earning</TabsTrigger>
          <TabsTrigger value="redeeming">Redeeming</TabsTrigger>
        </TabsList>
        <TabsContent value="earning">
          {/* PURCHASES */}
          <div className="space-y-3">
            <div className="mt-4">
              <div className="text-lg font-medium">Purchases</div>
              <p className="text-sm text-muted-foreground">
                Purchasing products from your brand
              </p>
            </div>

            {!isConnected ? (
              <p className="text-center text-sm text-red-500">
                Please connect your wallet
              </p>
            ) : (
              <>
                {purchaseWaysToEarnError ? (
                  <p className="text-center text-sm text-red-500">
                    Something went wrong
                  </p>
                ) : (
                  <>
                    {purchaseWaysToEarnPending ? (
                      <Skeleton className="h-[200px] w-full rounded-xl" />
                    ) : (
                      <>
                        {purchaseWayToEarn ? (
                          <>
                            <DataTable
                              columns={purchaseColumns}
                              data={[purchaseWayToEarn!!]}
                            />
                          </>
                        ) : (
                          <DataTable columns={purchaseColumns} data={[]} />
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* SOCIAL */}
          <div className="space-y-3">
            <div className="">
              <div className="text-lg font-medium">Social</div>
              <p className="text-sm text-muted-foreground">
                Following your brand on social media
              </p>
            </div>

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
                      <Skeleton className="h-[200px] w-full rounded-xl" />
                    ) : (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="secondary"
                              className="mb-2 w-fit"
                              size="sm"
                            >
                              Add ways to earn
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Social</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col space-y-6">
                              {socials
                                .filter((social) => {
                                  return !socialWaysToEarn!!.some(
                                    (wayToEarn) =>
                                      wayToEarn.name === social.description,
                                  );
                                })
                                .map((social, index) => (
                                  <Link
                                    href={social.href}
                                    key={index}
                                    className=""
                                  >
                                    <div className="flex items-center space-x-5">
                                      {social.icon}
                                      <span>{social.description}</span>
                                    </div>
                                    <Separator className="mt-4" />
                                  </Link>
                                ))}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <DataTable
                          columns={socialColumns}
                          data={[...socialWaysToEarn]}
                        />
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* REDEEMING */}
        </TabsContent>
        <TabsContent value="redeeming">
          <div className="mt-4">
            {!isConnected ? (
              <p className="text-center text-sm text-red-500">
                Please connect your wallet
              </p>
            ) : (
              <>
                {waysToRedeemError ? (
                  <p className="text-center text-sm text-red-500">
                    Something went wrong
                  </p>
                ) : (
                  <>
                    {waysToRedeemPending ? (
                      <Skeleton className="h-[200px] w-full rounded-xl" />
                    ) : (
                      <>
                        {waysToRedeem ? (
                          <>
                            <RedeemDataTable
                              columns={waysToRedeemColumns}
                              data={[...waysToRedeem!!]}
                            />
                          </>
                        ) : (
                          <RedeemDataTable
                            columns={waysToRedeemColumns}
                            data={[]}
                          />
                        )}

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          {rewards.map((reward) => (
                            <div
                              key={reward.id}
                              className="flex flex-col items-center gap-2 rounded-lg bg-card p-4 text-card-foreground"
                            >
                              {reward.icon}
                              <h3 className="font-medium">{reward.title}</h3>
                              <p className="text-center text-sm text-muted-foreground">
                                {reward.description}
                              </p>
                              <Button
                                onClick={() =>
                                  handleClick(
                                    reward.title,
                                    reward.description,
                                    reward.points,
                                  )
                                }
                                disabled={isAddingWayToReddeem || waysToRedeem?.some((way) =>
                                  way.name.includes(reward.title),
                                )}
                                size="sm"
                              >
                                {waysToRedeem?.some((way) =>
                                  way.name.includes(reward.title),
                                )
                                  ? "Added"
                                  : "Add"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
