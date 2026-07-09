import { LANDING_FAQ } from "@/lib/site";

export function LandingFaq() {
  // FAQ schema lives as FAQPage JSON-LD in index.html — keep these Q&As in sync.
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 md:px-8"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="flex flex-col gap-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <span className="size-1.5 rounded-full bg-foreground" aria-hidden="true" />
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl"
          >
            Questions, Answered.
          </h2>
          <p className="max-w-md text-muted-foreground">
            JungleAudit is a local-first Amazon spend analyzer. Your export files are read and
            queried in the browser — not uploaded to our servers.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {LANDING_FAQ.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl bg-muted px-6 py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card text-lg font-normal leading-none text-foreground/70 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
