
"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  LockKeyhole,
  Sparkles,
  Target,
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

  const currentQuestion =
    ASSESSMENT_QUESTIONS[draft.step];

  const progress = useMemo(() => {
    if (TOTAL_STEPS <= 1) {
      return 100;
    }

    return Math.round(
      (draft.step / (TOTAL_STEPS - 1)) * 100
    );
  }, [draft.step]);

  const isLastStep =
    draft.step === TOTAL_STEPS - 1;

  const isFirstStep =
    draft.step === 0;

  const remainingSteps =
    TOTAL_STEPS - draft.step - 1;

  /*
   * Small contextual label for each stage.
   * This makes the assessment feel like a journey
   * rather than a collection of unrelated questions.
   */
  const stageLabel = useMemo(() => {
    switch (currentQuestion?.id) {
      case "identity":
        return "Foundation";

      case "values":
        return "Values";

      case "archetypes":
        return "Identity";

      case "purpose":
        return "Purpose";

      case "vision":
        return "Direction";

      case "ikigai":
        return "Ikigai";

      case "perception":
        return "Perception";

      case "voice":
        return "Expression";

      default:
        return "Discovery";
    }
  }, [currentQuestion?.id]);

  /*
   * Initialize / resume assessment.
   */
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

  /*
   * Loading state.
   */
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
              Preparing your experience
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-black/45">
              We're preparing your personal brand discovery
              workspace.
            </p>

            <div className="mx-auto mt-8 h-px w-40 overflow-hidden bg-black/10">
              <div className="h-full w-1/2 animate-pulse bg-[#171519]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Access pending.
   */
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
                Access pending
              </p>

              <h1 className="mt-5 text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
                Your assessment is waiting for you.
              </h1>

              <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-black/50">
                Your account has been created successfully.
                Once your payment has been verified, your
                assessment experience will be activated.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-lg border border-black/10 bg-white p-7 md:p-8">
              <p className="text-sm font-semibold">
                What happens next?
              </p>

              <div className="mt-7 space-y-6">
                <PendingStep
                  number="01"
                  title="Complete your payment"
                  description="Follow the payment instructions available in your Barandy account."
                />

                <PendingStep
                  number="02"
                  title="Send your receipt"
                  description="Send your payment receipt to the Barandy team for verification."
                />

                <PendingStep
                  number="03"
                  title="Assessment unlocked"
                  description="Once verified, your personal brand assessment becomes available."
                  last
                />
              </div>
            </div>

            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() =>
                  router.push("/payment")
                }
                className="inline-flex min-h-[48px] items-center gap-3 bg-[#171519] px-7 py-4 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/85"
              >
                View Payment Instructions

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

  function selectArchetype(
    archetypeId: string
  ) {
    if (isReviewMode) {
      return;
    }

    setDraft((current) => {
      if (
        current.primaryArchetypeId ===
        archetypeId
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
        return (
          draft.personName.trim().length > 0
        );

      case "values":
        return (
          draft.selectedValues.length === 3
        );

      case "archetypes":
        return (
          draft.primaryArchetypeId !== "" &&
          draft.secondaryArchetypeId !== ""
        );

      case "purpose":
        return (
          draft.purpose.trim().length > 0
        );

      case "vision":
        return (
          draft.vision.trim().length > 0
        );

      case "ikigai":
        return (
          draft.ikigai.passion.trim().length > 0 &&
          draft.ikigai.mission.trim().length > 0 &&
          draft.ikigai.vocation.trim().length > 0 &&
          draft.ikigai.profession.trim().length > 0
        );

      case "perception":
        return true;

      case "voice":
        return (
          draft.selectedTones.length > 0
        );

      default:
        return true;
    }
  }

  function getAnswerForQuestion(
    questionId: string
  ) {
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
    questionId: string
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
          step: draft.step + 1,
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
    if (
      isInitializing ||
      isSubmitting
    ) {
      return;
    }

    setError("");
    setDirection("forward");

    /*
     * REVIEW MODE
     */
    if (isReviewMode) {
      if (
        draft.step <
        TOTAL_STEPS - 1
      ) {
        setDraft((current) => ({
          ...current,
          step: current.step + 1,
        }));

        return;
      }

      router.push("/results");
      return;
    }

    /*
     * NORMAL MODE
     */
    setIsSubmitting(true);

    try {
      if (!isCurrentStepValid()) {
        setError(
          getValidationMessage()
        );

        return;
      }

      await saveAnswer(currentQuestion.id);

      if (
        draft.step <
        TOTAL_STEPS - 1
      ) {
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
        return "Add your name to continue.";

      case "values":
        return "Choose exactly 3 values that represent you.";

      case "archetypes":
        return "Choose one primary and one secondary archetype.";

      case "purpose":
        return "Take a moment to describe your purpose.";

      case "vision":
        return "Describe the professional future you want to build.";

      case "ikigai":
        return "Complete the four required Ikigai dimensions.";

      case "voice":
        return "Choose at least one quality for your brand voice.";

      default:
        return "Please complete this section before continuing.";
    }
  }

  function handleBack() {
    if (
      isInitializing ||
      isSubmitting
    ) {
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
       * IDENTITY
       * =====================================================
       */
      case "text":
        return (
          <div className="max-w-2xl">
            <label
              htmlFor="personName"
              className="mb-4 block text-xs font-semibold uppercase tracking-[0.18em] text-black/40"
            >
              Your name
            </label>

            <div
              className={`border-b-2 transition-colors ${
                isReviewMode
                  ? "border-black/10"
                  : "border-black/15 focus-within:border-[#171519]"
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
                    personName:
                      event.target.value,
                  })
                }
                placeholder="Your full name"
                className="w-full bg-transparent px-0 py-5 text-2xl font-medium tracking-tight outline-none placeholder:text-black/20 md:text-3xl"
              />
            </div>

            <div className="mt-5 flex items-start gap-3">
              <Sparkles
                className="mt-0.5 h-4 w-4 shrink-0 text-[#8B7653]"
                strokeWidth={1.5}
              />

              <p className="max-w-lg text-xs leading-5 text-black/40">
                We'll use your name to make your Brand DNA
                feel personal from the first page to the last.
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
                  Which three values should guide your brand?
                </p>

                {!isReviewMode && (
                  <p className="mt-1 text-xs text-black/30">
                    Trust your instinct. Choose the ones that
                    feel most like you.
                  </p>
                )}
              </div>

              <SelectionCounter
                current={
                  draft.selectedValues.length
                }
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
                    onClick={() =>
                      toggleValue(value.id)
                    }
                    disabled={
                      disabled ||
                      isReviewMode
                    }
                    aria-pressed={selected}
                    className={`group relative min-h-[180px] border p-6 text-left transition-all duration-300 ${
                      selected
                        ? "border-[#171519] bg-[#171519] text-white shadow-[0_12px_30px_rgba(23,21,25,0.08)]"
                        : disabled ||
                            isReviewMode
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
                      {value.name}
                    </h3>

                    <p
                      className={`mt-3 text-sm leading-6 ${
                        selected
                          ? "text-white/60"
                          : "text-black/50"
                      }`}
                    >
                      {value.description}
                    </p>

                    {selected && (
                      <span className="absolute bottom-5 left-6 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#C9A876]">
                        Selected
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

                  Your three values are locked in.
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
              title="Your primary archetype"
              description="The energy that most strongly represents who you are."
              options={ARCHETYPE_OPTIONS}
              selectedId={
                draft.primaryArchetypeId
              }
              onSelect={selectArchetype}
              disabled={isReviewMode}
              variant="primary"
            />

            <ArchetypeGroup
              title="Your secondary archetype"
              description="A complementary energy that adds nuance to your identity."
              options={ARCHETYPE_OPTIONS}
              selectedId={
                draft.secondaryArchetypeId
              }
              onSelect={
                selectSecondaryArchetype
              }
              disabled={isReviewMode}
              excludedId={
                draft.primaryArchetypeId
              }
              variant="secondary"
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
                        Identity mapped
                      </p>

                      <p className="mt-1 text-sm leading-6 text-black/50">
                        Your primary and secondary archetypes
                        now give us two dimensions of your
                        brand personality.
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
      case "textarea":
        return (
          <div className="max-w-3xl">
            <div
              className={`relative border transition-all duration-300 ${
                isReviewMode
                  ? "border-black/10 bg-black/[0.02]"
                  : "border-black/10 bg-white focus-within:border-black/30 focus-within:shadow-[0_15px_40px_rgba(23,21,25,0.04)]"
              }`}
            >
              <textarea
                autoFocus
                value={
                  currentQuestion.id ===
                  "purpose"
                    ? draft.purpose
                    : draft.vision
                }
                readOnly={isReviewMode}
                onChange={(event) =>
                  updateDraft({
                    [currentQuestion.id]:
                      event.target.value,
                  } as Partial<AssessmentDraft>)
                }
                placeholder={
                  currentQuestion.id ===
                  "purpose"
                    ? "Write freely. What drives the work you want to be known for?"
                    : "Imagine your professional future. What are you building toward?"
                }
                rows={9}
                className="w-full resize-none bg-transparent p-6 text-base leading-8 outline-none placeholder:text-black/25 md:p-8 md:text-lg"
              />

              <div className="flex items-center justify-between border-t border-black/8 px-6 py-3 md:px-8">
                <span className="text-[10px] uppercase tracking-[0.15em] text-black/25">
                  {isReviewMode
                    ? "Saved response"
                    : "Write in your own words"}
                </span>

                <span className="text-[10px] text-black/25">
                  {(
                    currentQuestion.id ===
                    "purpose"
                      ? draft.purpose
                      : draft.vision
                  ).length}{" "}
                  characters
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
                There is no perfect answer. Authentic answers
                create a more accurate Brand DNA.
              </p>
            </div>
          </div>
        );

      /*
       * =====================================================
       * IKIGAI
       * =====================================================
       */
      case "ikigai":
        return (
          <div>
            <div className="mb-8 max-w-2xl">
              <p className="text-sm leading-6 text-black/50">
                Look at your professional life from four
                different angles. Don't overthink it.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {(
                [
                  [
                    "passion",
                    "What you love",
                    "What naturally energizes you?",
                  ],
                  [
                    "mission",
                    "What the world needs",
                    "What change do you want to contribute to?",
                  ],
                  [
                    "vocation",
                    "What you are good at",
                    "Where do your natural strengths show up?",
                  ],
                  [
                    "profession",
                    "What you can build a career around",
                    "What can create real professional value?",
                  ],
                ] as const
              ).map(
                ([key, label, helper], index) => (
                  <div
                    key={key}
                    className="border border-black/10 bg-white p-5 transition-colors focus-within:border-black/25 md:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B7653]">
                          0{index + 1}
                        </span>

                        <label
                          htmlFor={`ikigai-${key}`}
                          className="mt-2 block text-sm font-semibold"
                        >
                          {label}
                        </label>
                      </div>

                      {draft.ikigai[key].trim() && (
                        <CheckCircle2
                          className="h-4 w-4 text-[#8B7653]"
                          strokeWidth={1.6}
                        />
                      )}
                    </div>

                    <p className="mt-2 text-xs leading-5 text-black/35">
                      {helper}
                    </p>

                    <textarea
                      id={`ikigai-${key}`}
                      value={
                        draft.ikigai[key]
                      }
                      readOnly={isReviewMode}
                      onChange={(event) =>
                        updateIkigai(
                          key,
                          event.target.value
                        )
                      }
                      rows={5}
                      className={`mt-5 w-full resize-none border-0 border-t border-black/8 bg-transparent px-0 pt-4 text-sm leading-7 outline-none ${
                        isReviewMode
                          ? "cursor-default text-black/65"
                          : "placeholder:text-black/20"
                      }`}
                    />
                  </div>
                )
              )}

              <div className="border border-black/10 bg-white p-5 md:col-span-2 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B7653]">
                      Optional
                    </span>

                    <label
                      htmlFor="ikigai-intersection"
                      className="mt-2 block text-sm font-semibold"
                    >
                      Your intersection
                    </label>

                    <p className="mt-2 text-xs leading-5 text-black/35">
                      Where do these four dimensions meet?
                    </p>
                  </div>

                  {draft.ikigai.intersection?.trim() && (
                    <CheckCircle2
                      className="h-4 w-4 text-[#8B7653]"
                      strokeWidth={1.6}
                    />
                  )}
                </div>

                <textarea
                  id="ikigai-intersection"
                  value={
                    draft.ikigai
                      .intersection ?? ""
                  }
                  readOnly={isReviewMode}
                  onChange={(event) =>
                    updateIkigai(
                      "intersection",
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Describe the space where your passion, strengths, contribution and career intersect."
                  className={`mt-5 w-full resize-none border border-black/8 bg-[#F8F5F1] p-4 text-sm leading-7 outline-none transition focus:border-black/25 ${
                    isReviewMode
                      ? "cursor-default text-black/65"
                      : "placeholder:text-black/20"
                  }`}
                />
              </div>
            </div>
          </div>
        );

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
                Move each scale toward the side that feels
                more natural to you. Think instinctively rather
                than strategically.
              </p>
            </div>

            <div className="space-y-10">
              {PERCEPTION_DIMENSIONS.map(
                (dimension) => {
                  const key =
                    dimension.id as keyof AssessmentDraft["perception"];

                  const value =
                    draft.perception[key];

                  return (
                    <PerceptionSlider
                      key={dimension.id}
                      leftLabel={
                        dimension.leftLabel
                      }
                      rightLabel={
                        dimension.rightLabel
                      }
                      value={value}
                      disabled={isReviewMode}
                      onChange={(nextValue) =>
                        updatePerception(
                          key,
                          nextValue
                        )
                      }
                    />
                  );
                }
              )}
            </div>

            <div className="mt-10 border border-black/10 bg-white p-5">
              <div className="flex items-center gap-3">
                <Compass
                  className="h-4 w-4 text-[#8B7653]"
                  strokeWidth={1.5}
                />

                <p className="text-xs leading-5 text-black/40">
                  Your answers create a unique positioning
                  profile. There is no ideal score.
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
                  Choose the qualities your voice should
                  communicate.
                </p>

                {!isReviewMode && (
                  <p className="mt-1 text-xs text-black/30">
                    Pick up to four. Think about how you want
                    people to experience your communication.
                  </p>
                )}
              </div>

              <SelectionCounter
                current={
                  draft.selectedTones.length
                }
                total={4}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {VOICE_TONES.map(
                (tone, index) => {
                  const selected =
                    draft.selectedTones.includes(
                      tone
                    );

                  const disabled =
                    !selected &&
                    draft.selectedTones.length >= 4;

                  return (
                    <button
                      key={tone}
                      type="button"
                      onClick={() =>
                        toggleTone(tone)
                      }
                      disabled={
                        disabled ||
                        isReviewMode
                      }
                      aria-pressed={selected}
                      className={`group relative min-h-[120px] border p-5 text-left transition-all duration-300 ${
                        selected
                          ? "border-[#171519] bg-[#171519] text-white"
                          : disabled ||
                              isReviewMode
                            ? "cursor-default border-black/8 bg-black/[0.02] opacity-45"
                            : "border-black/10 bg-white hover:-translate-y-0.5 hover:border-black/30"
                      }`}
                    >
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
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
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

                      <p className="mt-8 text-sm font-semibold">
                        {tone}
                      </p>

                      {selected && (
                        <span className="absolute bottom-4 left-5 text-[9px] uppercase tracking-[0.16em] text-[#C9A876]">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </div>

            {!isReviewMode &&
              draft.selectedTones.length > 0 && (
                <div className="mt-6 flex items-center gap-2 text-xs text-black/40">
                  <Sparkles
                    className="h-4 w-4 text-[#8B7653]"
                    strokeWidth={1.5}
                  />

                  Your voice is starting to take shape.
                </div>
              )}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <ClientHeader
        currentPage="assessment"
        showBack
      />

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-6 md:px-10 md:pt-12 lg:px-12">
        {/* =====================================================
            TOP ASSESSMENT BAR
        ====================================================== */}
        <div className="mb-10 md:mb-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-[#8B7653]" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8B7653]">
                  {isReviewMode
                    ? "Assessment Review"
                    : "Brand Discovery"}
                </p>
              </div>

              <p className="mt-3 text-xs text-black/35">
                {isReviewMode
                  ? "Reviewing your saved answers"
                  : "Your answers are saved automatically"}
              </p>
            </div>

            <div className="flex items-center gap-4 sm:text-right">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/30">
                  Progress
                </p>

                <p className="mt-1 text-sm font-medium">
                  {progress}% complete
                </p>
              </div>

              <div className="h-8 w-px bg-black/10" />

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/30">
                  Step
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

          {/* Progress bar */}
          <div className="mt-7">
            <div className="h-[3px] bg-black/8">
              <div
                className="h-full bg-[#171519] transition-all duration-700 ease-out"
                style={{
                  width: `${Math.max(
                    progress,
                    3
                  )}%`,
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.15em] text-black/25">
                {stageLabel}
              </p>

              <p className="text-[10px] text-black/25">
                {isLastStep
                  ? "Final step"
                  : `${remainingSteps} ${
                      remainingSteps === 1
                        ? "step"
                        : "steps"
                    } remaining`}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            REVIEW NOTICE
        ====================================================== */}
        {isReviewMode && (
          <div className="mb-10 border border-[#8B7653]/20 bg-[#8B7653]/5 px-5 py-4">
            <div className="flex items-start gap-4">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-[#8B7653]"
                strokeWidth={1.7}
              />

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B7653]">
                  Completed assessment
                </p>

                <p className="mt-1 text-xs leading-5 text-black/45">
                  Your answers are safely stored. You are
                  viewing them in read-only mode.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            QUESTION AREA
        ====================================================== */}
        <section className="mx-auto max-w-5xl">
          <div
            key={draft.step}
            className={`transition-all duration-300 ${
              direction === "forward"
                ? "animate-[assessmentIn_0.35s_ease-out]"
                : "animate-[assessmentBack_0.35s_ease-out]"
            }`}
          >
            {/* Question heading */}
            <div className="mb-10 max-w-4xl md:mb-14">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#171519] text-[9px] font-semibold text-white">
                  {String(
                    draft.step + 1
                  ).padStart(2, "0")}
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/30">
                  {stageLabel}
                </span>
              </div>

              <h1 className="max-w-4xl text-[2.35rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-4xl md:text-5xl lg:text-[4rem]">
                {currentQuestion.title}
              </h1>

              {currentQuestion.description && (
                <p className="mt-6 max-w-2xl text-sm leading-7 text-black/50 md:text-base md:leading-8">
                  {currentQuestion.description}
                </p>
              )}
            </div>

            {/* Question content */}
            <div className="min-h-[360px]">
              {renderQuestion()}
            </div>
          </div>

          {/* ===================================================
              ERROR
          ==================================================== */}
          {error && (
            <div className="mt-10 border border-red-200 bg-red-50 px-5 py-4">
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

          {/* ===================================================
              NAVIGATION
          ==================================================== */}
          <div className="mt-14 border-t border-black/10 pt-7 md:mt-20 md:pt-8">
            <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={
                  isFirstStep ||
                  isSubmitting
                }
                className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-black/40 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-20"
              >
                <ArrowLeft
                  className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                  strokeWidth={1.7}
                />

                Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="group inline-flex min-h-[50px] w-full items-center justify-center gap-3 bg-[#171519] px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[230px]"
              >
                {isReviewMode
                  ? isLastStep
                    ? "View My Brand DNA"
                    : "Next"
                  : isSubmitting
                    ? isLastStep
                      ? "Creating your profile..."
                      : "Saving your answer..."
                    : isLastStep
                      ? "Generate My Brand DNA"
                      : "Continue"}

                {!isSubmitting && (
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={1.7}
                  />
                )}
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-2 text-[9px] uppercase tracking-[0.14em] text-black/25 sm:flex-row sm:items-center sm:justify-between">
              <span>
                {isReviewMode
                  ? "Reviewing saved answers"
                  : "Your progress is saved automatically"}
              </span>

              <span>
                Barandy · Personal Brand Intelligence
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================
          LOCAL ANIMATION KEYFRAMES
      ====================================================== */}
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
        <p className="text-sm font-semibold">
          {title}
        </p>

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
        <Check
          className="h-3 w-3"
          strokeWidth={2}
        />
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
}: {
  title: string;
  description: string;
  options: typeof ARCHETYPE_OPTIONS;
  selectedId: string;
  onSelect: (id: string) => void;
  disabled: boolean;
  excludedId?: string;
  variant: "primary" | "secondary";
}) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B7653]">
            {variant === "primary"
              ? "01 · Core identity"
              : "02 · Supporting identity"}
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

            Selected
          </span>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {options.map((archetype, index) => {
          const selected =
            selectedId === archetype.id;

          const excluded =
            excludedId === archetype.id;

          return (
            <button
              key={archetype.id}
              type="button"
              disabled={
                disabled ||
                excluded
              }
              onClick={() =>
                onSelect(archetype.id)
              }
              aria-pressed={selected}
              className={`group relative min-h-[170px] border p-6 text-left transition-all duration-300 ${
                selected
                  ? "border-[#171519] bg-[#171519] text-white shadow-[0_14px_35px_rgba(23,21,25,0.08)]"
                  : disabled ||
                      excluded
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
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
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
                {archetype.title}
              </h3>

              <p
                className={`mt-1 text-sm ${
                  selected
                    ? "text-white/55"
                    : "text-black/45"
                }`}
              >
                {archetype.subtitle}
              </p>

              <p
                className={`mt-4 text-sm leading-6 ${
                  selected
                    ? "text-white/65"
                    : "text-black/50"
                }`}
              >
                {archetype.description}
              </p>

              {excluded && (
                <span className="absolute bottom-5 right-6 text-[9px] uppercase tracking-[0.15em] text-black/25">
                  Primary selected
                </span>
              )}

              {selected && (
                <span className="absolute bottom-5 left-6 text-[9px] uppercase tracking-[0.15em] text-[#C9A876]">
                  {variant === "primary"
                    ? "Primary"
                    : "Secondary"}
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
  leftLabel,
  rightLabel,
  value,
  disabled,
  onChange,
}: {
  leftLabel: string;
  rightLabel: string;
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  const position = `${value}%`;

  return (
    <div className="border border-black/10 bg-white p-5 md:p-6">
      <div className="flex items-center justify-between gap-5">
        <span className="max-w-[38%] text-sm font-semibold">
          {leftLabel}
        </span>

        <div className="flex h-9 min-w-12 items-center justify-center border border-black/8 bg-[#F8F5F1] px-2 text-xs font-semibold">
          {value}
        </div>

        <span className="max-w-[38%] text-right text-sm font-semibold">
          {rightLabel}
        </span>
      </div>

      <div className="relative mt-8">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-black/8" />

        <div
          className="pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-[#171519]"
          style={{
            width: position,
          }}
        />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-5 w-px -translate-y-1/2 bg-black/10" />

        <input
          type="range"
          min="0"
          max="100"
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onChange(
              Number(event.target.value)
            )
          }
          aria-label={`${leftLabel} versus ${rightLabel}`}
          className="relative z-10 h-6 w-full cursor-pointer appearance-none bg-transparent accent-[#171519] disabled:cursor-default"
        />
      </div>

      <div className="mt-2 flex justify-between text-[9px] uppercase tracking-[0.14em] text-black/25">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

