"use client";

import { useEffect, useState, Suspense } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { hasAnalyticsConsent, trackPageView } from "@/lib/analytics";

function PageViewTracker({ consentGranted }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (consentGranted && pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      trackPageView(url);
    }
  }, [pathname, searchParams, consentGranted]);

  return null;
}

export default function AnalyticsScripts() {
  const [consentGranted, setConsentGranted] = useState(false);

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  // Check consent on mount and listen for storage changes
  useEffect(() => {
    const checkConsent = () => {
      setConsentGranted(hasAnalyticsConsent());
    };

    checkConsent();

    window.addEventListener("storage", checkConsent);
    return () => window.removeEventListener("storage", checkConsent);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker consentGranted={consentGranted} />
      </Suspense>

      {consentGranted && (
        <>
          {/* ── GOOGLE ANALYTICS 4 ── */}
          {gaId && (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              />
              <Script
                id="ga4-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </>
          )}

          {/* ── MICROSOFT CLARITY ── */}
          {clarityId && (
            <Script
              id="clarity-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(c,l,a,r,i,t,y){
                      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "${clarityId}");
                `,
              }}
            />
          )}

          {/* ── META (FACEBOOK) PIXEL ── */}
          {pixelId && (
            <Script
              id="meta-pixel-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${pixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
          )}
        </>
      )}
    </>
  );
}
