type JsonLdProps = {
  route: "landing" | "app" | "privacy" | "terms" | "disclaimer";
};

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function JsonLd({ route }: JsonLdProps) {
  if (route !== "landing") return null;

  // FAQPage JSON-LD lives statically in index.html <head> — do not duplicate it
  // here or Google sees two FAQPage blocks on the rendered page.
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to analyze your Amazon spending with JungleAudit",
    description:
      "Get insights from your Amazon Request My Data export without uploading files to a server.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Request your Amazon data",
        text: "Submit a Request My Data request on your Amazon marketplace and download the ZIP when it is ready.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Open JungleAudit",
        text: "Visit JungleAudit in your browser and accept the local-only privacy notice.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Upload your export",
        text: "Drag the unzipped CSV files or folder into the analyzer. JungleAudit maps columns automatically.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Explore insights",
        text: "Review spend trends, payment breakdowns, refunds, and borrowing charts filtered by date range.",
      },
    ],
  };

  return <JsonLdScript data={howTo} />;
}