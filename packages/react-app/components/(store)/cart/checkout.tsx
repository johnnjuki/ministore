"use client";

import { useWriteContract } from "wagmi";

import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { toast } from "sonner";

const Checkout = () => {
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const { data, isPending, error, writeContractAsync } = useWriteContract();

  const totalPrice = items.reduce((total, item) => {
    return total + Number(BigInt(item.price).toString());
  }, 0);
  
  // const totalPoints = items.reduce((total, item) => {
  //   return total + Number(BigInt(item.price).toString()) * 10;
  // }, 0)


  const owners = items.map((item) => item.owner as `0x${string}`);
  const productIds = items.map((item) => item.id);
  const totalPoints = items.map((item) => BigInt(Number(item.price) * 10))

  // const totalPriceInWei = Math.ceil(totalPrice * 10**18);

  // TODO: Fix: purchaseProduct() only paying the gas fee, without product price
  async function onCheckout() {
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
    }
  }

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-medium text-gray-900">Order total</p>
          <p className="text-sm text-gray-500">${totalPrice}</p>
        </div>
      </div>
      <Button
        onClick={onCheckout}
        disabled={items.length === 0 || isPending}
        className="mt-6 w-full rounded-full"
      >
        Checkout
      </Button>
      {/* {error && <p className="text-red-500 mt-2 text-center">Purchase Failed</p>} */}
      {error && <p className="text-red-500 mt-2 text-center">{error.message}</p>}
    </div>
  );
};

export default Checkout;
