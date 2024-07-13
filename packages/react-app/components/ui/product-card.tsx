import { Product } from "@/types";
import Image from "next/image";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group space-y-4 rounded-xl border p-3">
      <div className="aspect-square rounded-xl relative">
        <Image
          src={`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${product.imageIpfsCid}`}
          alt={product.name}
          fill
          className="aspect-square rounded-md object-cover"
        />
      </div>
      <div className="">
        <p className="text-lg font-semibold">{product.name}</p>
        <p className="text-sm mt-1 text-green-500">
         In Stock
        </p>
        <p className="font-semibold mt-3">
          ${BigInt(product.price).toString()}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
