import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PARAMETER } from "@/data/parameter";

function setMetaContent(selector: string, content: string) {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
}

/**
 * Per-route <title>/description/canonical (ROADMAP_PUBLIC_SEO.md S1.2) --
 * no SSR/pre-render on this site (S1.6), so this only reaches real browser
 * tabs, not crawlers that don't execute JS. index.html's static tags are
 * the crawler-visible fallback.
 */
export function usePageMeta(title: string, description?: string) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title;
    if (description) {
      setMetaContent('meta[name="description"]', description);
      setMetaContent('meta[property="og:description"]', description);
      setMetaContent('meta[name="twitter:description"]', description);
    }
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[name="twitter:title"]', title);

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    const url = `${window.location.origin}${pathname}`;
    if (canonical) canonical.href = url;
    if (ogUrl) ogUrl.content = url;
  }, [title, description, pathname]);
}

/**
 * Same as usePageMeta, but prefixes the page label with the brand name/year
 * ("Synca Conf <année>", from PARAMETER) instead of
 * each page reconstructing it by hand.
 */
export function useBrandedPageMeta(pageLabel: string | null, description?: string) {
  const brand = `${PARAMETER.shortTitle} ${PARAMETER.year}`;
  const title = pageLabel ? `${pageLabel} — ${brand}` : brand;
  usePageMeta(title, description);
}
