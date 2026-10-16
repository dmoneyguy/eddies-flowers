// Shared vocabulary for the vendor intake form (/wholesale) and POST /api/vendor-intake.
// Every value here is also enforced by a CHECK constraint in migration 758 (legacy-ops-control-plane), and the
// Legacy OS buying desk reads the same values — change them in all three places or not at all.

export const FORMS = [
  "flower",
  "pre_roll",
  "infused_pre_roll",
  "vape_cart",
  "vape_disposable",
  "concentrate",
  "edible",
  "drink",
  "tincture_capsule",
  "topical",
] as const;
export type Form = (typeof FORMS)[number];

/** Forms whose size is a THC dose (mg) rather than a net weight (g). */
export const MG_FORMS: ReadonlySet<Form> = new Set<Form>(["edible", "drink", "tincture_capsule"]);

export const EFFECTS = ["relax", "uplift", "balanced", "relief"] as const;
export const LICENCE_TYPES = [
  "cultivator",
  "product_manufacturer",
  "microbusiness",
  "craft_coop",
  "transporter",
  "other",
] as const;
export const EQUITY_TAGS = [
  "se_applicant",
  "economic_empowerment",
  "minority_owned",
  "women_owned",
  "veteran_owned",
  "local_ma",
] as const;
export const RECIPROCAL_OPTIONS = [
  "carry_legacy_brands",
  "buy_from_legacy_distribution",
  "co_manufacturing",
  "white_label",
  "cross_promotion",
  "other",
] as const;
export const MARKETING_SUPPORT = [
  "budtender_training",
  "in_store_popups",
  "pos_displays",
  "launch_discount",
  "promo_funding",
  "co_op_advertising",
  "sample_units",
  "loyalty_rewards",
  "social_media",
] as const;

const LABELS: Record<string, string> = {
  flower: "Flower",
  pre_roll: "Pre-rolls",
  infused_pre_roll: "Infused pre-rolls / blunts",
  vape_cart: "Vape carts / pods",
  vape_disposable: "Disposable vapes / AIO",
  concentrate: "Concentrates",
  edible: "Edibles",
  drink: "Drinks",
  tincture_capsule: "Tinctures & capsules",
  topical: "Topicals",
  relax: "Relax / sleep",
  uplift: "Uplift / energy",
  balanced: "Balanced",
  relief: "Relief / CBD",
  indica: "Indica",
  sativa: "Sativa",
  hybrid: "Hybrid",
  cbd: "CBD-dominant",
  balanced_ratio: "THC:CBD ratio",
  cultivator: "Cultivator",
  product_manufacturer: "Product manufacturer",
  microbusiness: "Microbusiness",
  craft_coop: "Craft co-op",
  transporter: "Transporter / distributor",
  other: "Other",
  se_applicant: "CCC Social Equity Program",
  economic_empowerment: "Economic Empowerment",
  minority_owned: "Minority-owned",
  women_owned: "Women-owned",
  veteran_owned: "Veteran-owned",
  local_ma: "Local (North Central MA)",
  carry_legacy_brands: "Carry our partner brands",
  buy_from_legacy_distribution: "Buy through our partner distribution",
  co_manufacturing: "Co-manufacturing / processing",
  white_label: "White label",
  cross_promotion: "Cross-promotion",
  budtender_training: "Budtender training / education",
  in_store_popups: "In-store pop-ups / vendor days",
  pos_displays: "POS displays / merchandising",
  launch_discount: "Opening-order discount",
  promo_funding: "Promo funding (you fund the discount)",
  co_op_advertising: "Co-op advertising",
  sample_units: "Vendor samples (per CCC rules)",
  loyalty_rewards: "Loyalty / rewards funding",
  social_media: "Social media collabs",
  attending: "Attending the open house (Mon 10/19)",
  teams: "Wants a Teams call",
  neither: "Neither yet",
};

export function labelFor(v: string): string {
  return LABELS[v] ?? v.replace(/_/g, " ");
}
