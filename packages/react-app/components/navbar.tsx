import Link from "next/link";
import NavbarActions from "./navbar-actions";

const Navbar = () => {
  return (
    <div className="border-b flex mb-6 h-16 items-center justify-between">
      <Link href="/">
        <p className="font-bold text-xl">MiniStore</p>
      </Link>
      <NavbarActions />
    </div>
  );
};

export default Navbar;
