"use client";

import { weiTocUSD } from "@/lib/utils";
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
    cell: ({ row }) => {
      return <div>${weiTocUSD(row.original.price)}</div>
    }
  },
];
