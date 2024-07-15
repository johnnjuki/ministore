import { ConfettiProvider } from "@/providers/confetti-provider";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ConfettiProvider />
      {children}
    </div>
  );
}
