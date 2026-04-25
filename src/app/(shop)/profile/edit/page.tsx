import { getUserProfile } from "@/features/profile/actions";
import ProfileEditForm from "@/features/profile/components/profile-edit-form";
import { redirect } from "next/navigation";

export default async function ProfileEditPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-6 md:px-12 py-24">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <ProfileEditForm initialProfile={profile} />
      </div>
    </div>
  );
}
