import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function weiTocUSD(wei: bigint) {
  return `${Number(wei) / 1e18}`
}

export const allowedAddresses = [
  "0x4a41ef458562256170afFbeB6fFC97eA80BE34cB" as `0x${string}`,
  "0x72033384f7d07A490aeAdf4Bd258fbf28a933e52" as `0x${string}`,
];

export const cUSDAlfajoresContractAddress: `0x${string}` =
"0x874069fa1eb16d44d622f2e0ca25eea172369bc1";

