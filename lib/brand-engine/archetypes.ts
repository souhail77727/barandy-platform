import type { Archetype } from "@/types/brand-dna";

export const ARCHETYPES_LIST: Archetype[] = [
  {
    id: "sage",
    title: "The Sage",
    subtitle: "The Truth Seeker & Analytical Authority",
    description:
      "Seeking truth through analytical intelligence. Communicating with quiet authority and clarity.",
    dominance: 85,
    traits: [
      "Analytical intelligence",
      "Objective clarity",
      "Deep expertise",
      "Intellectual rigor",
    ],
    motto: "The truth will set your strategy free.",
    shadow: "Over-analysis, emotional detachment",
    icon: "psychology",
  },
  {
    id: "ruler",
    title: "The Sovereign",
    subtitle: "The Benchmark Setter & Architect of Order",
    description:
      "Creating prosperous systems and commanding authority through structured excellence.",
    dominance: 78,
    traits: [
      "Executive presence",
      "Benchmark setter",
      "High standards",
      "Decisive command",
    ],
    motto: "Power is structural responsibility.",
    shadow: "Authoritarianism, resistance to evolution",
    icon: "crown",
  },
  {
    id: "creator",
    title: "The Creator",
    subtitle: "The Visionary Artisan & Pioneer",
    description:
      "Giving form to what has never existed before, marrying aesthetic elegance with disruptive utility.",
    dominance: 82,
    traits: [
      "Artistic intuition",
      "Originality",
      "Craftsmanship",
      "Aesthetic mastery",
    ],
    motto: "If it can be imagined, it can be constructed.",
    shadow: "Perfectionism, endless iteration",
    icon: "draw",
  },
  {
    id: "visionary",
    title: "The Magician / Visionary",
    subtitle: "The Catalyst for Transformation",
    description:
      "Making dreams tangible by decoding fundamental laws and unlocking exponential shifts in perspective.",
    dominance: 80,
    traits: [
      "Paradigm shifting",
      "Catalytic impact",
      "Intuitive foresight",
      "Charismatic momentum",
    ],
    motto: "Make the impossible inevitable.",
    shadow: "Impractical idealism, manipulation",
    icon: "auto_awesome",
  },
  {
    id: "outlaw",
    title: "The Maverick / Rebel",
    subtitle: "The Challenger of Orthodoxy",
    description:
      "Rejecting dogmatic rules to spark genuine revolution and pioneer uncontested blue oceans.",
    dominance: 72,
    traits: [
      "Counter-intuitive thinking",
      "Bravery",
      "Radical authenticity",
      "Rule dismantler",
    ],
    motto: "Rules are made for those who lack vision.",
    shadow: "Destructive rebellion, needless friction",
    icon: "bolt",
  },
  {
    id: "hero",
    title: "The Champion",
    subtitle: "The Victorious Standard-Bearer",
    description:
      "Overcoming impossible odds through sheer discipline, resilience, and unyielding focus on victory.",
    dominance: 70,
    traits: [
      "Relentless drive",
      "Courage",
      "Mastery under pressure",
      "Tenacity",
    ],
    motto: "Where there is will, there is mastery.",
    shadow: "Burnout, relentless competitiveness",
    icon: "military_tech",
  },
];