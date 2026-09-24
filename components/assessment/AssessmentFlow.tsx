"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  Globe2,
  Heart,
  LockKeyhole,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import ClientHeader from "@/components/layout/ClientHeader";

import {
  ARCHETYPE_OPTIONS,
  ASSESSMENT_QUESTIONS,
  PERCEPTION_DIMENSIONS,
  VALUE_OPTIONS,
  VOICE_TONES,
} from "@/lib/assessment/questions";

import type { AssessmentDraft } from "@/types/assessment";

const TOTAL_STEPS = ASSESSMENT_QUESTIONS.length;

type Language = "en" | "fr";

const UI_TEXT = {
  en: {
    brandDiscovery: "Brand Discovery",
    assessmentReview: "Assessment Review",
    savedAutomatically: "Your answers are saved automatically",
    reviewingAnswers: "Reviewing your saved answers",
    progress: "Progress",
    complete: "complete",
    step: "Step",
    finalStep: "Final step",
    stepsRemaining: "steps remaining",
    stepRemaining: "step remaining",
    foundation: "Foundation",
    values: "Values",
    identity: "Identity",
    purpose: "Purpose",
    direction: "Direction",
    ikigai: "Ikigai",
    perception: "Perception",
    expression: "Expression",
    discovery: "Discovery",
    yourName: "Your name",
    fullName: "Your full name",
    namePlaceholder: "e.g. Sarah Bennani",
    personalName:
      "We'll use your name to make your Brand DNA feel personal from the first page to the last.",
    chooseValues: "Which three values should guide your brand?",
    trustInstinct:
      "Trust your instinct. Choose the ones that feel most like you.",
    selected: "Selected",
    lockedValues: "Your three values are locked in.",
    chooseExactly3: "Choose exactly 3 values that represent you.",
    primaryArchetype: "Your primary archetype",
    secondaryArchetype: "Your secondary archetype",
    primaryDescription:
      "The energy that most strongly represents who you are.",
    secondaryDescription:
      "A complementary energy that adds nuance to your identity.",
    coreIdentity: "01 · Core identity",
    supportingIdentity: "02 · Supporting identity",
    primary: "Primary",
    secondary: "Secondary",
    identityMapped: "Identity mapped",
    identityMappedDescription:
      "Your primary and secondary archetypes now give us two dimensions of your brand personality.",
    purposePlaceholder:
      "e.g. Helping founders turn bold ideas into sustainable businesses…",
    visionPlaceholder:
      "e.g. To become a reference voice on intentional brand building in North Africa…",
    writeFreely:
      "Write freely. What drives the work you want to be known for?",
    professionalFuture:
      "Imagine your professional future. What are you building toward?",
    savedResponse: "Saved response",
    writeOwnWords: "Write in your own words",
    characters: "characters",
    noPerfectAnswer:
      "There is no perfect answer. Authentic answers create a more accurate Brand DNA.",
    ikigaiIntro:
      "Look at your professional life from four different angles. Don't overthink it.",
    whatYouLove: "What you love",
    loveHelper: "What naturally energizes you?",
    worldNeeds: "What the world needs",
    missionHelper:
      "What change do you want to contribute to?",
    goodAt: "What you are good at",
    vocationHelper:
      "Where do your natural strengths show up?",
    career: "What you can build a career around",
    professionHelper:
      "What can create real professional value?",
    optional: "Optional",
    intersection: "Your intersection",
    intersectionHelper:
      "Where do these four dimensions meet?",
    intersectionPlaceholder:
      "Describe the space where your passion, strengths, contribution and career intersect.",
    ikigaiPlaceholderPassion:
      "e.g. Building things, teaching, writing, mentoring…",
    ikigaiPlaceholderMission:
      "e.g. Helping founders find clarity…",
    ikigaiPlaceholderVocation:
      "e.g. Strategic thinking, storytelling, design…",
    ikigaiPlaceholderProfession:
      "e.g. Consulting, product design, teaching…",
    ikigaiPlaceholderIntersection:
      "Describe the space where these four dimensions meet…",
    perceptionIntro:
      "Move each scale toward the side that feels more natural to you. Think instinctively rather than strategically.",
    positioning:
      "Your answers create a unique positioning profile. There is no ideal score.",
    perceptionPosition: "Position",
    perceptionStrength: "Strength",
    perceptionBalanced: "Balanced",
    perceptionClearly: "Clearly",
    perceptionLeaning: "Leaning",
    perceptionSlightly: "Slightly",
    voiceIntro: "Choose the qualities your voice should communicate.",
    voicePick:
      "Pick up to four. Think about how you want people to experience your communication.",
    voiceTakingShape: "Your voice is starting to take shape.",
    previous: "Previous",
    continue: "Continue",
    next: "Next",
    generate: "Generate My Brand DNA",
    viewDNA: "View My Brand DNA",
    saving: "Saving your answer...",
    creating: "Creating your profile...",
    progressSaved: "Your progress is saved automatically",
    reviewSaved: "Reviewing saved answers",
    addName: "Add your name to continue.",
    purposeValidation:
      "Take a moment to describe your purpose.",
    visionValidation:
      "Describe the professional future you want to build.",
    ikigaiValidation:
      "Complete the four required Ikigai dimensions.",
    voiceValidation:
      "Choose at least one tone for your brand voice.",
    archetypeValidation:
      "Choose one primary and one secondary archetype.",
    english: "English",
    french: "Français",
    preparing: "Preparing your experience",
    preparingDescription:
      "We're preparing your personal brand discovery workspace.",
    accessPending: "Access pending",
    assessmentWaiting: "Your assessment is waiting for you.",
    accountCreated:
      "Your account has been created successfully. Once your payment has been verified, your assessment experience will be activated.",
    whatNext: "What happens next?",
    payment: "Complete your payment",
    paymentDescription:
      "Follow the payment instructions available in your Barandy account.",
    receipt: "Send your receipt",
    receiptDescription:
      "Send your payment receipt to the Barandy team for verification.",
    unlocked: "Assessment unlocked",
    unlockedDescription:
      "Once verified, your personal brand assessment becomes available.",
    paymentInstructions: "View Payment Instructions",
    completedAssessment: "Completed assessment",
    readOnly:
      "Your answers are safely stored. You are viewing them in read-only mode.",
    primarySelected: "Primary selected",
    barandyFooter: "Barandy · Personal Brand Intelligence",
    noPerfect:
      "There is no perfect answer. Authentic answers create a more accurate Brand DNA.",
    word: "word",
    words: "words",
    ikigaiAddMore: "Keep going",
    ikigaiStrongAnswer: "Strong answer",
    ikigaiSynthesis: "Synthesis",
  },
  fr: {
    brandDiscovery: "Découverte de votre marque",
    assessmentReview: "Révision de l'assessment",
    savedAutomatically:
      "Vos réponses sont enregistrées automatiquement",
    reviewingAnswers:
      "Révision de vos réponses enregistrées",
    progress: "Progression",
    complete: "terminé",
    step: "Étape",
    finalStep: "Dernière étape",
    stepsRemaining: "étapes restantes",
    stepRemaining: "étape restante",
    foundation: "Fondation",
    values: "Valeurs",
    identity: "Identité",
    purpose: "Mission",
    direction: "Direction",
    ikigai: "Ikigai",
    perception: "Perception",
    expression: "Expression",
    discovery: "Découverte",
    yourName: "Votre nom",
    fullName: "Votre nom complet",
    namePlaceholder: "ex. Sarah Bennani",
    personalName:
      "Votre nom nous permet de rendre votre Brand DNA personnel dès la première page.",
    chooseValues:
      "Quelles sont les trois valeurs qui doivent guider votre marque ?",
    trustInstinct:
      "Faites confiance à votre instinct. Choisissez celles qui vous ressemblent le plus.",
    selected: "Sélectionné",
    lockedValues:
      "Vos trois valeurs sont maintenant définies.",
    chooseExactly3:
      "Choisissez exactement 3 valeurs qui vous représentent.",
    primaryArchetype: "Votre archétype principal",
    secondaryArchetype: "Votre archétype secondaire",
    primaryDescription:
      "L'énergie qui représente le plus fortement qui vous êtes.",
    secondaryDescription:
      "Une énergie complémentaire qui apporte de la nuance à votre identité.",
    coreIdentity: "01 · Identité principale",
    supportingIdentity: "02 · Identité complémentaire",
    primary: "Principal",
    secondary: "Secondaire",
    identityMapped: "Identité définie",
    identityMappedDescription:
      "Vos archétypes principal et secondaire nous donnent deux dimensions de votre personnalité de marque.",
    purposePlaceholder:
      "ex. Aider les fondateurs à transformer des idées audacieuses en entreprises durables…",
    visionPlaceholder:
      "ex. Devenir une voix de référence sur la construction de marque intentionnelle en Afrique du Nord…",
    writeFreely:
      "Écrivez librement. Qu'est-ce qui vous pousse à vouloir être reconnu pour votre travail ?",
    professionalFuture:
      "Imaginez votre avenir professionnel. Vers quoi construisez-vous votre parcours ?",
    savedResponse: "Réponse enregistrée",
    writeOwnWords: "Écrivez avec vos propres mots",
    characters: "caractères",
    noPerfectAnswer:
      "Il n'existe pas de réponse parfaite. Des réponses authentiques permettent de créer un Brand DNA plus précis.",
    ikigaiIntro:
      "Regardez votre vie professionnelle sous quatre angles différents. Ne réfléchissez pas trop.",
    whatYouLove: "Ce que vous aimez",
    loveHelper:
      "Qu'est-ce qui vous donne naturellement de l'énergie ?",
    worldNeeds: "Ce dont le monde a besoin",
    missionHelper:
      "À quel changement souhaitez-vous contribuer ?",
    goodAt: "Ce dans quoi vous êtes bon",
    vocationHelper:
      "Où vos forces naturelles se manifestent-elles ?",
    career:
      "Ce autour de quoi vous pouvez construire une carrière",
    professionHelper:
      "Qu'est-ce qui peut créer une réelle valeur professionnelle ?",
    optional: "Optionnel",
    intersection: "Votre intersection",
    intersectionHelper:
      "Où ces quatre dimensions se rencontrent-elles ?",
    intersectionPlaceholder:
      "Décrivez l'espace où votre passion, vos forces, votre contribution et votre carrière se rencontrent.",
    ikigaiPlaceholderPassion:
      "ex. Créer, enseigner, écrire, transmettre…",
    ikigaiPlaceholderMission:
      "ex. Aider les fondateurs à y voir plus clair…",
    ikigaiPlaceholderVocation:
      "ex. Pensée stratégique, narration, design…",
    ikigaiPlaceholderProfession:
      "ex. Conseil, design produit, enseignement…",
    ikigaiPlaceholderIntersection:
      "Décrivez l'espace où ces quatre dimensions se rencontrent…",
    perceptionIntro:
      "Déplacez chaque curseur vers le côté qui vous semble le plus naturel. Faites confiance à votre instinct plutôt qu'à votre stratégie.",
    positioning:
      "Vos réponses créent un profil de positionnement unique. Il n'existe pas de score idéal.",
    perceptionPosition: "Position",
    perceptionStrength: "Intensité",
    perceptionBalanced: "Équilibré",
    perceptionClearly: "Nettement",
    perceptionLeaning: "Plutôt",
    perceptionSlightly: "Légèrement",
    voiceIntro:
      "Choisissez les qualités que votre voix doit communiquer.",
    voicePick:
      "Choisissez jusqu'à quatre tonalités. Pensez à la manière dont vous voulez que votre communication soit perçue.",
    voiceTakingShape:
      "Votre voix de marque commence à prendre forme.",
    previous: "Précédent",
    continue: "Continuer",
    next: "Suivant",
    generate: "Générer mon Brand DNA",
    viewDNA: "Voir mon Brand DNA",
    saving: "Enregistrement...",
    creating: "Création de votre profil...",
    progressSaved:
      "Votre progression est enregistrée automatiquement",
    reviewSaved: "Révision des réponses enregistrées",
    addName: "Ajoutez votre nom pour continuer.",
    purposeValidation:
      "Prenez un moment pour décrire votre mission.",
    visionValidation:
      "Décrivez l'avenir professionnel que vous souhaitez construire.",
    ikigaiValidation:
      "Complétez les quatre dimensions obligatoires de votre Ikigai.",
    voiceValidation:
      "Choisissez au moins une tonalité pour votre voix de marque.",
    archetypeValidation:
      "Choisissez un archétype principal et un archétype secondaire.",
    english: "English",
    french: "Français",
    preparing: "Préparation de votre expérience",
    preparingDescription:
      "Nous préparons votre espace de découverte de marque personnelle.",
    accessPending: "Accès en attente",
    assessmentWaiting: "Votre assessment vous attend.",
    accountCreated:
      "Votre compte a bien été créé. Une fois votre paiement vérifié, votre expérience d'assessment sera activée.",
    whatNext: "Que se passe-t-il ensuite ?",
    payment: "Effectuez votre paiement",
    paymentDescription:
      "Suivez les instructions de paiement disponibles dans votre compte Barandy.",
    receipt: "Envoyez votre reçu",
    receiptDescription:
      "Envoyez votre reçu de paiement à l'équipe Barandy pour vérification.",
    unlocked: "Assessment débloqué",
    unlockedDescription:
      "Une fois vérifié, votre assessment de marque personnelle sera disponible.",
    paymentInstructions:
      "Voir les instructions de paiement",
    completedAssessment: "Assessment terminé",
    readOnly:
      "Vos réponses sont enregistrées en toute sécurité. Vous les consultez en mode lecture seule.",
    primarySelected: "Principal sélectionné",
    barandyFooter: "Barandy · Personal Brand Intelligence",
    noPerfect:
      "Il n'existe pas de réponse parfaite. Des réponses authentiques permettent de créer un Brand DNA plus précis.",
    word: "mot",
    words: "mots",
    ikigaiAddMore: "Continuez",
    ikigaiStrongAnswer: "Réponse solide",
    ikigaiSynthesis: "Synthèse",
  },
} as const;

