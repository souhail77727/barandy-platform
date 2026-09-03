import type {
  ColorItem,
  ColorPaletteResult,
} from "@/types/brand-dna";

export interface ValueColorDefinition {
  name: string;
  hex: string;
  rgb: string;
  psychology: string;
  recommendedUsage: string;
}

export const VALUE_COLOR_MAP: Record<string, ValueColorDefinition> = {
  authenticity: {
    name: "Terracotta Earth",
    hex: "#B56E52",
    rgb: "181, 110, 82",
    psychology:
      "Projects grounded honesty, human warmth, and raw transparent authority.",
    recommendedUsage:
      "Primary accents, signature brand headers, and key quote cards.",
  },

  ambition: {
    name: "Imperial Burgundy",
    hex: "#721C35",
    rgb: "114, 28, 53",
    psychology:
      "Signifies executive gravitas, relentless drive, and commanding momentum.",
    recommendedUsage:
      "Hero callouts, high-stakes keynotes, and executive badges.",
  },

  innovation: {
    name: "Deep Midnight Navy",
    hex: "#1B365D",
    rgb: "27, 54, 93",
    psychology:
      "Conveys visionary intellect, architectural depth, and futuristic clarity.",
    recommendedUsage:
      "Framework cards, analytical diagrams, and strategic whitepapers.",
  },

  empathy: {
    name: "Warm Tuscan Sand",
    hex: "#D4A373",
    rgb: "212, 163, 115",
    psychology:
      "Evokes human connection, empathetic reassurance, and approachable wisdom.",
    recommendedUsage:
      "Community touchpoints, mentoring content, and testimonial backdrops.",
  },

  excellence: {
    name: "Onyx Slate",
    hex: "#2B2D42",
    rgb: "43, 45, 66",
    psychology:
      "Represents uncompromising mastery, benchmark standards, and precision.",
    recommendedUsage:
      "Core typography, high-contrast borders, and institutional badges.",
  },

  integrity: {
    name: "Steadfast Slate Blue",
    hex: "#3D5A80",
    rgb: "61, 90, 128",
    psychology:
      "Signals unshakeable ethical grounding, reliability, and institutional trust.",
    recommendedUsage:
      "Strategic manifesto headers, data tables, and advisory seals.",
  },

  freedom: {
    name: "Burnt Coral",
    hex: "#E07A5F",
    rgb: "224, 122, 95",
    psychology:
      "Embodies independent spirit, audacious autonomy, and non-conformist vigor.",
    recommendedUsage:
      "Action buttons, provocative insight graphics, and newsletter banners.",
  },

  wisdom: {
    name: "Contemplative Sage",
    hex: "#4A5759",
    rgb: "74, 87, 89",
    psychology:
      "Communicates contemplative depth, timeless perspective, and academic rigor.",
    recommendedUsage:
      "Long-form editorial backgrounds, book covers, and podcast graphics.",
  },

  creativity: {
    name: "Regal Amethyst",
    hex: "#9B5DE5",
    rgb: "155, 93, 229",
    psychology:
      "Unlocks artistic intuition, paradigm-shifting ingenuity, and visionary flair.",
    recommendedUsage:
      "Creative case studies, portfolio accents, and conceptual diagrams.",
  },

  courage: {
    name: "Sovereign Crimson",
    hex: "#D62828",
    rgb: "214, 40, 40",
    psychology:
      "Radiates fearless conviction, decisive action, and high-impact resonance.",
    recommendedUsage:
      "High-priority highlights, alert markers, and bold headline emphasis.",
  },

  balance: {
    name: "Serene Olive Green",
    hex: "#84A98C",
    rgb: "132, 169, 140",
    psychology:
      "Inspires sustainable alignment, organic equilibrium, and holistic clarity.",
    recommendedUsage:
      "Wellness advisory modules, lifestyle themes, and balanced charts.",
  },

  leadership: {
    name: "Champagne Sovereign Gold",
    hex: "#D4AF37",
    rgb: "212, 175, 55",
    psychology:
      "Denotes sovereign prestige, benchmark authority, and illuminated guidance.",
    recommendedUsage:
      "Luxury signature marks, premium certifications, and VIP tier cards.",
  },

  impact: {
    name: "Warm Copper Catalyst",
    hex: "#C17C59",
    rgb: "193, 124, 89",
    psychology:
      "Represents tangible societal resonance, catalytic execution, and enduring footprint.",
    recommendedUsage:
      "Milestone badges, transformation case studies, and call-to-action cards.",
  },

  precision: {
    name: "Nordic Mineral Charcoal",
    hex: "#3A4E5C",
    rgb: "58, 78, 92",
    psychology:
      "Reflects surgical sharpness, methodical execution, and zero ambiguity.",
    recommendedUsage:
      "Metric dividers, system flowcharts, and technical advisory grids.",
  },

  restraint: {
    name: "Raw Umber Earth",
    hex: "#403D39",
    rgb: "64, 61, 57",
    psychology:
      "Expresses quiet luxury, sophisticated minimalism, and confident stillness.",
    recommendedUsage:
      "Subtle borders, secondary captions, and editorial negative space.",
  },

  legacy: {
    name: "Burnished Bronze",
    hex: "#5A3D28",
    rgb: "90, 61, 40",
    psychology:
      "Emphasizes multi-generational permanence, generational wealth, and deep roots.",
    recommendedUsage:
      "Founder archives, legacy manifestos, and commemorative artifacts.",
  },
};

