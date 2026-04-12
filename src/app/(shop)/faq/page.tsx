export default function FAQPage() {
  const faqs = [
    { q: "How should I store my perfume?", a: "Fragrances should be kept in a cool, dark place away from direct sunlight and humidity. The original box is often the best sanctuary." },
    { q: "What is the shelf life of an artisanal perfume?", a: "Our perfumes typically maintain their olfactory profiles for 3 to 5 years from opening, provided they are stored correctly." },
    { q: "Do you use synthetic ingredients?", a: "Maison Scêntia utilizes a harmonious blend of 85% natural essences and 15% safe synthetics to achieve longevity and projection that nature alone cannot provide." },
    { q: "Are your products vegan?", a: "We do not test on animals, and 95% of our collection is vegan. Any exception (such as ethically sourced honeycomb) is clearly labeled." }
  ];

  return (
    <div className="max-w-3xl mx-auto py-24 px-6 space-y-16">
      <h1 className="font-playfair text-5xl uppercase text-center tracking-tight">The Registry of Wisdom</h1>
      <div className="space-y-12">
        {faqs.map((faq, i) => (
          <div key={i} className="space-y-4 border-l-2 border-primary/20 pl-8">
            <h3 className="text-[12px] font-black tracking-widest uppercase">{faq.q}</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