const QUESTION_COPY = {
  identity: {
    en: [
      "How should we define your professional identity?",
      "Tell us your name and the professional identity you want your brand to represent.",
    ],
    fr: [
      "Comment définir votre identité professionnelle ?",
      "Donnez-nous votre nom et l'identité professionnelle que votre marque doit représenter.",
    ],
  },
  values: {
    en: [
      "What do you stand for?",
      "Select the 3 values that most strongly define how you think, act, and make decisions.",
    ],
    fr: [
      "Qu'est-ce qui vous définit ?",
      "Sélectionnez les 3 valeurs qui définissent le plus fortement votre manière de penser, d'agir et de décider.",
    ],
  },
  archetypes: {
    en: [
      "Which identity feels most like you?",
      "Choose one primary archetype and one secondary archetype.",
    ],
    fr: [
      "Quelle identité vous ressemble le plus ?",
      "Choisissez un archétype principal et un archétype secondaire.",
    ],
  },
  purpose: {
    en: [
      "What is your purpose?",
      "What do you want your work and presence to contribute to the world?",
    ],
    fr: [
      "Quelle est votre mission ?",
      "Qu'aimeriez-vous apporter au monde à travers votre travail et votre présence ?",
    ],
  },
  vision: {
    en: [
      "What do you want to become known for?",
      "Describe the professional future and reputation you want to build.",
    ],
    fr: [
      "Pour quoi voulez-vous être reconnu ?",
      "Décrivez l'avenir professionnel et la réputation que vous souhaitez construire.",
    ],
  },
  ikigai: {
    en: [
      "What sits at the intersection of your Ikigai?",
      "Explore what you love, what the world needs, what you are good at, and what you can build a career around.",
    ],
    fr: [
      "Qu'y a-t-il à l'intersection de votre Ikigai ?",
      "Explorez ce que vous aimez, ce dont le monde a besoin, ce dans quoi vous êtes bon et ce autour de quoi vous pouvez construire une carrière.",
    ],
  },
  perception: {
    en: [
      "How should people perceive you?",
      "Position your brand between these strategic dimensions.",
    ],
    fr: [
      "Comment souhaitez-vous être perçu ?",
      "Positionnez votre marque entre ces dimensions stratégiques.",
    ],
  },
  voice: {
    en: [
      "How should your brand sound?",
      "Choose up to 4 tones that should define your communication.",
    ],
    fr: [
      "Quelle tonalité doit avoir votre marque ?",
      "Choisissez jusqu'à 4 tonalités qui doivent définir votre communication.",
    ],
  },
} as const;

