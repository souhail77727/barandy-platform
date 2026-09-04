import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const questionId =
      typeof body.questionId === "string"
        ? body.questionId
        : "";

    const answer = body.answer;

    const step =
      typeof body.step === "number"
        ? body.step
        : 0;

    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    const assessment =
      await prisma.assessment.findFirst({
        where: {
          userId,
          status: "IN_PROGRESS",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (!assessment) {
      return NextResponse.json(
        { error: "No active assessment found" },
        { status: 404 }
      );
    }

    const existingAnswers =
      assessment.answers &&
      typeof assessment.answers === "object" &&
      !Array.isArray(assessment.answers)
        ? (assessment.answers as Record<
            string,
            unknown
          >)
        : {};

    let updatedAnswers: Record<
      string,
      unknown
    > = {
      ...existingAnswers,
    };

    switch (questionId) {
      case "identity":
        if (
          typeof answer === "object" &&
          answer !== null &&
          !Array.isArray(answer)
        ) {
          const identity =
            answer as {
              personName?: unknown;
            };

          updatedAnswers.personName =
            typeof identity.personName === "string"
              ? identity.personName
              : "";
        }
        break;

      case "values":
        if (Array.isArray(answer)) {
          updatedAnswers.selectedValues =
            answer.filter(
              (value): value is string =>
                typeof value === "string"
            );
        }
        break;

      case "archetypes":
        if (
          typeof answer === "object" &&
          answer !== null &&
          !Array.isArray(answer)
        ) {
          const archetypes =
            answer as {
              primaryArchetypeId?: unknown;
              secondaryArchetypeId?: unknown;
            };

          updatedAnswers.primaryArchetypeId =
            typeof archetypes.primaryArchetypeId ===
            "string"
              ? archetypes.primaryArchetypeId
              : "";

          updatedAnswers.secondaryArchetypeId =
            typeof archetypes.secondaryArchetypeId ===
            "string"
              ? archetypes.secondaryArchetypeId
              : "";
        }
        break;

      case "purpose":
        updatedAnswers.purpose =
          typeof answer === "string"
            ? answer
            : "";
        break;

      case "vision":
        updatedAnswers.vision =
          typeof answer === "string"
            ? answer
            : "";
        break;

      case "ikigai":
        if (
          typeof answer === "object" &&
          answer !== null &&
          !Array.isArray(answer)
        ) {
          updatedAnswers.ikigai = answer;
        }
        break;

      case "perception":
        if (
          typeof answer === "object" &&
          answer !== null &&
          !Array.isArray(answer)
        ) {
          updatedAnswers.perception = answer;
        }
        break;

      case "voice":
        if (Array.isArray(answer)) {
          updatedAnswers.selectedTones =
            answer.filter(
              (value): value is string =>
                typeof value === "string"
            );
        }
        break;

      default:
        return NextResponse.json(
          { error: "Unknown question ID" },
          { status: 400 }
        );
    }

    const updatedAssessment =
      await prisma.assessment.update({
        where: {
          id: assessment.id,
        },

        data: {
          answers:
            updatedAnswers as Prisma.InputJsonValue,

          progress: Math.min(
            Math.max(step, 0),
            100
          ),
        },
      });

    return NextResponse.json({
      success: true,
      assessmentId: updatedAssessment.id,
      questionId,
      progress: updatedAssessment.progress,
    });
  } catch (error) {
    console.error(
      "Assessment answer error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to save assessment answer",
      },
      {
        status: 500,
      }
    );
  }
}