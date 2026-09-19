/* The studio's two addresses, and the structured-data record built from them.
 *
 * These lived inside the home page's Get In Touch section until that section was
 * removed. The section went, and the site's only LocalBusiness markup went with
 * it — which for a studio that competes on local intent in Hyderabad and
 * Visakhapatnam is the opposite of what removing a page should cost. They are a
 * data module now, held apart from whichever page happens to render them.
 */

export type Office = {
  city: string;
  mapsHref: string;
  streetAddress: string;
  region: string;
  postalCode: string;
};

export const OFFICES: Office[] = [
  {
    city: 'Visakhapatnam',
    mapsHref: 'https://maps.app.goo.gl/1n7Fc8trwd347mS56',
    streetAddress: 'Flat no S2, Padmini Villa, Maharanipeta, Behind Novotel',
    region: 'Andhra Pradesh',
    postalCode: '530002',
  },
  {
    city: 'Hyderabad',
    mapsHref: 'https://maps.app.goo.gl/KmmwxB1u1QdZ9Qjz5',
    streetAddress: "2nd floor, Poorna's Pride, Durga Bhawani Nagar, Giani Zail Singh Nagar, Film Nagar",
    region: 'Telangana',
    postalCode: '500096',
  },
];

/** One ProfessionalService per address, since they are two places a person can
 *  walk into rather than one business with a second line in its address.
 *
 *  The telephone is now included. It was left out when this markup first went in
 *  because no number existed anywhere in the codebase; the campaign landing page
 *  since put one in siteConfig, and a local listing without a phone number is
 *  missing the thing most people searching for a studio actually want. */
export const officesJsonLd = (siteUrl: string, siteName: string, phoneDisplay: string) => ({
  '@context': 'https://schema.org',
  '@graph': OFFICES.map((office) => ({
    '@type': 'ProfessionalService',
    name: `${siteName} — ${office.city}`,
    url: siteUrl,
    telephone: phoneDisplay,
    hasMap: office.mapsHref,
    address: {
      '@type': 'PostalAddress',
      streetAddress: office.streetAddress,
      addressLocality: office.city,
      addressRegion: office.region,
      postalCode: office.postalCode,
      addressCountry: 'IN',
    },
  })),
});
