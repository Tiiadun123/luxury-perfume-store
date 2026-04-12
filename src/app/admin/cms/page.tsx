import { getBanners } from "@/features/admin/actions";
import { CMSClient } from "@/features/admin/components/cms-client";

export default async function CMSPage() {
  const banners = await getBanners();
  
  return <CMSClient initialBanners={banners} />;
}
