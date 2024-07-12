"use client";

import { ColumnDef } from "@tanstack/react-table";

export type SocialWaysToEarn = {
  name: string;
  url: string;
  points: bigint;
  numberOfUsersRewarded: bigint;
};

export const socialColumns: ColumnDef<SocialWaysToEarn>[] = [
  {
    accessorKey: "name",
    header: "Ways to earn",
  },
  {
    accessorKey: "numberOfUsersRewarded",
    header: "Users rewarded",
  },
];
