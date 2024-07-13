"use client";

import { ColumnDef } from "@tanstack/react-table";

export type WayToRedeem = {
  name: string;
  description: string;
  points: bigint;
  numberOfUsersRewarded: bigint;
};

export const waysToRedeemColumns: ColumnDef<WayToRedeem>[] = [
  {
    accessorKey: "name",
    header: "Ways to redeem",
  },
  {
    accessorKey: "numberOfUsersRewarded",
    header: "Users rewarded",
  },
];
