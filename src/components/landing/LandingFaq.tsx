import { LANDING_FAQ } from "@/lib/site";

export function LandingFaq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="flex flex-col gap-8"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="text-center">
        <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          JungleAudit is a local-first Amazon spend analyzer. Your export files are read and
          queried in the browser — not uploaded to our servers.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {LANDING_FAQ.map((item) => (
          <details
            key={item.question}
            className="group rounded-xl border border-border bg-card px-5 py-4 open:shadow-sm"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary className="cursor-pointer list-none font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
              <span itemProp="name">{item.question}</span>
            </summary>
            <div
              className="mt-3 text-sm leading-relaxed text-muted-foreground"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <p itemProp="text">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}