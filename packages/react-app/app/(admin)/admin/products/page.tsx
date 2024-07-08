import Link from "next/link";
import { Plus } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { columns } from "./components/columns";

export default function ProductsPage() {
  return (
    <main className="flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Products"
          description="Manage products for your store"
        />
        <Link href="/admin/products/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
        </Link>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={[]} />
    </main>
  );
}
