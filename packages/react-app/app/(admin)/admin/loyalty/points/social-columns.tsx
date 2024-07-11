"use client";

import { ColumnDef } from "@tanstack/react-table";

export type SocialWaysToEarn = {
  name: string;
  url: string;
  points: bigint;
  totalCustomers: bigint;
};

export const socialColumns: ColumnDef<SocialWaysToEarn>[] = [
  {
    accessorKey: "name",
    header: "Ways to earn",
  },
  {
    accessorKey: "totalCustomers",
    header: "Users rewarded",
  },
  
];
