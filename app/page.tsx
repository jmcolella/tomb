import { getUser } from "@/app/server/auth/api";
import HomeClient from "./components/HomeClient";

export default async function Home() {
  const { user } = await getUser();

  const userData = user ? { email: user.email || "" } : null;

  return <HomeClient user={userData} />;
}
