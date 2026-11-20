import type { Locale } from "@/lib/i18n/config";

type L = Record<Locale, string>;

export interface NavItem {
  /** Path after /{lang}, e.g. "/deposit/saving-account" */
  path: string;
  label: L;
  /** Official CMS page id (https://skdccb.bank.in/page/{id}) when the page is driven by scraped content. */
  pageId?: number;
}

export interface NavGroup {
  key: "about" | "deposit" | "loans" | "service" | "knowMore";
  items: NavItem[];
}

const p = (path: string, en: string, gu: string, pageId?: number): NavItem => ({
  path,
  label: { en, gu },
  pageId,
});

export const navGroups: NavGroup[] = [
  {
    key: "about",
    items: [
      p("/about", "About Us", "બેંક વિશે"),
      p("/bod", "Board Of Directors", "બોર્ડ ઓફ ડિરેક્ટર્સ"),
      p("/annual-report", "Annual Report", "વાર્ષિક અહેવાલ"),
      p("/gallery", "Gallery", "ગેલેરી"),
      p("/chairmans-message", "Chairman's Message", "ચેરમેનનો સંદેશ"),
      p("/unclaim-account", "Unclaim Account", "બિનવારસી ખાતા"),
      p("/branches", "Branches", "શાખાઓ", 115),
    ],
  },
  {
    key: "deposit",
    items: [
      p("/deposit/current-account", "Current Account", "ચાલુ ખાતું", 90),
      p("/deposit/saving-account", "Saving Account", "બચત ખાતું", 91),
      p("/deposit/recurring-deposit", "Recurring Deposit", "રિકરિંગ ડિપોઝિટ", 93),
      p("/deposit/fixed-deposit", "Fixed Deposit", "ફિક્સ ડિપોઝિટ", 92),
      p("/deposit/fixed-recurring-deposit", "Fixed Recurring Deposit", "ફિક્સ રિકરિંગ ડિપોઝિટ", 94),
      p("/deposit/interest-rates", "Deposit Interest Rates", "જમા વ્યાજ દર", 104),
      p("/deposit/sabar-lakshmi-recurring", "Sabar Lakshmi Recurring", "સાબર લક્ષ્મી રિકરિંગ", 114),
      p("/deposit/new-fixed-deposit-scheme", "New Fixed Deposit Scheme", "નવી ફિક્સ ડિપોઝિટ યોજના", 116),
    ],
  },
  {
    key: "loans",
    items: [
      p("/loans/education-loan", "Education Loan", "એજ્યુકેશન લોન", 95),
      p("/loans/vehicle-loan", "Vehicle Loan", "વાહન લોન", 96),
      p("/loans/personal-business-cash-credit-loan", "Personal Business Cash-Credit Loan", "પર્સનલ બિઝનેસ કેશ-ક્રેડિટ લોન", 105),
      p("/loans/business-industry-development-loan", "Business / Industry Development Loan", "બિઝનેસ / ઉદ્યોગ વિકાસ લોન", 106),
      p("/loans/jlg-loan", "Joint Liability Groups (JLG) Loan", "જોઈન્ટ લાયબિલિટી ગ્રુપ (JLG) લોન", 107),
      p("/loans/loan-interest-rate", "Loan Interest Rate", "લોનના વ્યાજ દર", 109),
      p("/emi-calculator", "EMI Calculator", "EMI કેલ્ક્યુલેટર"),
    ],
  },
  {
    key: "service",
    items: [
      p("/service/demand-draft", "Demand Draft Service", "ડિમાન્ડ ડ્રાફ્ટ સેવા", 97),
      p("/service/rtgs-neft", "RTGS and NEFT Facility", "RTGS અને NEFT સુવિધા", 98),
      p("/service/absp", "ABSP Facility", "ABSP સુવિધા", 99),
      p("/service/safe-deposit-lockers", "Safe Deposit Lockers", "સેફ ડિપોઝિટ લોકર", 108),
      p("/service/net-banking", "Net Banking", "નેટ બેંકિંગ", 113),
      p("/service/government-schemes", "Government Schemes", "સરકારી યોજનાઓ", 111),
      p("/service/mobile-banking", "Mobile Banking", "મોબાઇલ બેંકિંગ", 112),
      p("/service/cts", "CTS Facility", "CTS (ચેક ટ્રંકેશન) સુવિધા", 117),
      p("/service/atm", "ATM Facility", "ATM સુવિધા", 118),
      p("/service/micro-atm", "Micro ATM Facility", "માઇક્રો ATM સુવિધા", 119),
      p("/service/upi", "UPI", "UPI", 120),
      p("/service/bbps", "BBPS", "BBPS (બિલ પેમેન્ટ)", 121),
      p("/service/nach", "NACH", "NACH", 122),
      p("/service/services-charge", "Services Charge", "સેવા ચાર્જ", 110),
    ],
  },
  {
    key: "knowMore",
    items: [
      p("/know-more/privacy-policy", "Privacy Policy", "ગોપનીયતા નીતિ", 100),
      p("/know-more/terms-and-conditions", "Terms & Conditions", "નિયમો અને શરતો", 101),
      p("/know-more/aadhar-data-privacy-policy", "Aadhar Data Privacy Policy", "આધાર ડેટા ગોપનીયતા નીતિ", 102),
      p("/know-more/authentication-compliance-policy", "Authentication Compliance Policy", "ઓથેન્ટિકેશન કમ્પ્લાયન્સ પોલિસી", 103),
      p("/know-more/customer-awareness", "Customer Awareness", "ગ્રાહક જાગૃતિ", 123),
      p("/downloads", "Download Forms", "ફોર્મ ડાઉનલોડ"),
    ],
  },
];

/** Items served by the generic CMS page route (/{lang}/{section}/{slug}). */
export const cmsRoutes = navGroups
  .flatMap((g) => g.items)
  .filter((i) => i.pageId && i.path.split("/").length === 3 && i.pageId !== 115)
  .map((i) => {
    const [, section, slug] = i.path.split("/");
    return { section, slug, pageId: i.pageId!, label: i.label };
  });

export function findCmsRoute(section: string, slug: string) {
  return cmsRoutes.find((r) => r.section === section && r.slug === slug);
}
