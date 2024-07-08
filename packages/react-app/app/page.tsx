import { redirect } from "next/navigation";

export default function Home() {
  redirect("/admin");
  return <main className="">Customer Home Page</main>;
}
