export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(<div className="min-w-[384px]">{children}</div>);
}
