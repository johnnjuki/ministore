"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, useWriteContract } from "wagmi";
import * as z from "zod";

import { ministoreAbi } from "@/blockchain/abi/ministore-abi";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.coerce.number().min(1, { message: "Price is required" }),
});

export default function NewProductPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { isPending, error, writeContractAsync } = useWriteContract();
  const [file, setFile] = useState("");
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);

  const inputFile = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!cid) {
      toast.error("Please wait for the product image to upload");
      return;
    }
    try {
      const hash = await writeContractAsync({
        address: process.env
          .NEXT_PUBLIC_ALFAJORES_CONTRACT_ADDRESS as `0x{string}`,
        abi: ministoreAbi,
        functionName: "addProduct",
        args: [cid, data.name, BigInt(data.price)],
      });
      if (hash) {
        toast("Product added");
        router.refresh();
        router.push("/admin/products");
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to add product, try again.");
      return;
    }
  }

  /**
   * Uploads product image to Pinata IPFS.
   */
  const uploadFile = async (fileToUpload: File) => {
    try {
      setUploading(true);
      const data = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      setCid(resData.IpfsHash);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      toast.error("Failed to upload image, try again.");
    }
  };

  // TODO: replace param type
  const handleChange = (e: any) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0]);
  };

  return (
    <div className="flex-col space-y-4">
      <Heading title="Add Product" description="Add a new product" />
      <Separator />
      {!isConnected ? (
        <p className="text-center text-sm text-red-500">
          Please connect your wallet
        </p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input
              required
              type="file"
              id="file"
              ref={inputFile}
              onChange={handleChange}
            />
            <Button
              variant="secondary"
              disabled={uploading}
              onClick={() => inputFile.current && inputFile.current.click()}
            >
              {uploading ? "Uploading" : "Upload"}
            </Button>
            {cid && (
              <Image
                src={`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                alt="Image from IPFS"
                width={200}
                height={200}
              />
            )}
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} type="submit">
              {isPending ? "Adding..." : "Add"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