const VALUE_COPY: Record<
  string,
  { fr: string; description: string }
> = {
  authenticity: {
    fr: "AUTHENTICITÉ",
    description:
      "Engagement constant envers une expression authentique et une communication transparente.",
  },
  ambition: {
    fr: "AMBITION",
    description:
      "Recherche constante d'une croissance transformative et d'objectifs ambitieux.",
  },
  impact: {
    fr: "IMPACT",
    description:
      "Créer une empreinte positive et durable sur son environnement et sa société.",
  },
  creativity: {
    fr: "CRÉATIVITÉ",
    description:
      "Utiliser une pensée innovante pour résoudre les défis complexes de manière originale.",
  },
  leadership: {
    fr: "LEADERSHIP",
    description:
      "Guider avec autorité, intégrité et vision afin d'établir de nouveaux standards.",
  },
  excellence: {
    fr: "EXCELLENCE",
    description:
      "Exiger le plus haut niveau de qualité dans chaque détail et chaque interaction.",
  },
  precision: {
    fr: "PRÉCISION STRATÉGIQUE",
    description:
      "Aligner méthodiquement intention, communication et exécution.",
  },
  restraint: {
    fr: "SOBRIÉTÉ ÉLEVÉE",
    description:
      "Attirer l'attention par le minimalisme, la confiance et une présence maîtrisée.",
  },
  integrity: {
    fr: "INTÉGRITÉ RADICALE",
    description:
      "Aligner ses convictions profondes avec ses actions, indépendamment des pressions externes.",
  },
};

const ARCHETYPE_COPY: Record<
  string,
  { title: string; subtitle: string; description: string }
> = {
  sage: {
    title: "Le Sage",
    subtitle:
      "Le chercheur de vérité & l'autorité analytique",
    description:
      "Chercher la vérité par l'intelligence analytique et communiquer avec une autorité calme et claire.",
  },
  ruler: {
    title: "Le Souverain",
    subtitle:
      "Le créateur de standards & architecte de l'ordre",
    description:
      "Créer des systèmes prospères et exercer une autorité structurée à travers l'excellence.",
  },
  creator: {
    title: "Le Créateur",
    subtitle: "L'artisan visionnaire & pionnier",
    description:
      "Donner forme à ce qui n'existe pas encore en associant élégance esthétique et utilité innovante.",
  },
  visionary: {
    title: "Le Magicien / Visionnaire",
    subtitle: "Le catalyseur de transformation",
    description:
      "Rendre les visions concrètes en transformant les perspectives et en créant de nouveaux possibles.",
  },
  outlaw: {
    title: "Le Maverick / Rebelle",
    subtitle: "Le challenger des conventions",
    description:
      "Remettre en question les règles établies pour ouvrir de nouvelles voies et créer une véritable rupture.",
  },
  hero: {
    title: "Le Champion",
    subtitle:
      "Le standard de discipline et de maîtrise",
    description:
      "Surmonter les obstacles par la discipline, la résilience et une concentration constante sur la maîtrise.",
  },
};

const VOICE_COPY: Record<string, string> = {
  Authoritative: "Autoritaire",
  Refined: "Raffinée",
  Analytical: "Analytique",
  Concise: "Concise",
  Provocative: "Provocante",
  Elevated: "Élevée",
  Direct: "Directe",
  Philosophical: "Philosophique",
};

const PERCEPTION_COPY: Record<
  string,
  { frLeft: string; frRight: string }
> = {
  authorityVsAccessibility: {
    frLeft: "Accessibilité",
    frRight: "Autorité",
  },
  innovationVsTradition: {
    frLeft: "Tradition",
    frRight: "Innovation",
  },
  provocativeVsReassuring: {
    frLeft: "Réassurance",
    frRight: "Provocation",
  },
  specialistVsPolymath: {
    frLeft: "Spécialiste",
    frRight: "Polymathe",
  },
};

function localizedQuestion(
  question: (typeof ASSESSMENT_QUESTIONS)[number],
  language: Language
) {
  const copy =
    QUESTION_COPY[question.id as keyof typeof QUESTION_COPY];
  if (!copy)
    return {
      title: question.title,
      description: question.description,
    };
  return {
    title: copy[language][0],
    description: copy[language][1],
  };
}

const INITIAL_DRAFT: AssessmentDraft = {
  step: 0,
  selectedValues: [],
  primaryArchetypeId: "",
  secondaryArchetypeId: "",
  personName: "",
  purpose: "",
  vision: "",
  perception: {
    authorityVsAccessibility: 50,
    innovationVsTradition: 50,
    provocativeVsReassuring: 50,
    specialistVsPolymath: 50,
  },
  ikigai: {
    passion: "",
    mission: "",
    vocation: "",
    profession: "",
    intersection: "",
  },
  selectedTones: [],
};

