"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAccount, useWriteContract } from "wagmi";

import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Heading } from "@/components/heading";
import { allowedAddresses } from "@/lib/utils";

export default function InstagramFollowPage() {
  const { address, isConnected } = useAccount();
  const { isPending, error, writeContractAsync } = useWriteContract();

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!allowedAddresses.includes(address!!)) {
      toast.error("You're only allowed to explore the admin dashboard 🙂");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const hash = await writeContractAsync({
        address: process.env
          .NEXT_PUBLC_MINISTORE_CONTRACT_ADDRESS as `0x{string}`,
        abi: ministoreAbi,
        functionName: "addSocialWayToEarn",
        args: [
          "Follow us on Instagram",
          data.url as string,
          BigInt(data.points as string),
        ],
      });
      if (hash) {
        toast.success("Way to earn added");
        router.refresh();
        router.push("/admin/loyalty/points");
      }
    } catch (error) {
      toast.error("Failed to add, please try again");
      return;
    }
  }

  return (
    <div className="space-y-4">
      <Link href="/admin/loyalty/points">
        <ArrowLeft />
      </Link>

      <Heading
        title="Follow on Instagram"
        description="Provide the URL of your Instagram business page where your customers can
        follow you"
      />

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <Card className="">
          <CardHeader>
            <CardTitle className="text-lg">Social link</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              required
              pattern="^(https?:\/\/)?(instagram\.com)$"
            />
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle className="text-lg">Points to earn</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              name="points"
              type="number"
              required
              defaultValue={50}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button disabled={isPending} type="submit" className="w-fit">
            {isPending ? "Adding..." : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
}
