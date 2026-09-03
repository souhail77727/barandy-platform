import type {
  IkigaiPillars,
  PerceptionAlignment,
} from "./brand-dna";

export interface AssessmentDraft {
  step: number;

  selectedValues: string[];

  primaryArchetypeId: string;
  secondaryArchetypeId: string;

  personName: string;
  purpose: string;
  vision: string;

  perception: PerceptionAlignment;

  ikigai: IkigaiPillars;

  selectedTones: string[];

  lastSaved?: string;
}