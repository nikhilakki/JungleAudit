declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

let initialized = false;
let scriptLoading: Promise<void> | null = null;

export function isGa4Configured(): boolean {
  return Boolean(MEASUREMENT_ID);
}

function ensureDataLayer(): void {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
}

function loadGtagScript(): Promise<void> {
  if (scriptLoading) return scriptLoading;

  scriptLoading = new Promise((resolve, reject) => {
    if (!MEASUREMENT_ID) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src*="googletagmanager.com/gtag/js"]`,
    );
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Analytics"));
    document.head.appendChild(script);
  });

  return scriptLoading;
}

/** Initialize GA4 after the user has acknowledged the privacy disclaimer. */
export async function initGa4(): Promise<void> {
  if (!MEASUREMENT_ID || initialized) return;

  ensureDataLayer();
  await loadGtagScript();

  window.gtag?.("js", new Date());
  window.gtag?.("config", MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
  });

  initialized = true;
}

export function trackPageView(path: string, title: string): void {
  if (!MEASUREMENT_ID || !initialized) return;

  window.gtag?.("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: `${window.location.origin}${window.location.pathname}${window.location.hash}`,
  });
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (!MEASUREMENT_ID || !initialized) return;
  window.gtag?.("event", name, params);
}