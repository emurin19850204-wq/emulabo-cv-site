import type { AnchorHTMLAttributes, ReactNode } from "react";

export type CtaAudience = "corporate" | "personal" | "general";
export type CtaAction = "consultation" | "trial" | "resource" | "content" | "learn_more";

export type CtaTracking = {
  audience: CtaAudience;
  action: CtaAction;
  placement: string;
};

declare global {
  interface Window {
    umami?: { track?: (eventName: string, data?: Record<string, string>) => void };
  }
}

function withCtaContext(href: string, tracking: CtaTracking) {
  try {
    const base = typeof window === "undefined" ? "https://emulabo.local" : window.location.origin;
    const url = new URL(href, base);
    url.searchParams.set("cta_audience", tracking.audience);
    url.searchParams.set("cta_action", tracking.action);
    url.searchParams.set("cta_placement", tracking.placement);
    return href.startsWith("http") ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

function trackCtaClick(tracking: CtaTracking, destination: string) {
  try {
    window.umami?.track?.("cta_click", { ...tracking, destination });
  } catch {
    // Analytics must never block the visitor's navigation.
  }
}

type CtaLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  tracking: CtaTracking;
  children: ReactNode;
};

export function CtaLink({ href, tracking, onClick, children, ...props }: CtaLinkProps) {
  const contextualHref = withCtaContext(href, tracking);

  return <a {...props} href={contextualHref} onClick={event => {
    trackCtaClick(tracking, contextualHref);
    onClick?.(event);
  }}>{children}</a>;
}
