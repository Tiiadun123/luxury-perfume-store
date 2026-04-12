import { getShippingZones } from "@/features/admin/actions";
import { LogisticsClient } from "@/features/admin/components/logistics-client";

export default async function LogisticsPage() {
  const zones = await getShippingZones();
  
  return <LogisticsClient initialZones={zones} />;
}
