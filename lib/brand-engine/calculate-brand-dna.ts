import type {
  BrandDNASummary,
  ColorPalette,
  IkigaiPillars,
  PerceptionAlignment,
  VoiceProfile,
} from "@/types/brand-dna";

import type { AssessmentDraft } from "@/types/assessment";

import { ARCHETYPES_LIST } from "./archetypes";
import { generateColorPaletteFromValues } from "./color-intelligence";

export interface BrandDNAInput {
  personName: string;
  title?: string;

  values: string[];

  primaryArchetypeId: string;
  secondaryArchetypeId: string;

  purpose: string;
  vision: string;

  perception: PerceptionAlignment;

  ikigai: IkigaiPillars;

  selectedTones: string[];
}

function findArchetype(id: string) {
  return (
    ARCHETYPES_LIST.find((archetype) => archetype.id === id) ??
    ARCHETYPES_LIST[0]
  );
}

function normalizeValues(values: string[]): string[] {
  return values
    .filter((value) => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeTones(tone: string[]): string[] {
  return tone
    .filter((value) => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function normalizePerception(
  perception: PerceptionAlignment
): PerceptionAlignment {
  const clamp = (value: number) => {
    if (!Number.isFinite(value)) {
      return 50;
    }

    return Math.max(0, Math.min(100, value));
  };

  return {
    authorityVsAccessibility: clamp(
      perception.authorityVsAccessibility
    ),
    innovationVsTradition: clamp(
      perception.innovationVsTradition
    ),
    provocativeVsReassuring: clamp(
      perception.provocativeVsReassuring
    ),
    specialistVsPolymath: clamp(
      perception.specialistVsPolymath
    ),
  };
}

function normalizeIkigai(
  ikigai: IkigaiPillars
): IkigaiPillars {
  return {
    passion: ikigai.passion?.trim() ?? "",
    mission: ikigai.mission?.trim() ?? "",
    vocation: ikigai.vocation?.trim() ?? "",
    profession: ikigai.profession?.trim() ?? "",
    intersection:
      ikigai.intersection?.trim() || undefined,
  };
}

function buildPurpose(
  purpose: string,
  ikigai: IkigaiPillars
): string {
  if (purpose.trim()) {
    return purpose.trim();
  }

  if (ikigai.intersection?.trim()) {
    return ikigai.intersection.trim();
  }

  if (ikigai.mission.trim()) {
    return ikigai.mission.trim();
  }

  return "To create meaningful value through authentic expertise and strategic action.";
}

function buildVision(
  vision: string,
  ikigai: IkigaiPillars
): string {
  if (vision.trim()) {
    return vision.trim();
  }

  if (ikigai.profession.trim()) {
    return ikigai.profession.trim();
  }

  return "To build a distinctive and credible personal brand with lasting impact.";
}

function buildVoiceProfile(
  selectedTones: string[],
  primaryArchetypeId: string
): VoiceProfile {
  const tones = normalizeTones(selectedTones);

  if (tones.length > 0) {
    return {
      tone: tones,
      style: buildVoiceStyle(tones),
    };
  }

  const defaultTones: Record<string, string[]> = {
    sage: [
      "Analytical",
      "Authoritative",
      "Philosophical",
    ],
    ruler: [
      "Authoritative",
      "Direct",
      "Refined",
    ],
    creator: [
      "Refined",
      "Elevated",
      "Provocative",
    ],
    visionary: [
      "Provocative",
      "Elevated",
      "Philosophical",
    ],
    outlaw: [
      "Provocative",
      "Direct",
      "Authoritative",
    ],
    hero: [
      "Direct",
      "Authoritative",
      "Concise",
    ],
  };

  const fallback =
    defaultTones[primaryArchetypeId] ?? [
      "Authoritative",
      "Refined",
      "Direct",
    ];

  return {
    tone: fallback,
    style: buildVoiceStyle(fallback),
  };
}

function buildVoiceStyle(
  tones: string[]
): string {
  if (tones.length === 0) {
    return "Clear, intentional, and strategically composed.";
  }

  if (tones.length === 1) {
    return `${tones[0]} communication with a clear and intentional presence.`;
  }

  if (tones.length === 2) {
    return `${tones[0]} and ${tones[1].toLowerCase()} communication with a clear and intentional presence.`;
  }

  const first = tones
    .slice(0, -1)
    .join(", ");

  const last = tones[tones.length - 1];

  return `${first}, and ${last.toLowerCase()} communication with a clear and intentional presence.`;
}

function buildExecutivePositioning(
  primaryArchetypeTitle: string,
  values: string[],
  purpose: string
): string {
  const valueText =
    values.length > 0
      ? values.slice(0, 3).join(", ")
      : "clarity, excellence, and impact";

  return `Position yourself as ${primaryArchetypeTitle} — someone defined by ${valueText.toLowerCase()}, with a clear purpose: ${purpose}`;
}

function buildElevatorPitch(
  personName: string,
  primaryArchetypeTitle: string,
  purpose: string
): string {
  const archetypeName = primaryArchetypeTitle.replace(
    /^The\s+/i,
    ""
  );

  if (personName.trim()) {
    return `${personName.trim()} is a ${archetypeName} focused on ${purpose.toLowerCase()}`;
  }

  return `I am a ${archetypeName} focused on ${purpose.toLowerCase()}`;
}

function buildManifesto(
  primaryArchetype: ReturnType<typeof findArchetype>,
  values: string[],
  purpose: string,
  vision: string
): string {
  const valueStatement =
    values.length > 0
      ? `I lead with ${values
          .slice(0, 3)
          .join(", ")
          .toLowerCase()}.`
      : "I lead with intention, clarity, and conviction.";

  return [
    `I embody ${primaryArchetype.title}.`,
    valueStatement,
    `My purpose is ${purpose}`,
    `My vision is ${vision}`,
    "I choose to build a presence that is intentional, credible, and unmistakably mine.",
  ].join(" ");
}

function buildContentPillars(
  primaryArchetype: ReturnType<typeof findArchetype>,
  values: string[],
  ikigai: IkigaiPillars
) {
  const pillars: {
    title: string;
    description: string;
  }[] = [];

  if (values[0]) {
    pillars.push({
      title: values[0],
      description: `Content exploring how ${values[0].toLowerCase()} shapes decisions, perspectives, and personal positioning.`,
    });
  }

  if (values[1]) {
    pillars.push({
      title: values[1],
      description: `Practical insights around ${values[1].toLowerCase()} and how it creates distinctive professional value.`,
    });
  }

  if (values[2]) {
    pillars.push({
      title: values[2],
      description: `Ideas, stories, and frameworks demonstrating ${values[2].toLowerCase()} in action.`,
    });
  }

  pillars.push({
    title: primaryArchetype.title,
    description: primaryArchetype.description,
  });

  if (ikigai.mission) {
    pillars.push({
      title: "Mission",
      description: ikigai.mission,
    });
  }

  return pillars.slice(0, 5);
}

function buildStrategicAdvice(
  primaryArchetype: ReturnType<typeof findArchetype>,
  secondaryArchetype: ReturnType<typeof findArchetype>,
  perception: PerceptionAlignment,
  values: string[]
): string[] {
  const advice: string[] = [];

  if (
    perception.authorityVsAccessibility >= 70
  ) {
    advice.push(
      "Lead with expertise and clear points of view while maintaining enough accessibility to remain relatable."
    );
  } else if (
    perception.authorityVsAccessibility <= 30
  ) {
    advice.push(
      "Build stronger authority signals through expertise, evidence, frameworks, and confident positioning."
    );
  } else {
    advice.push(
      "Maintain a deliberate balance between authority and accessibility in your communication."
    );
  }

  if (
    perception.innovationVsTradition >= 70
  ) {
    advice.push(
      "Make innovation visible through original frameworks, unconventional perspectives, and forward-looking ideas."
    );
  } else if (
    perception.innovationVsTradition <= 30
  ) {
    advice.push(
      "Strengthen credibility by connecting your ideas to proven principles, experience, and established expertise."
    );
  }

  if (
    perception.provocativeVsReassuring >= 70
  ) {
    advice.push(
      "Use strong opinions and constructive tension to make your ideas memorable."
    );
  } else if (
    perception.provocativeVsReassuring <= 30
  ) {
    advice.push(
      "Build trust through reassuring clarity, consistency, and evidence-led communication."
    );
  }

  if (
    perception.specialistVsPolymath >= 70
  ) {
    advice.push(
      "Show the connections between disciplines while keeping a coherent central narrative."
    );
  } else if (
    perception.specialistVsPolymath <= 30
  ) {
    advice.push(
      "Own a recognizable area of expertise and repeatedly reinforce your specialist authority."
    );
  }

  if (values.length > 0) {
    advice.push(
      `Make ${values[0].toLowerCase()} visible through your actions, content, and professional decisions rather than treating it as a slogan.`
    );
  }

  if (
    primaryArchetype.id !==
    secondaryArchetype.id
  ) {
    advice.push(
      `Use ${primaryArchetype.title} as the dominant identity while allowing ${secondaryArchetype.title} to add dimension and differentiation.`
    );
  }

  return advice.slice(0, 6);
}

/**
 * Converts assessment answers into a deterministic Brand DNA.
 *
 * No AI is used here.
 * The same assessment input always produces the same Brand DNA.
 */
export function calculateBrandDNA(
  input: BrandDNAInput
): BrandDNASummary {
  const values = normalizeValues(input.values);

  const primaryArchetype = findArchetype(
    input.primaryArchetypeId
  );

  const secondaryArchetype = findArchetype(
    input.secondaryArchetypeId
  );

  const perception = normalizePerception(
    input.perception
  );

  const ikigai = normalizeIkigai(
    input.ikigai
  );

  const purpose = buildPurpose(
    input.purpose,
    ikigai
  );

  const vision = buildVision(
    input.vision,
    ikigai
  );

  const voice = buildVoiceProfile(
    input.selectedTones,
    primaryArchetype.id
  );

  const colorResult =
    generateColorPaletteFromValues(values);

  const colorPalette: ColorPalette = {
    primary: colorResult.primary.hex,
    secondary: colorResult.secondary.hex,
    accent: colorResult.accent.hex,
    darkNeutral:
      colorResult.darkNeutral.hex,
    lightNeutral:
      colorResult.lightNeutral.hex,
  };

  const strategicManifesto =
    buildManifesto(
      primaryArchetype,
      values,
      purpose,
      vision
    );

  const executivePositioning =
    buildExecutivePositioning(
      primaryArchetype.title,
      values,
      purpose
    );

  const elevatorPitch =
    buildElevatorPitch(
      input.personName,
      primaryArchetype.title,
      purpose
    );

  const contentPillars =
    buildContentPillars(
      primaryArchetype,
      values,
      ikigai
    );

  const strategicAdvices =
    buildStrategicAdvice(
      primaryArchetype,
      secondaryArchetype,
      perception,
      values
    );

  return {
    personName: input.personName.trim(),

    title:
      input.title?.trim() || undefined,

    values,

    primaryArchetype,

    secondaryArchetype,

    purpose,

    vision,

    voice,

    perception,

    ikigai,

    colorPalette,

    strategicManifesto,

    executivePositioning,

    elevatorPitch,

    contentPillars,

    strategicAdvices,

    completedAt:
      new Date().toISOString(),
  };
}

/**
 * Converts the current assessment draft
 * directly into a Brand DNA result.
 */
export function calculateBrandDNAFromAssessment(
  assessment: AssessmentDraft
): BrandDNASummary {
  return calculateBrandDNA({
    personName:
      assessment.personName,

    values:
      assessment.selectedValues,

    primaryArchetypeId:
      assessment.primaryArchetypeId,

    secondaryArchetypeId:
      assessment.secondaryArchetypeId,

    purpose:
      assessment.purpose,

    vision:
      assessment.vision,

    perception:
      assessment.perception,

    ikigai:
      assessment.ikigai,

    selectedTones:
      assessment.selectedTones,
  });
}