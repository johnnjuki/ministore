import Image from "next/image";

export type Product = {
  id: bigint;
  imageIpfsCid: string;
  name: string;
  price: bigint;
  owner: string;
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group space-y-4 rounded-xl border bg-white p-3">
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image
          src={`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${product.imageIpfsCid}`}
          alt={product.name}
          fill
          className="aspect-square rounded-md object-cover"
        />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold">{product.name}</p>
        <p className="text-sm text-gray-500">
          ${BigInt(product.price).toString()}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
