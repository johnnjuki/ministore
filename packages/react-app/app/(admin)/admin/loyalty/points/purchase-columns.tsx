"use client";

import { ColumnDef } from "@tanstack/react-table";

export type PurchaseWayToEarn = {
  name: string;
  points: bigint;
  totalCustomers: bigint;
};

export const purchaseColumns: ColumnDef<PurchaseWayToEarn>[] = [
  {
    accessorKey: "name",
    header: "Ways to earn",
  },
  {
    accessorKey: "totalCustomers",
    header: "Users rewarded",
  },
];
