"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPage({
    params
}: {
    params: {slug: string[]};
}) {
    return <div>Product Page</div>;
}