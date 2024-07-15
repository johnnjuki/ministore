"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ArrowLeft, CopyIcon } from "lucide-react";
import { signIn, signOut, useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import { toast } from "sonner";

export default function ReferralsPage() {
  const session = useSession();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);

  const {
    isPending: isAddingMember,
    error: addingMemberError,
    writeContractAsync,
  } = useWriteContract();

  const {
    data: members,
    isPending: gettingMembersPending,
    error: gettingMembersError,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_MINISTORE_CONTRACT_ADDRESS as `0x{string}`,
    abi: ministoreAbi,
    functionName: "getMembers",
  });

  async function handleClick() {
    if (!address) return;
    try {
      const hash = await writeContractAsync({
        address: process.env
          .NEXT_PUBLIC_MINISTORE_CONTRACT_ADDRESS as `0x{string}`,
        abi: ministoreAbi,
        functionName: "addMember",
      });

      if (hash) {
        toast.success("Claimed 500 Mini Coins 🎉");
        router.refresh();
        router.push("/loyalty/redeem-points");
      }
    } catch (error) {
      toast.error("Failed, try again later");
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
        title="Referrals"
        description="Gift your friends with rewards and claim yours when they place an order"
      />
      <Separator />

      {!isConnected ? (
        <p className="text-center text-sm text-red-500">
          Please connect your wallet
        </p>
      ) : (
        <div>
          {session.status === "authenticated" ? (
            <div className="flex flex-col items-center justify-center gap-3">
              {address && !members?.includes(address) && (
                <div className="mt-2 flex flex-col gap-3">
                  You have 500 Mini Coins to claim
                  <Button onClick={handleClick} disabled={isAddingMember}>
                    {isAddingMember ? "Claiming..." : "Claim"}
                  </Button>
                </div>
              )}
              <div className="mt-8 flex w-full flex-col items-center justify-center gap-3">
                Your referral url
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://mini.store/?ref=${session.data.user?.name}`,
                    );
                    toast.success("Copied & ready to share 🎉");
                  }}
                  variant="outline"
                  className="flex w-full gap-2 p-2"
                >
                  <p>https://mini.store/?ref={session.data.user?.name}</p>

                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 pt-3">
              <div className="flex-1">
                <div className="">Become a member to get started</div>
                <p className="text-sm text-muted-foreground">500 Mini Coins</p>
              </div>
              <Button variant="secondary" onClick={() => signIn("google")}>
                Sign in with Google
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
