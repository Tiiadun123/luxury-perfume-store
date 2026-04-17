import ShopPage from "../page";

export default async function CollectionPage(props: {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <ShopPage {...props} />;
}
