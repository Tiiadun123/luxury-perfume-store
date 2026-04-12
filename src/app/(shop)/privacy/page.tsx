export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 space-y-12">
      <h1 className="font-playfair text-4xl uppercase tracking-widest">Privacy Policy</h1>
      <div className="text-[10px] tracking-[0.2em] font-medium text-muted-foreground uppercase leading-[2.5] text-justify space-y-8">
        <p>
          At Maison Scêntia, your privacy is as precious as our rarest essences. We collect only the information necessary to fulfill your orders and provide a bespoke olfactory experience. 
        </p>
        <p>
          We do not sell, trade, or transfer your personal data to outside parties. All payment processing is handled by Stripe, ensuring that your sensitive financial data never touches our servers.
        </p>
        <p>
          By using our vault (website), you consent to our practices regarding data collection through secure cookies aimed at improving your journey through our collections.
        </p>
      </div>
    </div>
  );
}
