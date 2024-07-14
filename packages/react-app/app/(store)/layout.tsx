import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

import LoyaltyDropdownMenu from "@/components/(store)/loyalty-dropdown-menu";
import Navbar from "@/components/navbar";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="">
        <Navbar />
        {children}
        <div className="fixed bottom-0 right-0 mb-6 mr-5">
          <LoyaltyDropdownMenu />
        </div>
      </div>
    </SessionProvider>
  );
}
