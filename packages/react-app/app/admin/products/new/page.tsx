"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.coerce.number().min(1, { message: "Price is required" }),
});

export default function NewProductPage() {
  const [file, setFile] = useState("");
  const [cid, setCid] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const inputFile = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
    } catch (e) {
      console.log(e);
      setLoading(false);
      alert("Trouble creating product"); // TODO: Replace with toast
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
      const res = await fetch("/api/products", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      setCid(resData.IpfsHash);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  // TODO: replace param type
  const handleChange = (e: any) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0]);
  };

  return (
    <div className="flex-col space-y-4">
      <Heading title="Create Product" description="Add a new product" />
      <Separator />
      <input type="file" id="file" ref={inputFile} onChange={handleChange} />
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

          <Button disabled={loading} type="submit">
            {loading ? "Adding..." : "Add"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
