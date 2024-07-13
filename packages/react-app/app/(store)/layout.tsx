import LoyaltyDropdownMenu from "@/components/(store)/loyalty-dropdown-menu";
import Navbar from "@/components/navbar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Navbar />
      {children}
      <div className="fixed bottom-0 right-0 mb-6 mr-5">
        <LoyaltyDropdownMenu />
      </div>
    </div>
  );
}