export default function AssessmentFlow() {
  const router = useRouter();

  const [draft, setDraft] =
    useState<AssessmentDraft>(INITIAL_DRAFT);

  const [isInitializing, setIsInitializing] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [accessPending, setAccessPending] =
    useState(false);

  const [isReviewMode, setIsReviewMode] =
    useState(false);

  const [direction, setDirection] =
    useState<"forward" | "back">("forward");

  const [language, setLanguage] =
    useState<Language>("en");
  const t = UI_TEXT[language];

  const questionAnchorRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const previousStepRef = useRef<number | null>(null);

  const currentQuestion =
    ASSESSMENT_QUESTIONS[draft.step];

  const progress = useMemo(() => {
    if (TOTAL_STEPS <= 0) return 0;
    return Math.round(
      ((draft.step + 1) / TOTAL_STEPS) * 100
    );
  }, [draft.step]);

  const isLastStep =
    draft.step === TOTAL_STEPS - 1;

  const isFirstStep = draft.step === 0;

  const remainingSteps =
    TOTAL_STEPS - draft.step - 1;

  const stageLabel = useMemo(() => {
    switch (currentQuestion?.id) {
      case "identity":
        return t.foundation;
      case "values":
        return t.values;
      case "archetypes":
        return t.identity;
      case "purpose":
        return t.purpose;
      case "vision":
        return t.direction;
      case "ikigai":
        return t.ikigai;
      case "perception":
        return t.perception;
      case "voice":
        return t.expression;
      default:
        return t.discovery;
    }
  }, [currentQuestion?.id, language]);

  useEffect(() => {
    const saved = window.localStorage.getItem(
      "barandy:lang"
    );
    if (saved === "fr" || saved === "en") {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "barandy:lang",
      language
    );
  }, [language]);

  useEffect(() => {
    async function initializeAssessment() {
      try {
        setIsInitializing(true);
        setError("");
        setAccessPending(false);
        setIsReviewMode(false);

        const response = await fetch(
          "/api/assessment/start",
          {
            method: "POST",
          }
        );

        const data = await response.json();

        if (
          response.status === 403 &&
          data?.code === "ACCESS_PENDING"
        ) {
          setAccessPending(true);
          return;
        }

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to start assessment."
          );
        }

        if (data.status === "COMPLETED") {
          setIsReviewMode(true);

          if (
            data.answers &&
            typeof data.answers === "object" &&
            !Array.isArray(data.answers)
          ) {
            const answers =
              data.answers as Partial<AssessmentDraft>;

            setDraft((current) => ({
              ...current,
              ...answers,
              step:
                typeof data.progress === "number"
                  ? Math.min(
                      Math.max(data.progress - 1, 0),
                      TOTAL_STEPS - 1
                    )
                  : TOTAL_STEPS - 1,
            }));
          } else {
            setDraft((current) => ({
              ...current,
              step: TOTAL_STEPS - 1,
            }));
          }

          return;
        }

        if (
          data.answers &&
          typeof data.answers === "object" &&
          !Array.isArray(data.answers)
        ) {
          const answers =
            data.answers as Partial<AssessmentDraft>;

          setDraft((current) => ({
            ...current,
            ...answers,
            step:
              typeof data.progress === "number"
                ? Math.min(
                    Math.max(data.progress - 1, 0),
                    TOTAL_STEPS - 1
                  )
                : current.step,
          }));
        }
      } catch (error) {
        console.error(
          "Assessment initialization error:",
          error
        );

        setError(
          "Unable to start your assessment. Please try again."
        );
      } finally {
        setIsInitializing(false);
      }
    }

    initializeAssessment();
  }, []);

  useEffect(() => {
    if (isInitializing) return;
    if (previousStepRef.current === draft.step) return;
    previousStepRef.current = draft.step;

    questionAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    const focusTimer = window.setTimeout(() => {
      const node =
        questionAnchorRef.current?.querySelector<HTMLElement>(
          "input:not([readonly]), textarea:not([readonly]), button:not([disabled])"
        );
      node?.focus({ preventScroll: true });
    }, 250);

    return () => window.clearTimeout(focusTimer);
  }, [draft.step, isInitializing]);

  useEffect(() => {
    if (!error) return;
    errorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [error]);

  if (isInitializing) {
    return (
      <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
        <ClientHeader
          currentPage="assessment"
          showBack
        />

        <div className="flex min-h-[75vh] items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-black/10 bg-white">
              <Compass
                className="h-5 w-5 animate-pulse text-[#8B7653]"
                strokeWidth={1.5}
              />
            </div>

            <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7653]">
              Barandy Assessment
            </p>

            <h1 className="mt-4 text-3xl font-medium tracking-tight">
              {t.preparing}
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-black/45">
              {t.preparingDescription}
            </p>

            <div className="mx-auto mt-8 h-px w-40 overflow-hidden bg-black/10">
              <div className="h-full w-1/2 animate-pulse bg-[#171519]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (accessPending) {
    return (
      <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
        <ClientHeader
          currentPage="assessment"
          showBack
        />

        <div className="mx-auto flex min-h-[75vh] max-w-5xl items-center justify-center px-6 py-16">
          <div className="w-full max-w-2xl">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center border border-black/10 bg-white">
                <LockKeyhole
                  className="h-5 w-5 text-[#8B7653]"
                  strokeWidth={1.5}
                />
              </div>

              <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7653]">
                {t.accessPending}
              </p>

              <h1 className="mt-5 text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
                {t.assessmentWaiting}
              </h1>

              <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-black/50">
                {t.accountCreated}
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-lg border border-black/10 bg-white p-7 md:p-8">
              <p className="text-sm font-semibold">
                {t.whatNext}
              </p>

              <div className="mt-7 space-y-6">
                <PendingStep
                  number="01"
                  title={t.payment}
                  description={t.paymentDescription}
                />

                <PendingStep
                  number="02"
                  title={t.receipt}
                  description={t.receiptDescription}
                />

                <PendingStep
                  number="03"
                  title={t.unlocked}
                  description={t.unlockedDescription}
                  last
                />
              </div>
            </div>

            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => router.push("/payment")}
                className="inline-flex min-h-[48px] items-center gap-3 bg-[#171519] px-7 py-4 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/85"
              >
                {t.paymentInstructions}

                <ArrowRight
                  className="h-4 w-4"
                  strokeWidth={1.7}
                />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  function updateDraft(
    updates: Partial<AssessmentDraft>
  ) {
    if (isReviewMode) {
      return;
    }

    setDraft((current) => ({
      ...current,
      ...updates,
    }));
  }

  function updatePerception(
    key: keyof AssessmentDraft["perception"],
    value: number
  ) {
    if (isReviewMode) {
      return;
    }

    setDraft((current) => ({
      ...current,
      perception: {
        ...current.perception,
        [key]: value,
      },
    }));
  }

  function updateIkigai(
    key: keyof AssessmentDraft["ikigai"],
    value: string
  ) {
    if (isReviewMode) {
      return;
    }

    setDraft((current) => ({
      ...current,
      ikigai: {
        ...current.ikigai,
        [key]: value,
      },
    }));
  }

  function toggleValue(valueId: string) {
    if (isReviewMode) {
      return;
    }

    setDraft((current) => {
      const alreadySelected =
        current.selectedValues.includes(valueId);

      if (alreadySelected) {
        return {
          ...current,
          selectedValues:
            current.selectedValues.filter(
              (id) => id !== valueId
            ),
        };
      }

      if (current.selectedValues.length >= 3) {
        return current;
      }

      return {
        ...current,
        selectedValues: [
          ...current.selectedValues,
          valueId,
        ],
      };
    });
  }

  function selectArchetype(archetypeId: string) {
    if (isReviewMode) {
      return;
    }

    setDraft((current) => {
      if (
        current.primaryArchetypeId === archetypeId
      ) {
        return {
          ...current,
          primaryArchetypeId: "",
        };
      }

      return {
        ...current,
        primaryArchetypeId: archetypeId,
        secondaryArchetypeId:
          current.secondaryArchetypeId ===
          archetypeId
            ? ""
            : current.secondaryArchetypeId,
      };
    });
  }

  function selectSecondaryArchetype(
    archetypeId: string
  ) {
    if (isReviewMode) {
      return;
    }

    setDraft((current) => {
      if (
        current.secondaryArchetypeId ===
        archetypeId
      ) {
        return {
          ...current,
          secondaryArchetypeId: "",
        };
      }

      if (
        current.primaryArchetypeId ===
        archetypeId
      ) {
        return current;
      }

      return {
        ...current,
        secondaryArchetypeId: archetypeId,
      };
    });
  }

  function toggleTone(tone: string) {
    if (isReviewMode) {
      return;
    }

    setDraft((current) => {
      const alreadySelected =
        current.selectedTones.includes(tone);

      if (alreadySelected) {
        return {
          ...current,
          selectedTones:
            current.selectedTones.filter(
              (item) => item !== tone
            ),
        };
      }

      if (current.selectedTones.length >= 4) {
        return current;
      }

      return {
        ...current,
        selectedTones: [
          ...current.selectedTones,
          tone,
        ],
      };
    });
  }

  function isCurrentStepValid() {
    switch (currentQuestion.id) {
      case "identity":
        return draft.personName.trim().length > 0;
      case "values":
        return draft.selectedValues.length === 3;
      case "archetypes":
        return (
          draft.primaryArchetypeId !== "" &&
          draft.secondaryArchetypeId !== ""
        );
      case "purpose":
        return draft.purpose.trim().length > 0;
      case "vision":
        return draft.vision.trim().length > 0;
      case "ikigai":
        return (
          draft.ikigai.passion.trim().length >
            0 &&
          draft.ikigai.mission.trim().length >
            0 &&
          draft.ikigai.vocation.trim().length >
            0 &&
          draft.ikigai.profession.trim().length >
            0
        );
      case "perception":
        return true;
      case "voice":
        return draft.selectedTones.length > 0;
      default:
        return true;
    }
  }

  function getAnswerForQuestion(questionId: string) {
    switch (questionId) {
      case "identity":
        return {
          personName: draft.personName,
        };
      case "values":
        return draft.selectedValues;
      case "archetypes":
        return {
          primaryArchetypeId:
            draft.primaryArchetypeId,
          secondaryArchetypeId:
            draft.secondaryArchetypeId,
        };
      case "purpose":
        return draft.purpose;
      case "vision":
        return draft.vision;
      case "ikigai":
        return draft.ikigai;
      case "perception":
        return draft.perception;
      case "voice":
        return draft.selectedTones;
      default:
        return null;
    }
  }

  async function saveAnswer(
    questionId: string,
    stepValue: number
  ) {
    const response = await fetch(
      "/api/assessment/answer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
          answer:
            getAnswerForQuestion(questionId),
          step: stepValue,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Failed to save assessment answer."
      );
    }

    return data;
  }

  async function completeAssessment() {
    const response = await fetch(
      "/api/assessment/complete",
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Failed to complete assessment."
      );
    }

    return data;
  }

  async function handleNext() {
    if (isInitializing || isSubmitting) {
      return;
    }

    setError("");
    setDirection("forward");

    if (isReviewMode) {
      if (draft.step < TOTAL_STEPS - 1) {
        setDraft((current) => ({
          ...current,
          step: current.step + 1,
        }));

        return;
      }

      router.push("/results");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isCurrentStepValid()) {
        setError(getValidationMessage());
        return;
      }

      await saveAnswer(
        currentQuestion.id,
        draft.step + 1
      );

      if (draft.step < TOTAL_STEPS - 1) {
        setDraft((current) => ({
          ...current,
          step: current.step + 1,
        }));

        return;
      }

      await completeAssessment();

      router.replace("/results");
    } catch (error) {
      console.error(
        "Assessment flow error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function getValidationMessage() {
    switch (currentQuestion.id) {
      case "identity":
        return t.addName;
      case "values":
        return t.chooseExactly3;
      case "archetypes":
        return t.archetypeValidation;
      case "purpose":
        return t.purposeValidation;
      case "vision":
        return t.visionValidation;
      case "ikigai":
        return t.ikigaiValidation;
      case "voice":
        return t.voiceValidation;
      default:
        return "Please complete this section before continuing.";
    }
  }

  function handleBack() {
    if (isInitializing || isSubmitting) {
      return;
    }

    setError("");
    setDirection("back");

    if (draft.step === 0) {
      return;
    }

    setDraft((current) => ({
      ...current,
      step: current.step - 1,
    }));
  }

  function renderQuestion() {
    switch (currentQuestion.type) {
      /*
       * =====================================================
       * IDENTITY (Name input)
       * =====================================================
       */
      case "text":
        return (
          <div className="max-w-2xl">
            <label
              htmlFor="personName"
              className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-black/40"
            >
              {t.yourName}
            </label>

            <div
              className={`border transition-all duration-200 ${
                isReviewMode
                  ? "border-black/8 bg-black/[0.02]"
                  : "border-black/15 bg-white focus-within:border-[#171519] focus-within:shadow-[0_15px_40px_rgba(23,21,25,0.05)]"
              }`}
            >
              <input
                id="personName"
                type="text"
                autoComplete="name"
                autoFocus
                value={draft.personName}
                readOnly={isReviewMode}
                onChange={(event) =>
                  updateDraft({
                    personName: event.target.value,
                  })
                }
                placeholder={
                  isReviewMode
                    ? undefined
                    : t.namePlaceholder
                }
                className="w-full bg-transparent px-5 py-5 text-2xl font-medium tracking-tight outline-none placeholder:text-black/20 md:px-6 md:py-6 md:text-3xl"
              />

              <div className="flex items-center justify-between border-t border-black/[0.06] px-5 py-2.5 text-[10px] uppercase tracking-[0.14em] text-black/30 md:px-6">
                <span>
                  {draft.personName.trim().length > 0
                    ? "✓"
                    : t.fullName}
                </span>

                <span className="text-black/25">
                  {draft.personName.length}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3">
              <Sparkles
                className="mt-0.5 h-4 w-4 shrink-0 text-[#8B7653]"
                strokeWidth={1.5}
              />

              <p className="max-w-lg text-xs leading-5 text-black/40">
                {t.personalName}
              </p>
            </div>
          </div>
        );

      /*
       * =====================================================
       * VALUES
       * =====================================================
       */
      case "values":
        return (
          <div>
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-black/50">
                  {t.chooseValues}
                </p>

                {!isReviewMode && (
                  <p className="mt-1 text-xs text-black/30">
                    {t.trustInstinct}
                  </p>
                )}
              </div>

              <SelectionCounter
                current={draft.selectedValues.length}
                total={3}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {VALUE_OPTIONS.map((value, index) => {
                const selected =
                  draft.selectedValues.includes(
                    value.id
                  );

                const disabled =
                  !selected &&
                  draft.selectedValues.length >= 3;

                return (
                  <button
                    key={value.id}
                    type="button"
                    onClick={() => toggleValue(value.id)}
                    disabled={disabled || isReviewMode}
                    aria-pressed={selected}
                    className={`group relative min-h-[180px] border p-6 text-left transition-all duration-300 ${
                      selected
                        ? "border-[#171519] bg-[#171519] text-white shadow-[0_12px_30px_rgba(23,21,25,0.08)]"
                        : disabled || isReviewMode
                          ? "cursor-default border-black/8 bg-black/[0.015] opacity-45"
                          : "border-black/10 bg-white hover:-translate-y-0.5 hover:border-black/30 hover:shadow-[0_12px_30px_rgba(23,21,25,0.05)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                          selected
                            ? "text-white/40"
                            : "text-black/30"
                        }`}
                      >
                        0{index + 1}
                      </span>

                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                          selected
                            ? "border-white/30 bg-white text-[#171519]"
                            : "border-black/10 bg-transparent"
                        }`}
                      >
                        {selected && (
                          <Check
                            className="h-3 w-3"
                            strokeWidth={2.2}
                          />
                        )}
                      </span>
                    </div>

                    <h3 className="mt-9 text-lg font-semibold tracking-tight">
                      {language === "fr"
                        ? VALUE_COPY[value.id]?.fr ??
                          value.name
                        : value.name}
                    </h3>

                    <p
                      className={`mt-3 text-sm leading-6 ${
                        selected
                          ? "text-white/60"
                          : "text-black/50"
                      }`}
                    >
                      {language === "fr"
                        ? VALUE_COPY[value.id]
                            ?.description ??
                          value.description
                        : value.description}
                    </p>

                    {selected && (
                      <span className="absolute bottom-5 left-6 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#C9A876]">
                        {t.selected}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {!isReviewMode &&
              draft.selectedValues.length === 3 && (
                <div className="mt-6 flex items-center gap-2 text-xs text-black/40">
                  <CheckCircle2
                    className="h-4 w-4 text-[#8B7653]"
                    strokeWidth={1.6}
                  />

                  {t.lockedValues}
                </div>
              )}
          </div>
        );

      /*
       * =====================================================
       * ARCHETYPES
       * =====================================================
       */
      case "archetypes":
        return (
          <div className="space-y-14">
            <ArchetypeGroup
              title={t.primaryArchetype}
              description={t.primaryDescription}
              options={ARCHETYPE_OPTIONS}
              selectedId={draft.primaryArchetypeId}
              onSelect={selectArchetype}
              disabled={isReviewMode}
              variant="primary"
              language={language}
            />

            <ArchetypeGroup
              title={t.secondaryArchetype}
              description={t.secondaryDescription}
              options={ARCHETYPE_OPTIONS}
              selectedId={
                draft.secondaryArchetypeId
              }
              onSelect={selectSecondaryArchetype}
              disabled={isReviewMode}
              excludedId={draft.primaryArchetypeId}
              variant="secondary"
              language={language}
            />

            {!isReviewMode &&
              draft.primaryArchetypeId &&
              draft.secondaryArchetypeId && (
                <div className="border border-[#8B7653]/20 bg-[#8B7653]/5 p-5">
                  <div className="flex items-start gap-3">
                    <Sparkles
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#8B7653]"
                      strokeWidth={1.6}
                    />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8B7653]">
                        {t.identityMapped}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-black/50">
                        {t.identityMappedDescription}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        );

      /*
       * =====================================================
       * PURPOSE / VISION
       * =====================================================
       */
      case "textarea": {
        const value =
          currentQuestion.id === "purpose"
            ? draft.purpose
            : draft.vision;

        const placeholder =
          currentQuestion.id === "purpose"
            ? t.purposePlaceholder
            : t.visionPlaceholder;

        const isStrong = value.trim().length >= 40;

        return (
          <div className="max-w-3xl">
            <div
              className={`border transition-all duration-200 ${
                isReviewMode
                  ? "border-black/8 bg-black/[0.02]"
                  : "border-black/15 bg-[#FBF9F6] focus-within:border-[#171519] focus-within:bg-white focus-within:shadow-[0_15px_40px_rgba(23,21,25,0.05)]"
              }`}
            >
              <textarea
                autoFocus
                value={value}
                readOnly={isReviewMode}
                onChange={(event) =>
                  updateDraft({
                    [currentQuestion.id]:
                      event.target.value,
                  } as Partial<AssessmentDraft>)
                }
                placeholder={
                  isReviewMode
                    ? undefined
                    : placeholder
                }
                rows={9}
                className={`w-full resize-none border-0 bg-transparent px-5 pt-5 pb-3 text-base leading-8 outline-none md:px-6 md:pt-6 md:text-lg ${
                  isReviewMode
                    ? "cursor-default text-black/65"
                    : "text-[#171519] placeholder:text-black/25"
                }`}
              />

              <div className="flex items-center justify-between border-t border-black/[0.06] px-5 py-3 text-[10px] uppercase tracking-[0.14em] md:px-6">
                <span className="text-black/30">
                  {isReviewMode
                    ? t.savedResponse
                    : t.writeOwnWords}
                </span>

                <span className="flex items-center gap-3 text-black/30">
                  {isStrong && !isReviewMode && (
                    <span className="flex items-center gap-1.5 text-[#8B7653]">
                      <CheckCircle2
                        className="h-3 w-3"
                        strokeWidth={1.8}
                      />
                      {t.ikigaiStrongAnswer}
                    </span>
                  )}

                  <span>
                    {value.length} {t.characters}
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#171519] text-white">
                <Check
                  className="h-3 w-3"
                  strokeWidth={2}
                />
              </span>

              <p className="text-xs leading-5 text-black/40">
                {t.noPerfectAnswer}
              </p>
            </div>
          </div>
        );
      }

      /*
       * =====================================================
       * IKIGAI
       * =====================================================
       */
      case "ikigai": {
        const ikigaiFields = [
          {
            key: "passion" as const,
            label: t.whatYouLove,
            helper: t.loveHelper,
            placeholder: t.ikigaiPlaceholderPassion,
            index: "01",
            Icon: Heart,
            accent: "text-rose-500",
            ring: "focus-within:border-rose-300",
          },
          {
            key: "mission" as const,
            label: t.worldNeeds,
            helper: t.missionHelper,
            placeholder: t.ikigaiPlaceholderMission,
            index: "02",
            Icon: Globe2,
            accent: "text-sky-600",
            ring: "focus-within:border-sky-300",
          },
          {
            key: "vocation" as const,
            label: t.goodAt,
            helper: t.vocationHelper,
            placeholder: t.ikigaiPlaceholderVocation,
            index: "03",
            Icon: Zap,
            accent: "text-amber-600",
            ring: "focus-within:border-amber-300",
          },
          {
            key: "profession" as const,
            label: t.career,
            helper: t.professionHelper,
            placeholder: t.ikigaiPlaceholderProfession,
            index: "04",
            Icon: Briefcase,
            accent: "text-emerald-600",
            ring: "focus-within:border-emerald-300",
          },
        ];

        const countWords = (value: string) =>
          value.trim()
            ? value.trim().split(/\s+/).length
            : 0;

        const filledCount = ikigaiFields.filter(
          (f) =>
            draft.ikigai[f.key].trim().length > 0
        ).length;

        return (
          <div>
            <div className="mb-8 flex flex-col gap-5 border border-black/10 bg-white p-5 sm:flex-row sm:items-center sm:gap-7 md:p-6">
              <IkigaiVenn completedCount={filledCount} />

              <div className="flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B7653]">
                  {filledCount} / 4
                </p>

                <p className="mt-2 text-sm leading-6 text-black/55">
                  {t.ikigaiIntro}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {ikigaiFields.map(
                ({
                  key,
                  label,
                  helper,
                  placeholder,
                  index,
                  Icon,
                  accent,
                  ring,
                }) => {
                  const value = draft.ikigai[key];
                  const words = countWords(value);
                  const strong = words >= 8;
                  const hasContent =
                    value.trim().length > 0;

                  return (
                    <div
                      key={key}
                      className="flex flex-col border border-black/10 bg-white p-5 transition-colors hover:border-black/15 md:p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/8 bg-[#F8F5F1] ${accent}`}
                          >
                            <Icon
                              className="h-4 w-4"
                              strokeWidth={1.6}
                            />
                          </span>

                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/30">
                              {index}
                            </span>

                            <label
                              htmlFor={`ikigai-${key}`}
                              className="mt-0.5 block text-sm font-semibold"
                            >
                              {label}
                            </label>
                          </div>
                        </div>

                        {strong && (
                          <CheckCircle2
                            className="h-4 w-4 text-[#8B7653]"
                            strokeWidth={1.6}
                          />
                        )}
                      </div>

                      <p className="mt-3 text-xs leading-5 text-black/40">
                        {helper}
                      </p>

                      <div
                        className={`mt-5 flex-1 border transition-all duration-200 ${
                          isReviewMode
                            ? "border-black/8 bg-black/[0.02]"
                            : `border-black/15 bg-[#FBF9F6] ${ring}`
                        }`}
                      >
                        <textarea
                          id={`ikigai-${key}`}
                          value={value}
                          readOnly={isReviewMode}
                          onChange={(event) =>
                            updateIkigai(
                              key,
                              event.target.value
                            )
                          }
                          placeholder={
                            isReviewMode
                              ? undefined
                              : placeholder
                          }
                          rows={4}
                          className={`w-full resize-none border-0 bg-transparent px-4 pt-4 pb-2 text-sm leading-7 outline-none ${
                            isReviewMode
                              ? "cursor-default text-black/65"
                              : "text-[#171519] placeholder:text-black/25"
                          }`}
                        />

                        <div className="flex items-center justify-between border-t border-black/[0.06] px-4 py-2 text-[10px] uppercase tracking-[0.14em]">
                          <span className="text-black/30">
                            {words}{" "}
                            {words === 1
                              ? t.word
                              : t.words}
                          </span>

                          {strong ? (
                            <span className="flex items-center gap-1.5 font-semibold text-[#8B7653]">
                              <CheckCircle2
                                className="h-3 w-3"
                                strokeWidth={1.8}
                              />
                              {t.ikigaiStrongAnswer}
                            </span>
                          ) : hasContent ? (
                            <span className="text-black/30">
                              {t.ikigaiAddMore}
                            </span>
                          ) : (
                            <span className="text-black/20">
                              —
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <div className="mt-6 border border-[#171519] bg-[#171519] p-6 text-white md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles
                      className="h-3.5 w-3.5 text-[#C9A876]"
                      strokeWidth={1.8}
                    />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A876]">
                      {t.ikigaiSynthesis} · {t.optional}
                    </span>
                  </div>

                  <label
                    htmlFor="ikigai-intersection"
                    className="mt-3 block text-lg font-medium tracking-tight text-white md:text-xl"
                  >
                    {t.intersection}
                  </label>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
                    {t.intersectionHelper}
                  </p>
                </div>

                {draft.ikigai.intersection?.trim() && (
                  <CheckCircle2
                    className="h-5 w-5 text-[#C9A876]"
                    strokeWidth={1.6}
                  />
                )}
              </div>

              <div className="mt-6 border border-white/15 bg-white/[0.03] transition-colors focus-within:border-[#C9A876]/60 focus-within:bg-white/[0.05]">
                <textarea
                  id="ikigai-intersection"
                  value={
                    draft.ikigai.intersection ?? ""
                  }
                  readOnly={isReviewMode}
                  onChange={(event) =>
                    updateIkigai(
                      "intersection",
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder={
                    isReviewMode
                      ? undefined
                      : t.ikigaiPlaceholderIntersection
                  }
                  className={`w-full resize-none border-0 bg-transparent px-4 pt-4 pb-2 text-base leading-8 outline-none placeholder:text-white/30 md:px-5 md:pt-5 ${
                    isReviewMode
                      ? "cursor-default text-white/80"
                      : "text-white"
                  }`}
                />

                <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-white/40 md:px-5">
                  <span>
                    {countWords(
                      draft.ikigai.intersection ?? ""
                    )}{" "}
                    {countWords(
                      draft.ikigai.intersection ?? ""
                    ) === 1
                      ? t.word
                      : t.words}
                  </span>

                  {draft.ikigai.intersection?.trim() && (
                    <span className="text-[#C9A876]">
                      {t.ikigaiStrongAnswer}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }

      /*
       * =====================================================
       * PERCEPTION
       * =====================================================
       */
      case "perception":
        return (
          <div>
            <div className="mb-10 max-w-2xl">
              <p className="text-sm leading-6 text-black/50">
                {t.perceptionIntro}
              </p>
            </div>

            <div className="space-y-6">
              {PERCEPTION_DIMENSIONS.map((dimension) => {
                const key =
                  dimension.id as keyof AssessmentDraft["perception"];

                const value = draft.perception[key];

                return (
                  <PerceptionSlider
                    key={dimension.id}
                    dimensionId={
                      dimension.id as keyof typeof PERCEPTION_COPY
                    }
                    leftLabel={dimension.leftLabel}
                    rightLabel={dimension.rightLabel}
                    value={value}
                    disabled={isReviewMode}
                    language={language}
                    onChange={(nextValue) =>
                      updatePerception(
                        key,
                        nextValue
                      )
                    }
                  />
                );
              })}
            </div>

            <div className="mt-10 border border-black/10 bg-white p-5">
              <div className="flex items-center gap-3">
                <Compass
                  className="h-4 w-4 text-[#8B7653]"
                  strokeWidth={1.5}
                />

                <p className="text-xs leading-5 text-black/40">
                  {t.positioning}
                </p>
              </div>
            </div>
          </div>
        );

      /*
       * =====================================================
       * VOICE
       * =====================================================
       */
      case "voice":
        return (
          <div>
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-black/50">
                  {t.voiceIntro}
                </p>

                {!isReviewMode && (
                  <p className="mt-1 text-xs text-black/30">
                    {t.voicePick}
                  </p>
                )}
              </div>

              <SelectionCounter
                current={draft.selectedTones.length}
                total={4}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {VOICE_TONES.map((tone, index) => {
                const selected =
                  draft.selectedTones.includes(tone);

                const disabled =
                  !selected &&
                  draft.selectedTones.length >= 4;

                const localizedTone =
                  language === "fr"
                    ? VOICE_COPY[tone] ?? tone
                    : tone;

                return (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => toggleTone(tone)}
                    disabled={disabled || isReviewMode}
                    aria-pressed={selected}
                    className={`group flex min-h-[140px] flex-col justify-between border p-5 text-left transition-all duration-300 ${
                      selected
                        ? "border-[#171519] bg-[#171519] text-white"
                        : disabled || isReviewMode
                          ? "cursor-default border-black/8 bg-black/[0.02] opacity-45"
                          : "border-black/10 bg-white hover:-translate-y-0.5 hover:border-black/30"
                    }`}
                  >
                    {/* Top row: number + checkmark */}
                    <div className="flex items-start justify-between">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                          selected
                            ? "text-white/35"
                            : "text-black/25"
                        }`}
                      >
                        0{index + 1}
                      </span>

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                          selected
                            ? "border-white/30 bg-white text-[#171519]"
                            : "border-black/10"
                        }`}
                      >
                        {selected && (
                          <Check
                            className="h-2.5 w-2.5"
                            strokeWidth={2.2}
                          />
                        )}
                      </span>
                    </div>

                    {/* Bottom block: tone name + selected badge stacked */}
                    <div className="mt-6">
                      <p className="text-sm font-semibold leading-tight">
                        {localizedTone}
                      </p>

                      <span
                        className={`mt-1.5 block text-[9px] uppercase tracking-[0.16em] transition-opacity duration-200 ${
                          selected
                            ? "text-[#C9A876] opacity-100"
                            : "opacity-0"
                        }`}
                        aria-hidden={!selected}
                      >
                        {t.selected}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {!isReviewMode &&
              draft.selectedTones.length > 0 && (
                <div className="mt-6 flex items-center gap-2 text-xs text-black/40">
                  <Sparkles
                    className="h-4 w-4 text-[#8B7653]"
                    strokeWidth={1.5}
                  />

                  {t.voiceTakingShape}
                </div>
              )}
          </div>
        );

      default:
        return null;
    }
  }

  const currentStepValid =
    isReviewMode || isCurrentStepValid();

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <ClientHeader
        currentPage="assessment"
        showBack
      />

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-6 md:px-10 md:pt-12 lg:px-12">
        <div className="mb-6 flex justify-end">
          <div className="inline-flex items-center border border-black/10 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={`min-h-8 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
                language === "en"
                  ? "bg-[#171519] text-white"
                  : "text-black/40 hover:text-black"
              }`}
            >
              {t.english}
            </button>
            <button
              type="button"
              onClick={() => setLanguage("fr")}
              aria-pressed={language === "fr"}
              className={`min-h-8 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
                language === "fr"
                  ? "bg-[#171519] text-white"
                  : "text-black/40 hover:text-black"
              }`}
            >
              {t.french}
            </button>
          </div>
        </div>

        <div className="mb-10 md:mb-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-[#8B7653]" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8B7653]">
                  {isReviewMode
                    ? t.assessmentReview
                    : t.brandDiscovery}
                </p>
              </div>

              <p className="mt-3 text-xs text-black/35">
                {isReviewMode
                  ? t.reviewingAnswers
                  : t.savedAutomatically}
              </p>
            </div>

            <div className="flex items-center gap-4 sm:text-right">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/30">
                  {t.progress}
                </p>

                <p className="mt-1 text-sm font-medium">
                  {progress}% {t.complete}
                </p>
              </div>

              <div className="h-8 w-px bg-black/10" />

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/30">
                  {t.step}
                </p>

                <p className="mt-1 text-sm font-medium">
                  {String(draft.step + 1).padStart(
                    2,
                    "0"
                  )}{" "}
                  <span className="text-black/25">
                    / {String(TOTAL_STEPS).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7">
            <div className="h-[3px] bg-black/8">
              <div
                className="h-full bg-[#171519] transition-all duration-700 ease-out"
                style={{
                  width: `${Math.max(progress, 3)}%`,
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.15em] text-black/25">
                {stageLabel}
              </p>

              <p className="text-[10px] text-black/25">
                {isLastStep
                  ? t.finalStep
                  : `${remainingSteps} ${
                      remainingSteps === 1
                        ? t.stepRemaining
                        : t.stepsRemaining
                    }`}
              </p>
            </div>
          </div>
        </div>

        {isReviewMode && (
          <div className="mb-10 border border-[#8B7653]/20 bg-[#8B7653]/5 px-5 py-4">
            <div className="flex items-start gap-4">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-[#8B7653]"
                strokeWidth={1.7}
              />

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B7653]">
                  {t.completedAssessment}
                </p>

                <p className="mt-1 text-xs leading-5 text-black/45">
                  {t.readOnly}
                </p>
              </div>
            </div>
          </div>
        )}

        <section
          ref={questionAnchorRef}
          className="mx-auto max-w-5xl scroll-mt-24"
        >
          <div
            key={draft.step}
            className={`transition-all duration-300 ${
              direction === "forward"
                ? "animate-[assessmentIn_0.35s_ease-out]"
                : "animate-[assessmentBack_0.35s_ease-out]"
            }`}
          >
            <div className="mb-10 max-w-4xl md:mb-14">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#171519] text-[9px] font-semibold text-white">
                  {String(draft.step + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/30">
                  {stageLabel}
                </span>
              </div>

              <h1 className="max-w-4xl text-[2.35rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-4xl md:text-5xl lg:text-[4rem]">
                {
                  localizedQuestion(
                    currentQuestion,
                    language
                  ).title
                }
              </h1>

              {currentQuestion.description && (
                <p className="mt-6 max-w-2xl text-sm leading-7 text-black/50 md:text-base md:leading-8">
                  {
                    localizedQuestion(
                      currentQuestion,
                      language
                    ).description
                  }
                </p>
              )}
            </div>

            <div className="min-h-[360px]">
              {renderQuestion()}
            </div>
          </div>

          {error && (
            <div
              ref={errorRef}
              role="alert"
              aria-live="assertive"
              className="mt-10 border border-red-200 bg-red-50 px-5 py-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  !
                </span>

                <p className="text-xs leading-5 text-red-700">
                  {error}
                </p>
              </div>
            </div>
          )}

          <div className="mt-14 border-t border-black/10 pt-7 md:mt-20 md:pt-8">
            <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={isFirstStep || isSubmitting}
                className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-black/40 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-20"
              >
                <ArrowLeft
                  className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                  strokeWidth={1.7}
                />

                {t.previous}
              </button>

              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="group inline-flex min-h-[50px] w-full items-center justify-center gap-3 bg-[#171519] px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[230px]"
                >
                  {isReviewMode
                    ? isLastStep
                      ? t.viewDNA
                      : t.next
                    : isSubmitting
                      ? isLastStep
                        ? t.creating
                        : t.saving
                      : isLastStep
                        ? t.generate
                        : t.continue}

                  {!isSubmitting && (
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      strokeWidth={1.7}
                    />
                  )}
                </button>

                {!isReviewMode &&
                  !currentStepValid &&
                  !error && (
                    <p
                      className="text-[10px] uppercase tracking-[0.14em] text-black/30 sm:text-right"
                      aria-live="polite"
                    >
                      {getValidationMessage()}
                    </p>
                  )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 text-[9px] uppercase tracking-[0.14em] text-black/25 sm:flex-row sm:items-center sm:justify-between">
              <span>
                {isReviewMode
                  ? t.reviewSaved
                  : t.progressSaved}
              </span>

              <span>{t.barandyFooter}</span>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes assessmentIn {
          from {
            opacity: 0;
            transform: translateX(12px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes assessmentBack {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </main>
  );
}

/* ============================================================
   PENDING STEP
============================================================ */

function PendingStep({
  number,
  title,
  description,
  last = false,
}: {
  number: string;
  title: string;
  description: string;
  last?: boolean;
}) {
  return (
    <div className="relative flex gap-5">
      {!last && (
        <div
          className="absolute left-[15px] top-8 h-[calc(100%+16px)] w-px bg-black/8"
          aria-hidden="true"
        />
      )}

      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[#F8F5F1] text-[10px] font-semibold">
        {number}
      </span>

      <div className="pb-1">
        <p className="text-sm font-semibold">{title}</p>

        <p className="mt-1 text-sm leading-6 text-black/45">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   SELECTION COUNTER
============================================================ */

function SelectionCounter({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const complete = current === total;

  return (
    <div
      className={`flex w-fit items-center gap-2 border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] ${
        complete
          ? "border-[#8B7653]/25 bg-[#8B7653]/5 text-[#8B7653]"
          : "border-black/8 bg-white text-black/35"
      }`}
    >
      {complete && (
        <Check className="h-3 w-3" strokeWidth={2} />
      )}

      {current} / {total}
    </div>
  );
}

/* ============================================================
   ARCHETYPE GROUP
============================================================ */

function ArchetypeGroup({
  title,
  description,
  options,
  selectedId,
  onSelect,
  disabled,
  excludedId,
  variant,
  language,
}: {
  title: string;
  description: string;
  options: typeof ARCHETYPE_OPTIONS;
  selectedId: string;
  onSelect: (id: string) => void;
  disabled: boolean;
  excludedId?: string;
  variant: "primary" | "secondary";
  language: Language;
}) {
  const t = UI_TEXT[language];
  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B7653]">
            {variant === "primary"
              ? t.coreIdentity
              : t.supportingIdentity}
          </p>

          <h2 className="mt-2 text-xl font-medium tracking-tight">
            {title}
          </h2>

          <p className="mt-2 text-sm text-black/45">
            {description}
          </p>
        </div>

        {selectedId && (
          <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35">
            <CheckCircle2
              className="h-3.5 w-3.5 text-[#8B7653]"
              strokeWidth={1.6}
            />

            {t.selected}
          </span>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {options.map((archetype, index) => {
          const selected = selectedId === archetype.id;
          const excluded = excludedId === archetype.id;

          return (
            <button
              key={archetype.id}
              type="button"
              disabled={disabled || excluded}
              onClick={() => onSelect(archetype.id)}
              aria-pressed={selected}
              className={`group relative min-h-[170px] border p-6 text-left transition-all duration-300 ${
                selected
                  ? "border-[#171519] bg-[#171519] text-white shadow-[0_14px_35px_rgba(23,21,25,0.08)]"
                  : disabled || excluded
                    ? "cursor-default border-black/8 bg-black/[0.02] opacity-45"
                    : "border-black/10 bg-white hover:-translate-y-0.5 hover:border-black/30 hover:shadow-[0_12px_30px_rgba(23,21,25,0.05)]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                    selected
                      ? "text-white/35"
                      : "text-black/25"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    selected
                      ? "border-white/30 bg-white text-[#171519]"
                      : "border-black/10"
                  }`}
                >
                  {selected && (
                    <Check
                      className="h-3 w-3"
                      strokeWidth={2.2}
                    />
                  )}
                </span>
              </div>

              <h3 className="mt-7 text-lg font-semibold tracking-tight">
                {language === "fr"
                  ? ARCHETYPE_COPY[archetype.id]
                      ?.title ?? archetype.title
                  : archetype.title}
              </h3>

              <p
                className={`mt-1 text-sm ${
                  selected
                    ? "text-white/55"
                    : "text-black/45"
                }`}
              >
                {language === "fr"
                  ? ARCHETYPE_COPY[archetype.id]
                      ?.subtitle ??
                    archetype.subtitle
                  : archetype.subtitle}
              </p>

              <p
                className={`mt-4 text-sm leading-6 ${
                  selected
                    ? "text-white/65"
                    : "text-black/50"
                }`}
              >
                {language === "fr"
                  ? ARCHETYPE_COPY[archetype.id]
                      ?.description ??
                    archetype.description
                  : archetype.description}
              </p>

              {excluded && (
                <span className="absolute bottom-5 right-6 text-[9px] uppercase tracking-[0.15em] text-black/25">
                  {t.primarySelected}
                </span>
              )}

              {selected && (
                <span className="absolute bottom-5 left-6 text-[9px] uppercase tracking-[0.15em] text-[#C9A876]">
                  {variant === "primary"
                    ? t.primary
                    : t.secondary}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   PERCEPTION SLIDER
============================================================ */

function PerceptionSlider({
  dimensionId,
  leftLabel,
  rightLabel,
  value,
  disabled,
  language,
  onChange,
}: {
  dimensionId: keyof typeof PERCEPTION_COPY;
  leftLabel: string;
  rightLabel: string;
  value: number;
  disabled: boolean;
  language: Language;
  onChange: (value: number) => void;
}) {
  const t = UI_TEXT[language];

  const position = `${value}%`;

  const localizedLeft =
    language === "fr"
      ? PERCEPTION_COPY[dimensionId].frLeft
      : leftLabel;
  const localizedRight =
    language === "fr"
      ? PERCEPTION_COPY[dimensionId].frRight
      : rightLabel;

  const distance = Math.abs(value - 50);

  let interpretation: string;

  if (value === 50) {
    interpretation = t.perceptionBalanced;
  } else {
    const side =
      value < 50 ? localizedLeft : localizedRight;

    const intensity =
      distance >= 35
        ? t.perceptionClearly
        : distance >= 15
          ? t.perceptionLeaning
          : t.perceptionSlightly;

    interpretation = `${intensity} · ${side.toLowerCase()}`;
  }

  const strength = Math.round(distance * 2);

  return (
    <div className="border border-black/10 bg-white p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="max-w-[34%] text-sm font-semibold">
          {localizedLeft}
        </span>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/30">
            {t.perceptionPosition}
          </span>

          <span className="text-sm font-semibold tabular-nums">
            {value}
            <span className="text-black/30">/100</span>
          </span>

          <span className="whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.14em] text-[#8B7653]">
            {interpretation}
          </span>
        </div>

        <span className="max-w-[34%] text-right text-sm font-semibold">
          {localizedRight}
        </span>
      </div>

      <div className="relative mt-6">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-black/8" />

        <div
          className="pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-[#171519]"
          style={{ width: position }}
        />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-px -translate-y-1/2 bg-black/15" />

        <input
          type="range"
          min="0"
          max="100"
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onChange(Number(event.target.value))
          }
          aria-label={`${localizedLeft} versus ${localizedRight}`}
          className="relative z-10 h-6 w-full cursor-pointer appearance-none bg-transparent accent-[#171519] disabled:cursor-default"
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-[9px] uppercase tracking-[0.14em] text-black/25">
        <span>{localizedLeft}</span>

        <span className="text-black/20">
          {t.perceptionStrength} {strength}%
        </span>

        <span>{localizedRight}</span>
      </div>
    </div>
  );
}

/* ============================================================
   IKIGAI VENN
============================================================ */

function IkigaiVenn({
  completedCount,
}: {
  completedCount: number;
}) {
  const circles = [
    { cx: 34, cy: 20, fill: "#F43F5E" },
    { cx: 48, cy: 34, fill: "#0284C7" },
    { cx: 34, cy: 48, fill: "#D97706" },
    { cx: 20, cy: 34, fill: "#059669" },
  ];

  const allFilled = completedCount >= 4;

  return (
    <svg
      viewBox="0 0 68 68"
      className="h-20 w-20 shrink-0"
      aria-hidden="true"
    >
      {circles.map((c, i) => {
        const active = i < completedCount;
        return (
          <circle
            key={i}
            cx={c.cx}
            cy={c.cy}
            r={14}
            fill={c.fill}
            fillOpacity={active ? 0.16 : 0.04}
            stroke={c.fill}
            strokeOpacity={active ? 0.7 : 0.2}
            strokeWidth={1}
            style={{
              transition:
                "fill-opacity 0.5s ease, stroke-opacity 0.5s ease",
            }}
          />
        );
      })}

      <circle
        cx={34}
        cy={34}
        r={2.4}
        fill="#171519"
        fillOpacity={allFilled ? 1 : 0.2}
        style={{
          transition: "fill-opacity 0.6s ease",
        }}
      />
    </svg>
  );
}