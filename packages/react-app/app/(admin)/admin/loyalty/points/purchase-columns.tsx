"use client";

import { ColumnDef } from "@tanstack/react-table";

export type PurchaseWaysToEarn = {
  name: string;
  points: bigint;
  totalCustomers: bigint;
};

export const purchaseColumns: ColumnDef<PurchaseWaysToEarn>[] = [
  {
    accessorKey: "name",
    header: "Ways to earn",
  },
  {
    accessorKey: "totalCustomers",
    header: "Users rewarded",
  },
];
