import { INITIAL_VALUES } from "@/lib/brand-engine/values";
import { ARCHETYPES_LIST } from "@/lib/brand-engine/archetypes";

export type AssessmentQuestionType =
  | "text"
  | "values"
  | "archetypes"
  | "textarea"
  | "ikigai"
  | "perception"
  | "voice";

export interface AssessmentQuestion {
  id: string;
  type: AssessmentQuestionType;
  title: string;
  description?: string;
  required?: boolean;
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "identity",
    type: "text",
    title: "How should we define your professional identity?",
    description:
      "Tell us your name and the professional identity you want your brand to represent.",
    required: true,
  },

  {
    id: "values",
    type: "values",
    title: "What do you stand for?",
    description:
      "Select the 3 values that most strongly define how you think, act, and make decisions.",
    required: true,
  },

  {
    id: "archetypes",
    type: "archetypes",
    title: "Which identity feels most like you?",
    description:
      "Choose one primary archetype and one secondary archetype.",
    required: true,
  },

  {
    id: "purpose",
    type: "textarea",
    title: "What is your purpose?",
    description:
      "What do you want your work and presence to contribute to the world?",
    required: true,
  },

  {
    id: "vision",
    type: "textarea",
    title: "What do you want to become known for?",
    description:
      "Describe the professional future and reputation you want to build.",
    required: true,
  },

  {
    id: "ikigai",
    type: "ikigai",
    title: "What sits at the intersection of your Ikigai?",
    description:
      "Explore what you love, what the world needs, what you are good at, and what you can build a career around.",
    required: true,
  },

  {
    id: "perception",
    type: "perception",
    title: "How should people perceive you?",
    description:
      "Position your brand between these strategic dimensions.",
    required: true,
  },

  {
    id: "voice",
    type: "voice",
    title: "How should your brand sound?",
    description:
      "Choose up to 4 tones that should define your communication.",
    required: true,
  },
];

export const VALUE_OPTIONS = INITIAL_VALUES;

export const ARCHETYPE_OPTIONS = ARCHETYPES_LIST;

export const VOICE_TONES = [
  "Authoritative",
  "Refined",
  "Analytical",
  "Concise",
  "Provocative",
  "Elevated",
  "Direct",
  "Philosophical",
] as const;

export const PERCEPTION_DIMENSIONS = [
  {
    id: "authorityVsAccessibility",
    leftLabel: "Accessibility",
    rightLabel: "Authority",
  },
  {
    id: "innovationVsTradition",
    leftLabel: "Tradition",
    rightLabel: "Innovation",
  },
  {
    id: "provocativeVsReassuring",
    leftLabel: "Reassurance",
    rightLabel: "Provocation",
  },
  {
    id: "specialistVsPolymath",
    leftLabel: "Specialist",
    rightLabel: "Polymath",
  },
] as const;