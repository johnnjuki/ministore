import {
  createPublicClient,
  createWalletClient,
  custom,
  parseEther,
} from "viem";

import { celoAlfajores } from "viem/chains";

import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import { cUSDAlfajoresContractAddress } from "@/lib/utils";
import { stableTokenAlfajoresAbi } from "@/blockchain/abi/stable-token-alfajores-abi";


