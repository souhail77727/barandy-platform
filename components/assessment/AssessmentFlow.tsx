"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  ARCHETYPE_OPTIONS,
  ASSESSMENT_QUESTIONS,
  PERCEPTION_DIMENSIONS,
  VALUE_OPTIONS,
  VOICE_TONES,
} from "@/lib/assessment/questions";

import type { AssessmentDraft } from "@/types/assessment";

const TOTAL_STEPS =
  ASSESSMENT_QUESTIONS.length;

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
    useState<AssessmentDraft>(
      INITIAL_DRAFT
    );

  const [isInitializing, setIsInitializing] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const currentQuestion =
    ASSESSMENT_QUESTIONS[draft.step];

  const progress = useMemo(() => {
    return Math.round(
      ((draft.step + 1) / TOTAL_STEPS) * 100
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

        const response = await fetch(
          "/api/assessment/start",
          {
            method: "POST",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to start assessment."
          );
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
                    Math.max(data.progress, 0),
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

  if (!currentQuestion) {
    return null;
  }

  function updateDraft(
    updates: Partial<AssessmentDraft>
  ) {
    setDraft((current) => ({
      ...current,
      ...updates,
    }));
  }

  function updatePerception(
    key: keyof AssessmentDraft["perception"],
    value: number
  ) {
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
    setDraft((current) => ({
      ...current,
      ikigai: {
        ...current.ikigai,
        [key]: value,
      },
    }));
  }

  function toggleValue(valueId: string) {
    setDraft((current) => {
      const alreadySelected =
        current.selectedValues.includes(
          valueId
        );

      if (alreadySelected) {
        return {
          ...current,
          selectedValues:
            current.selectedValues.filter(
              (id) => id !== valueId
            ),
        };
      }

      if (
        current.selectedValues.length >= 3
      ) {
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
    setDraft((current) => {
      const alreadySelected =
        current.selectedTones.includes(
          tone
        );

      if (alreadySelected) {
        return {
          ...current,
          selectedTones:
            current.selectedTones.filter(
              (item) => item !== tone
            ),
        };
      }

      if (
        current.selectedTones.length >= 4
      ) {
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
   */
  async function saveAnswer(
    questionId: string
  ) {
    const response = await fetch(
      "/api/assessment/answer",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          questionId,
          answer:
            getAnswerForQuestion(
              questionId
            ),
          step: draft.step + 1,
        }),
      }
    );

    const data =
      await response.json();

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
   * This is intentionally handled inside
   * handleNext() after the final answer has
   * been successfully saved.
   */
  async function completeAssessment() {
    const response = await fetch(
      "/api/assessment/complete",
      {
        method: "POST",
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Failed to complete assessment."
      );
    }

    return data;
  }

  /*
   * IMPORTANT:
   *
   * isSubmitting is locked immediately at
   * the beginning of this function.
   *
   * This prevents:
   *
   * - double clicks
   * - duplicate answer requests
   * - duplicate completion requests
   * - an extra request after completion
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
     * Lock navigation BEFORE any async
     * operation starts.
     */
    setIsSubmitting(true);

    try {
      /*
       * Validate current question.
       */
      if (!isCurrentStepValid()) {
        setError(
          "Please complete this section before continuing."
        );

        return;
      }

      /*
       * Save current answer.
       */
      await saveAnswer(
        currentQuestion.id
      );

      /*
       * If this isn't the last question,
       * simply move to the next step.
       */
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
       * Last question:
       *
       * The final answer has already been
       * saved above.
       *
       * Now generate Brand DNA.
       */
      await completeAssessment();

      /*
       * Only redirect after successful
       * backend completion.
       */
      router.push("/results");
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
      /*
       * Unlock only after the entire operation
       * has finished.
       */
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
                value={draft.personName}
                onChange={(event) =>
                  updateDraft({
                    personName:
                      event.target.value,
                  })
                }
                placeholder="Your full name"
                className="w-full border-b border-black/20 bg-transparent px-0 py-4 text-2xl outline-none transition focus:border-black"
              />
            </div>
          </div>
        );

      case "values":
        return (
          <div className="grid gap-4 md:grid-cols-3">
            {VALUE_OPTIONS.map(
              (value) => {
                const selected =
                  draft.selectedValues.includes(
                    value.id
                  );

                return (
                  <button
                    key={value.id}
                    type="button"
                    onClick={() =>
                      toggleValue(
                        value.id
                      )
                    }
                    className={`min-h-40 border p-6 text-left transition ${
                      selected
                        ? "border-black bg-black text-white"
                        : "border-black/15 bg-white hover:border-black"
                    }`}
                  >
                    <div className="mb-4 text-xs tracking-[0.2em]">
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
                      {
                        value.description
                      }
                    </p>
                  </button>
                );
              }
            )}
          </div>
        );

      case "archetypes":
        return (
          <div className="space-y-10">
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em]">
                Primary archetype
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {ARCHETYPE_OPTIONS.map(
                  (archetype) => {
                    const selected =
                      draft.primaryArchetypeId ===
                      archetype.id;

                    return (
                      <button
                        key={
                          archetype.id
                        }
                        type="button"
                        onClick={() =>
                          selectArchetype(
                            archetype.id
                          )
                        }
                        className={`border p-6 text-left transition ${
                          selected
                            ? "border-black bg-black text-white"
                            : "border-black/15 bg-white hover:border-black"
                        }`}
                      >
                        <h3 className="text-lg font-semibold">
                          {
                            archetype.title
                          }
                        </h3>

                        <p
                          className={`mt-1 text-sm ${
                            selected
                              ? "text-white/70"
                              : "text-black/50"
                          }`}
                        >
                          {
                            archetype.subtitle
                          }
                        </p>

                        <p
                          className={`mt-4 text-sm leading-6 ${
                            selected
                              ? "text-white/80"
                              : "text-black/60"
                          }`}
                        >
                          {
                            archetype.description
                          }
                        </p>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em]">
                Secondary archetype
              </p>

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
                        key={
                          archetype.id
                        }
                        type="button"
                        disabled={
                          disabled
                        }
                        onClick={() =>
                          selectSecondaryArchetype(
                            archetype.id
                          )
                        }
                        className={`border p-6 text-left transition ${
                          disabled
                            ? "cursor-not-allowed opacity-30"
                            : selected
                              ? "border-black bg-black text-white"
                              : "border-black/15 bg-white hover:border-black"
                        }`}
                      >
                        <h3 className="text-lg font-semibold">
                          {
                            archetype.title
                          }
                        </h3>

                        <p
                          className={`mt-1 text-sm ${
                            selected
                              ? "text-white/70"
                              : "text-black/50"
                          }`}
                        >
                          {
                            archetype.subtitle
                          }
                        </p>
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
          <textarea
            value={
              currentQuestion.id ===
              "purpose"
                ? draft.purpose
                : draft.vision
            }
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
            rows={7}
            className="w-full resize-none border border-black/15 bg-white p-6 text-lg leading-8 outline-none transition focus:border-black"
          />
        );

      case "ikigai":
        return (
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
                  <label className="mb-3 block text-sm font-medium">
                    {label}
                  </label>

                  <textarea
                    value={
                      draft.ikigai[key]
                    }
                    onChange={(event) =>
                      updateIkigai(
                        key,
                        event.target
                          .value
                      )
                    }
                    rows={5}
                    className="w-full resize-none border border-black/15 bg-white p-4 outline-none transition focus:border-black"
                  />
                </div>
              )
            )}

            <div className="md:col-span-2">
              <label className="mb-3 block text-sm font-medium">
                Your intersection
                <span className="ml-2 text-black/40">
                  Optional
                </span>
              </label>

              <textarea
                value={
                  draft.ikigai
                    .intersection ?? ""
                }
                onChange={(event) =>
                  updateIkigai(
                    "intersection",
                    event.target.value
                  )
                }
                rows={4}
                placeholder="Where do these four dimensions meet?"
                className="w-full resize-none border border-black/15 bg-white p-4 outline-none transition focus:border-black"
              />
            </div>
          </div>
        );

      case "perception":
        return (
          <div className="space-y-10">
            {PERCEPTION_DIMENSIONS.map(
              (dimension) => {
                const key =
                  dimension.id as keyof AssessmentDraft["perception"];

                const value =
                  draft.perception[key];

                return (
                  <div
                    key={
                      dimension.id
                    }
                  >
                    <div className="mb-4 flex justify-between gap-4 text-sm">
                      <span>
                        {
                          dimension.leftLabel
                        }
                      </span>

                      <span>
                        {
                          dimension.rightLabel
                        }
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(event) =>
                        updatePerception(
                          key,
                          Number(
                            event.target
                              .value
                          )
                        )
                      }
                      className="w-full"
                    />

                    <div className="mt-2 text-center text-xs text-black/40">
                      {value}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        );

      case "voice":
        return (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {VOICE_TONES.map(
              (tone) => {
                const selected =
                  draft.selectedTones.includes(
                    tone
                  );

                return (
                  <button
                    key={tone}
                    type="button"
                    onClick={() =>
                      toggleTone(
                        tone
                      )
                    }
                    className={`border px-5 py-4 text-sm transition ${
                      selected
                        ? "border-black bg-black text-white"
                        : "border-black/15 bg-white hover:border-black"
                    }`}
                  >
                    {tone}
                  </button>
                );
              }
            )}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#171519]">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-16">
        {/* Header */}
        <div className="mb-14 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.25em]">
              BARANDY
            </p>

            <p className="mt-2 text-xs text-black/45">
              Personal Brand Intelligence
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-black/40">
              Assessment
            </p>

            <p className="mt-1 text-sm font-medium">
              {draft.step + 1} /{" "}
              {TOTAL_STEPS}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-14">
          <div className="mb-3 flex justify-between text-xs text-black/40">
            <span>
              Your Brand DNA
            </span>

            <span>
              {progress}%
            </span>
          </div>

          <div className="h-px bg-black/10">
            <div
              className="h-px bg-[#171519] transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <section className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-black/40">
              0
              {draft.step + 1}
            </p>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              {currentQuestion.title}
            </h1>

            {currentQuestion.description && (
              <p className="mt-6 max-w-2xl text-base leading-7 text-black/55 md:text-lg">
                {
                  currentQuestion.description
                }
              </p>
            )}
          </div>

          {/* Content */}
          <div className="min-h-[320px]">
            {renderQuestion()}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-8 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-14 flex items-center justify-between border-t border-black/10 pt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={
                draft.step === 0 ||
                isInitializing ||
                isSubmitting
              }
              className="text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-20"
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={
                isInitializing ||
                isSubmitting
              }
              className="bg-[#171519] px-8 py-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isInitializing
                ? "Preparing..."
                : isSubmitting
                  ? draft.step ===
                    TOTAL_STEPS - 1
                    ? "Generating..."
                    : "Saving..."
                  : draft.step ===
                      TOTAL_STEPS - 1
                    ? "Generate My Brand DNA"
                    : "Continue →"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}