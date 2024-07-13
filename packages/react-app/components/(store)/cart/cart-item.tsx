import Image from "next/image";
import { X } from "lucide-react";

import IconButton from "@/components/ui/icon-button";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";

const CartItem = ({ product }: { product: Product }) => {
  const cart = useCart();

  const onRemove = () => {
    cart.removeItem(product.id, product.owner);
  };

  return (
    <li className="flex border-b py-6">
      <div className="relative h-24 w-24 overflow-hidden rounded-md">
        <Image
          src={`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${product.imageIpfsCid}`}
          alt={product.name}
          fill
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between">
        <div className="absolute right-0 top-0 z-10">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>
        <div className="relative pr-9">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">{product.name}</p>
          </div>
          <p className="mt-2 text-sm ">
            ${BigInt(product.price).toString()}
          </p>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
