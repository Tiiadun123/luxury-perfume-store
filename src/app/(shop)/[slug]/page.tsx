import GenericInfoPage from "@/components/layout/info-page";
import { notFound } from "next/navigation";

const INFO_PAGES: Record<string, { title: string, subtitle: string, content: string }> = {
  about: {
    title: "Our Journey",
    subtitle: "A Legacy in Every Drop",
    content: "Maison Scêntia was born in the heart of Paris, fueled by a passion for the rarest essences and the art of traditional perfumery. Our journey is one of discovery, sourcing the most exquisite botanicals from across the globe to create olfactory masterpieces that transcend time."
  },
  contact: {
    title: "Boutiques",
    subtitle: "Visit the Sanctuary",
    content: "Our doors are always open to those seeking their personal essence. Visit us at 24 Avenue Montaigne, Paris, or reach out to our artisans for a private consultation."
  },
  shipping: {
    title: "Voyage",
    subtitle: "Shipping & Returns",
    content: "We provide complimentary white-glove delivery across the globe. Each creation is meticulously packaged to ensure its arrival is as pristine as its essence. Returns are accepted within 30 days in original sealed condition."
  },
  privacy: {
    title: "Discretion",
    subtitle: "Privacy Policy",
    content: "At Maison Scêntia, your privacy is as guarded as our secret fragrance formulas. We are committed to protecting your personal data and providing a secure, luxury experience."
  },
  terms: {
    title: "The Pact",
    subtitle: "Terms of Use",
    content: "By entering the world of Scêntia, you agree to our terms of elegance and respect for artisanal craftsmanship. All content and fragrances are the exclusive property of the House."
  },
  faq: {
    title: "Inquiries",
    subtitle: "Frequently Asked Questions",
    content: "Curious about notes, longevity, or sillage? Our artisans have prepared a comprehensive guide to help you navigate the complex world of luxury perfumery."
  },
  care: {
    title: "Preservation",
    subtitle: "Fragrance Care",
    content: "To maintain the integrity of your essence, store it in a cool, dark place away from direct sunlight. Treat each bottle with the reverence it deserves."
  },
  artisans: {
     title: "Mastery",
     subtitle: "Our Artisans",
     content: "Meet the noses behind the magic. Our house is composed of master perfumers who have dedicated their lives to the pursuit of the perfect accord."
  }
};

export default async function DynamicInfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = INFO_PAGES[slug];

  if (!page) {
    notFound();
  }

  return (
    <GenericInfoPage 
      title={page.title}
      subtitle={page.subtitle}
      content={<p>{page.content}</p>}
    />
  );
}
