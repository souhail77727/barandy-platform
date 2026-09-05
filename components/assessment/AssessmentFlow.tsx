
"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

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

  /*
   * Review mode is activated when the assessment
   * has already been completed.
   *
   * In review mode:
   * - answers are displayed
   * - answers cannot be edited
   * - no answer is saved again
   * - assessment cannot be regenerated
   */
  const [isReviewMode, setIsReviewMode] =
    useState(false);

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

  /*
   * Initialize or resume the assessment.
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

        /*
         * Authenticated user whose access
         * has not been approved yet.
         */
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

        /*
         * IMPORTANT:
         *
         * A completed assessment should NOT redirect
         * to /results automatically.
         *
         * Instead, load the saved answers and open
         * the assessment in review mode.
         */
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
            /*
             * If the API doesn't return progress for
             * a completed assessment, start the review
             * at the final section.
             */
            setDraft((current) => ({
              ...current,
              step: TOTAL_STEPS - 1,
            }));
          }

          return;
        }

        /*
         * Resume previously saved answers.
         */
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

        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-black/40">
              Assessment
            </p>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight">
              Preparing your assessment
            </h1>

            <p className="mt-4 text-sm leading-6 text-black/50">
              Your workspace is being prepared. This
              will only take a moment.
            </p>

            <div className="mx-auto mt-8 h-px w-32 overflow-hidden bg-black/10">
              <div className="h-full w-1/2 animate-pulse bg-[#171519]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Access pending state.
   *
   * The client is authenticated but has not
   * been manually approved yet.
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
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-black/40">
                Access pending
              </p>

              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Your assessment is waiting for you.
              </h1>

              <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-black/55 md:text-lg">
                Your account has been created successfully.
                Once your payment has been verified, your
                assessment access will be activated.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-lg border border-black/10 bg-white p-7 md:p-8">
              <p className="text-sm font-semibold">
                What happens next?
              </p>

              <div className="mt-6 space-y-5">
                <div className="flex gap-5">
                  <span className="text-xs font-medium tracking-[0.15em] text-black/40">
                    01
                  </span>

                  <div>
                    <p className="text-sm font-medium">
                      Complete your payment
                    </p>

                    <p className="mt-1 text-sm leading-6 text-black/50">
                      Follow the payment instructions available
                      in your Barandy account.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <span className="text-xs font-medium tracking-[0.15em] text-black/40">
                    02
                  </span>

                  <div>
                    <p className="text-sm font-medium">
                      Send your receipt
                    </p>

                    <p className="mt-1 text-sm leading-6 text-black/50">
                      Send your payment receipt to the Barandy
                      team for verification.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <span className="text-xs font-medium tracking-[0.15em] text-black/40">
                    03
                  </span>

                  <div>
                    <p className="text-sm font-medium">
                      Assessment unlocked
                    </p>

                    <p className="mt-1 text-sm leading-6 text-black/50">
                      Once your payment is verified, you can
                      begin creating your Brand DNA.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() =>
                  router.push("/payment")
                }
                className="bg-[#171519] px-7 py-4 text-sm font-medium text-white transition hover:bg-black/80"
              >
                View Payment Instructions
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

  /*
   * Save the current answer.
   *
   * Disabled completely in review mode.
   */
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

  /*
   * Complete the assessment.
   *
   * Only used for a new/in-progress assessment.
   */
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

  /*
   * Move to the next question.
   *
   * Review mode:
   * - no API call
   * - simply navigate through saved answers
   *
   * Normal mode:
   * - save answer
   * - move forward
   * - complete assessment on final step
   */
  async function handleNext() {
    if (
      isInitializing ||
      isSubmitting
    ) {
      return;
    }

    setError("");

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

      /*
       * Final review step.
       * Go to Brand DNA instead of regenerating it.
       */
      router.push("/results");
      return;
    }

    /*
     * NORMAL ASSESSMENT MODE
     */
    setIsSubmitting(true);

    try {
      if (!isCurrentStepValid()) {
        setError(
          "Please complete this section before continuing."
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

  function handleBack() {
    if (
      isInitializing ||
      isSubmitting
    ) {
      return;
    }

    setError("");

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
      case "text":
        return (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="personName"
                className="mb-3 block text-sm font-medium"
              >
                Your name
              </label>

              <input
                id="personName"
                type="text"
                autoComplete="name"
                value={draft.personName}
                readOnly={isReviewMode}
                onChange={(event) =>
                  updateDraft({
                    personName:
                      event.target.value,
                  })
                }
                placeholder="Your full name"
                className={`w-full border-b px-0 py-4 text-xl outline-none transition md:text-2xl ${
                  isReviewMode
                    ? "cursor-default border-black/10 bg-transparent text-black/70"
                    : "border-black/20 bg-transparent focus:border-black"
                }`}
              />

              <p className="mt-3 text-xs text-black/40">
                This will be used to personalize your
                Brand DNA.
              </p>
            </div>
          </div>
        );

      case "values":
        return (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-black/50">
                {isReviewMode
                  ? "Your selected values."
                  : "Select exactly 3 values."}
              </p>

              <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                {draft.selectedValues.length} / 3 selected
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {VALUE_OPTIONS.map((value) => {
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
                    className={`min-h-40 border p-6 text-left transition ${
                      selected
                        ? "border-[#171519] bg-[#171519] text-white"
                        : disabled ||
                            isReviewMode
                          ? "cursor-default border-black/10 bg-black/[0.02] opacity-60"
                          : "border-black/15 bg-white hover:border-black"
                    }`}
                  >
                    <div
                      className={`mb-4 text-[10px] font-medium tracking-[0.2em] ${
                        selected
                          ? "text-white/50"
                          : "text-black/40"
                      }`}
                    >
                      {selected
                        ? "SELECTED"
                        : "VALUE"}
                    </div>

                    <h3 className="text-lg font-semibold">
                      {value.name}
                    </h3>

                    <p
                      className={`mt-3 text-sm leading-6 ${
                        selected
                          ? "text-white/70"
                          : "text-black/60"
                      }`}
                    >
                      {value.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "archetypes":
        return (
          <div className="space-y-12">
            <div>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em]">
                    Primary archetype
                  </p>

                  <p className="mt-2 text-sm text-black/45">
                    Choose the archetype that best represents
                    your core identity.
                  </p>
                </div>

                {draft.primaryArchetypeId && (
                  <span className="shrink-0 text-xs uppercase tracking-[0.15em] text-black/40">
                    Selected
                  </span>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {ARCHETYPE_OPTIONS.map(
                  (archetype) => {
                    const selected =
                      draft.primaryArchetypeId ===
                      archetype.id;

                    return (
                      <button
                        key={archetype.id}
                        type="button"
                        onClick={() =>
                          selectArchetype(
                            archetype.id
                          )
                        }
                        disabled={isReviewMode}
                        aria-pressed={selected}
                        className={`border p-6 text-left transition ${
                          selected
                            ? "border-[#171519] bg-[#171519] text-white"
                            : isReviewMode
                              ? "cursor-default border-black/10 bg-black/[0.02] opacity-60"
                              : "border-black/15 bg-white hover:border-black"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {archetype.title}
                            </h3>

                            <p
                              className={`mt-1 text-sm ${
                                selected
                                  ? "text-white/60"
                                  : "text-black/50"
                              }`}
                            >
                              {archetype.subtitle}
                            </p>
                          </div>

                          {selected && (
                            <span className="text-xs tracking-[0.15em]">
                              ✓
                            </span>
                          )}
                        </div>

                        <p
                          className={`mt-4 text-sm leading-6 ${
                            selected
                              ? "text-white/75"
                              : "text-black/60"
                          }`}
                        >
                          {archetype.description}
                        </p>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div>
              <div className="mb-5">
                <p className="text-xs font-medium uppercase tracking-[0.2em]">
                  Secondary archetype
                </p>

                <p className="mt-2 text-sm text-black/45">
                  Choose a complementary archetype that
                  strengthens your identity.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {ARCHETYPE_OPTIONS.map(
                  (archetype) => {
                    const selected =
                      draft.secondaryArchetypeId ===
                      archetype.id;

                    const disabled =
                      draft.primaryArchetypeId ===
                      archetype.id;

                    return (
                      <button
                        key={archetype.id}
                        type="button"
                        disabled={
                          disabled ||
                          isReviewMode
                        }
                        onClick={() =>
                          selectSecondaryArchetype(
                            archetype.id
                          )
                        }
                        aria-pressed={selected}
                        className={`border p-6 text-left transition ${
                          selected
                            ? "border-[#171519] bg-[#171519] text-white"
                            : disabled ||
                                isReviewMode
                              ? "cursor-default border-black/10 bg-black/[0.02] opacity-50"
                              : "border-black/15 bg-white hover:border-black"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {archetype.title}
                            </h3>

                            <p
                              className={`mt-1 text-sm ${
                                selected
                                  ? "text-white/60"
                                  : "text-black/50"
                              }`}
                            >
                              {archetype.subtitle}
                            </p>
                          </div>

                          {selected && (
                            <span className="text-xs tracking-[0.15em]">
                              ✓
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        );

      case "textarea":
        return (
          <div>
            <textarea
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
                  ? "Write your purpose..."
                  : "Describe the professional future you want to build..."
              }
              rows={8}
              className={`w-full resize-none border p-6 text-base leading-8 outline-none transition md:text-lg ${
                isReviewMode
                  ? "cursor-default border-black/10 bg-black/[0.02] text-black/70"
                  : "border-black/15 bg-white focus:border-black"
              }`}
            />

            <p className="mt-3 text-xs text-black/40">
              {isReviewMode
                ? "This is a saved response from your completed assessment."
                : "Take your time. There is no right or wrong answer."}
            </p>
          </div>
        );

      case "ikigai":
        return (
          <div>
            <div className="mb-7">
              <p className="text-sm text-black/50">
                Explore the four dimensions of your Ikigai.
                The intersection is optional.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {(
                [
                  [
                    "passion",
                    "What you love",
                  ],
                  [
                    "mission",
                    "What the world needs",
                  ],
                  [
                    "vocation",
                    "What you are good at",
                  ],
                  [
                    "profession",
                    "What you can build a career around",
                  ],
                ] as const
              ).map(
                ([key, label]) => (
                  <div key={key}>
                    <label
                      htmlFor={`ikigai-${key}`}
                      className="mb-3 block text-sm font-medium"
                    >
                      {label}
                    </label>

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
                      className={`w-full resize-none border p-4 leading-7 outline-none transition ${
                        isReviewMode
                          ? "cursor-default border-black/10 bg-black/[0.02] text-black/70"
                          : "border-black/15 bg-white focus:border-black"
                      }`}
                    />
                  </div>
                )
              )}

              <div className="md:col-span-2">
                <label
                  htmlFor="ikigai-intersection"
                  className="mb-3 block text-sm font-medium"
                >
                  Your intersection

                  <span className="ml-2 text-black/40">
                    Optional
                  </span>
                </label>

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
                  placeholder="Where do these four dimensions meet?"
                  className={`w-full resize-none border p-4 leading-7 outline-none transition ${
                    isReviewMode
                      ? "cursor-default border-black/10 bg-black/[0.02] text-black/70"
                      : "border-black/15 bg-white focus:border-black"
                  }`}
                />
              </div>
            </div>
          </div>
        );

      case "perception":
        return (
          <div>
            <p className="mb-10 text-sm leading-6 text-black/50">
              There are no right answers. Move each slider
              toward the side that feels more natural to you.
            </p>

            <div className="space-y-12">
              {PERCEPTION_DIMENSIONS.map(
                (dimension) => {
                  const key =
                    dimension.id as keyof AssessmentDraft["perception"];

                  const value =
                    draft.perception[key];

                  return (
                    <div
                      key={dimension.id}
                    >
                      <div className="mb-5 flex items-center justify-between gap-6 text-sm">
                        <span className="max-w-[40%] font-medium">
                          {dimension.leftLabel}
                        </span>

                        <span className="text-xs font-medium uppercase tracking-[0.15em] text-black/35">
                          {value}
                        </span>

                        <span className="max-w-[40%] text-right font-medium">
                          {dimension.rightLabel}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        disabled={isReviewMode}
                        onChange={(event) =>
                          updatePerception(
                            key,
                            Number(
                              event.target
                                .value
                            )
                          )
                        }
                        aria-label={`${dimension.leftLabel} versus ${dimension.rightLabel}`}
                        className={`w-full ${
                          isReviewMode
                            ? "cursor-default opacity-70"
                            : "cursor-pointer accent-[#171519]"
                        }`}
                      />

                      <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.15em] text-black/30">
                        <span>
                          {dimension.leftLabel}
                        </span>

                        <span>
                          {dimension.rightLabel}
                        </span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        );

      case "voice":
        return (
          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-black/50">
                {isReviewMode
                  ? "Your selected voice qualities."
                  : "Select the qualities you want your voice to communicate."}
              </p>

              <p className="shrink-0 text-xs font-medium uppercase tracking-[0.15em] text-black/40">
                {draft.selectedTones.length} / 4
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {VOICE_TONES.map((tone) => {
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
                    className={`border px-5 py-4 text-sm transition ${
                      selected
                        ? "border-[#171519] bg-[#171519] text-white"
                        : disabled ||
                            isReviewMode
                          ? "cursor-default border-black/10 bg-black/[0.02] opacity-50"
                          : "border-black/15 bg-white hover:border-black"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      {tone}

                      {selected && (
                        <span className="text-xs">
                          ✓
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  const isLastStep =
    draft.step === TOTAL_STEPS - 1;

  const isFirstStep =
    draft.step === 0;

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <ClientHeader
        currentPage="assessment"
        showBack
      />

      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        {/* Assessment meta */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-black/40">
              {isReviewMode
                ? "Assessment Review"
                : "Your Brand DNA"}
            </p>

            <p className="mt-2 text-sm text-black/45">
              {isReviewMode
                ? "Review the answers you submitted."
                : "Your answers are saved as you continue."}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-black/40">
              Step
            </p>

            <p className="mt-1 text-lg font-semibold">
              {String(draft.step + 1).padStart(
                2,
                "0"
              )}{" "}
              <span className="font-normal text-black/35">
                / {String(TOTAL_STEPS).padStart(2, "0")}
              </span>
            </p>
          </div>
        </div>

        {/* Review mode notice */}
        {isReviewMode && (
          <div className="mb-10 border border-black/10 bg-white px-5 py-4">
            <div className="flex items-start gap-4">
              <span className="text-xs font-semibold">
                ✓
              </span>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/45">
                  Completed assessment
                </p>

                <p className="mt-2 text-sm leading-6 text-black/55">
                  Your assessment has already been completed.
                  You are viewing your saved answers in review
                  mode.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mb-16">
          <div className="mb-3 flex items-center justify-between text-xs text-black/40">
            <span>
              {progress}% complete
            </span>

            <span>
              {isLastStep
                ? "Final step"
                : `${TOTAL_STEPS - draft.step - 1} ${
                    TOTAL_STEPS - draft.step - 1 === 1
                      ? "step"
                      : "steps"
                  } remaining`}
            </span>
          </div>

          <div className="h-[2px] bg-black/10">
            <div
              className="h-full bg-[#171519] transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <section className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-black/35">
              {String(
                draft.step + 1
              ).padStart(2, "0")}
            </p>

            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
              {currentQuestion.title}
            </h1>

            {currentQuestion.description && (
              <p className="mt-7 max-w-2xl text-base leading-8 text-black/55 md:text-lg">
                {currentQuestion.description}
              </p>
            )}
          </div>

          {/* Question content */}
          <div className="min-h-[320px]">
            {renderQuestion()}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-10 flex items-start gap-4 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <span className="mt-0.5 font-medium">
                !
              </span>

              <p className="leading-6">
                {error}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-16 border-t border-black/10 pt-8">
            <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={
                  isFirstStep ||
                  isSubmitting
                }
                className="py-3 text-left text-sm font-medium text-black/50 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-20"
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="w-full bg-[#171519] px-8 py-4 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[220px]"
              >
                {isReviewMode
                  ? isLastStep
                    ? "View My Brand DNA →"
                    : "Next →"
                  : isSubmitting
                    ? isLastStep
                      ? "Generating..."
                      : "Saving..."
                    : isLastStep
                      ? "Generate My Brand DNA"
                      : "Continue →"}
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.15em] text-black/30">
              <span>
                {isReviewMode
                  ? "Reviewing your saved assessment"
                  : "Your progress is saved automatically"}
              </span>

              <span className="hidden sm:block">
                Barandy Personal Brand Intelligence
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

