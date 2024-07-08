"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ProductColumn = {
    id: string;
    name: string;
    price: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
]