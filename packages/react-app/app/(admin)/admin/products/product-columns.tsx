"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ProductColumn = {
  id: bigint;
  name: string;
  price: bigint;
};

export const productColumns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
];
