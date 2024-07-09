export type Product = {
  id: bigint;
  imageIpfsCid: string;
  name: string;
  price: bigint;
  owner: string;
};

export type CartItem = {
  id: number;
  imageIpfsCid: string;
  name: string;
  price: number;
  owner: string;
}