/**
 * Normalizes a value string into a recognized key.
 */
function normalizeValueKey(valueStr: string): string {
  const clean = valueStr.toLowerCase().replace(/[^a-z]/g, "");

  if (clean.includes("authentic")) return "authenticity";
  if (clean.includes("ambit") || clean.includes("achieve")) return "ambition";
  if (clean.includes("innovat") || clean.includes("vision")) {
    return "innovation";
  }
  if (clean.includes("empath") || clean.includes("compassion")) {
    return "empathy";
  }
  if (clean.includes("excel") || clean.includes("quality")) {
    return "excellence";
  }
  if (clean.includes("integri") || clean.includes("trust")) {
    return "integrity";
  }
  if (clean.includes("freedom") || clean.includes("autonom")) {
    return "freedom";
  }
  if (clean.includes("wis") || clean.includes("knowledg")) {
    return "wisdom";
  }
  if (clean.includes("creat") || clean.includes("art")) {
    return "creativity";
  }
  if (clean.includes("courag") || clean.includes("bold")) {
    return "courage";
  }
  if (clean.includes("balanc") || clean.includes("harmon")) {
    return "balance";
  }
  if (clean.includes("leader") || clean.includes("influenc")) {
    return "leadership";
  }
  if (clean.includes("impact")) return "impact";
  if (clean.includes("precis") || clean.includes("clarity")) {
    return "precision";
  }
  if (clean.includes("restrain") || clean.includes("minimal")) {
    return "restraint";
  }
  if (clean.includes("legacy")) return "legacy";

  return "authenticity";
}

/**
 * Generates a tailored 5-color palette based on the user's top personal values.
 */
export function generateColorPaletteFromValues(
  selectedValues: string[] = []
): ColorPaletteResult {
  const v1Key = selectedValues[0]
    ? normalizeValueKey(selectedValues[0])
    : "authenticity";

  const v2Key = selectedValues[1]
    ? normalizeValueKey(selectedValues[1])
    : "excellence";

  const v3Key = selectedValues[2]
    ? normalizeValueKey(selectedValues[2])
    : "leadership";

  const v1Def =
    VALUE_COLOR_MAP[v1Key] || VALUE_COLOR_MAP.authenticity;

  const v2Def =
    VALUE_COLOR_MAP[v2Key] || VALUE_COLOR_MAP.excellence;

  const v3Def =
    VALUE_COLOR_MAP[v3Key] || VALUE_COLOR_MAP.leadership;

  const primary: ColorItem = {
    role: "primary",
    roleTitle: "Dominant Brand Color (60%)",
    name: v1Def.name,
    hex: v1Def.hex,
    rgb: v1Def.rgb,
    psychology: v1Def.psychology,
    recommendedUsage: v1Def.recommendedUsage,
    valueAnchor: selectedValues[0] || "Authenticity",
  };

  const secondary: ColorItem = {
    role: "secondary",
    roleTitle: "Supporting Structure (30%)",
    name: v2Def.name,
    hex: v2Def.hex,
    rgb: v2Def.rgb,
    psychology: v2Def.psychology,
    recommendedUsage: v2Def.recommendedUsage,
    valueAnchor: selectedValues[1] || "Excellence",
  };

  const accent: ColorItem = {
    role: "accent",
    roleTitle: "Catalyst Accent (10%)",
    name: v3Def.name,
    hex: v3Def.hex,
    rgb: v3Def.rgb,
    psychology: v3Def.psychology,
    recommendedUsage: v3Def.recommendedUsage,
    valueAnchor: selectedValues[2] || "Leadership",
  };

  const darkNeutral: ColorItem = {
    role: "darkNeutral",
    roleTitle: "Executive Dark Neutral",
    name: "Architectural Obsidian",
    hex: "#171519",
    rgb: "23, 21, 25",
    psychology:
      "Provides deep structural grounding, authoritative contrast, and timeless elegance.",
    recommendedUsage:
      "High-contrast backgrounds, body typography, and formal container borders.",
  };

  const lightNeutral: ColorItem = {
    role: "lightNeutral",
    roleTitle: "Linen Warm Neutral",
    name: "Warm Ivory Linen",
    hex: "#F8F5F1",
    rgb: "248, 245, 241",
    psychology:
      "Creates generous negative space, gentle optical breathing room, and quiet luxury canvas.",
    recommendedUsage:
      "Primary content canvases, subtle card surfaces, and clean background fields.",
  };

  const overallStrategy = `This custom palette anchors your personal brand in the 60-30-10 editorial rule: ${primary.name} (${primary.hex}) leads with ${primary.valueAnchor} energy, complemented by ${secondary.name} (${secondary.hex}) for structural discipline, and sparked by ${accent.name} (${accent.hex}) to command high-priority visual focus.`;

  return {
    primary,
    secondary,
    accent,
    darkNeutral,
    lightNeutral,
    derivedFromValues: [
      primary.valueAnchor || "",
      secondary.valueAnchor || "",
      accent.valueAnchor || "",
    ],
    overallStrategy,
  };
}