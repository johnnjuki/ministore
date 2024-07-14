"use client";

import { useState } from "react";
import { useWriteContract } from "wagmi";
import { createPublicClient, createWalletClient, custom } from "viem";
import { celoAlfajores } from "viem/chains";

import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import { stableTokenAlfajoresAbi } from "@/blockchain/abi/stable-token-alfajores-abi";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { cUSDAlfajoresContractAddress } from "@/lib/utils";
import { toast } from "sonner";

const Checkout = () => {
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const { data, isPending, error, writeContractAsync } = useWriteContract();

  const totalPrice = items.reduce((total, item) => {
    return total + Number(BigInt(item.price).toString()) / 10 ** 18;
  }, 0);

  const owners = items.map((item) => item.owner as `0x${string}`);
  const productIds = items.map((item) => item.id);
  const totalPoints = items.map((item) => BigInt((Number(item.price) / 10 ** 18) * 10));

  const processCheckout = async () => {

    const amount = items.reduce((total, item) => {
      return total + Number(BigInt(item.price).toString());
    }, 0);

    if (window.ethereum) {
      const privateClient = createWalletClient({
        chain: celoAlfajores,
        transport: custom(window.ethereum),
      });

      const publicClient = createPublicClient({
        chain: celoAlfajores,
        transport: custom(window.ethereum),
      });

      const [address] = await privateClient.getAddresses();

      try {
        const checkoutTxnHash = await privateClient.writeContract({
          account: address,
          address: cUSDAlfajoresContractAddress,
          abi: stableTokenAlfajoresAbi,
          functionName: "transfer",
          args: [
            process.env.NEXT_PUBLIC_ALFAJORES_CONTRACT_ADDRESS as `0x{string}`,
            BigInt(amount),
          ],
        });

        const checkoutTxnReceipt = await publicClient.waitForTransactionReceipt(
          {
            hash: checkoutTxnHash,
          },
        );

        if (checkoutTxnReceipt.status == "success") {
          return true;
        }

        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    return false;
  };

  async function onCheckout() {
    try {
      setIsProcessingCheckout(true);

      const isCheckoutProcessed = await processCheckout();

      if (isCheckoutProcessed) {
        const hash = await writeContractAsync({
          address: process.env
            .NEXT_PUBLIC_ALFAJORES_CONTRACT_ADDRESS as `0x{string}`,
          abi: ministoreAbi,
          functionName: "purchaseProducts",
          args: [owners, productIds, totalPoints],
        });

        if (hash) {
          toast.success("Purchase successful");
          removeAll();
          setIsProcessingCheckout(false);
        }
      } else {
        toast.error("Purchase failed");
        setIsProcessingCheckout(false);
      }
    } catch (error) {
      toast.error("Purchase failed");
      setIsProcessingCheckout(false);
    }
  }

  return (
    <div className="mt-16 rounded-lg px-4 py-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-medium">Order total</p>
          <p className="text-sm">${totalPrice}</p>
        </div>
      </div>
      <Button
        onClick={onCheckout}
        disabled={items.length === 0 || isProcessingCheckout}
        className="mt-6 w-full rounded-full"
      >
        {isProcessingCheckout ? "Processing..." : "Checkout"}
      </Button>
      {error && <p className="text-red-500 mt-2 text-center">Purchase Failed</p>}
      {/* {error && (
        <p className="mt-2 text-center text-red-500">{error.message}</p>
      )} */}
    </div>
  );
};

export default Checkout;
