import { notFound } from "next/navigation";
import { CURRENT_USER_ID, getUserByUsername } from "@/lib/mockData";
import ProfileView from "@/components/ProfileView";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = getUserByUsername(username);
  if (!user) notFound();

  return <ProfileView user={user} isOwn={user.id === CURRENT_USER_ID} />;
}
