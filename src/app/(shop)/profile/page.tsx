import ProfileDashboard from "@/features/profile/components/profile-dashboard";
import { getUserProfile } from "@/features/profile/actions";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <ProfileDashboard initialProfile={profile} />
    </div>
  );
}
