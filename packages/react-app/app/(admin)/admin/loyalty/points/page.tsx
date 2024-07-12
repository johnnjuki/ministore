"use client";

import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

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
import { Facebook, Instagram, Twitter } from "lucide-react";
import { SocialWaysToEarn, socialColumns } from "./social-columns";
import { PurchaseWayToEarn, purchaseColumns } from "./purchase-columns";
import { ministoreAbi } from "@/blockchain/abi/ministore-abi";

type Purchase = {
  description: string;
  href: string;
};

type Social = {
  icon: React.ReactElement;
  description: string;
  href: string;
};

const socials: Social[] = [
  {
    icon: <Facebook />,
    description: "Like & follow on Facebook",
    href: `/admin/loyalty/points/socials/facebook/like`,
  },
  {
    icon: <Twitter />,
    description: "Follow on X",
    href: `/admin/loyalty/points/socials/x/follow`,
  },
  {
    icon: <Instagram />,
    description: "Follow on Instagram",
    href: `/admin/loyalty/points/socials/instagram/follow`,
  },
];

export default function PointsPage() {
  const { address, isConnected } = useAccount();
  const [purchaseWayToEarn, setPurchaseWayToEarn] =
    useState<PurchaseWayToEarn>();

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
        description="Create ways to earn points when customers engage with your brand"
      />

      <Separator />

      {/* PURCHASES */}
      <div className="space-y-3">
        <div className="">
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
                              <Link href={social.href} key={index} className="">
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
    </div>
  );
}
