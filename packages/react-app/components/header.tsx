import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <header className="min-w-[384px] hidden justify-end sm:flex py-4">
      <ConnectButton />
    </header>
  );
}
