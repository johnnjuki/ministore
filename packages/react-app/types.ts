export type Product = {
  id: bigint;
  imageIpfsCid: string;
  name: string;
  price: bigint;
  owner: string;
};

export type Social = {
  icon: React.ReactElement;
  description: string;
  href: string;
};
