import Navbar from "@/components/navbar";
import { Gift } from "lucide-react";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
      <div className="w-sm fixed bottom-0 right-0 mb-6 mr-5">
        <Gift size={30}  />
      </div>
    </div>
  );
}
