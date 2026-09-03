import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { calculateBrandDNAFromAssessment } from "@/lib/brand-engine/calculate-brand-dna";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const assessment = await prisma.assessment.findFirst({
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

    if (
      !assessment.answers ||
      typeof assessment.answers !== "object" ||
      Array.isArray(assessment.answers)
    ) {
      return NextResponse.json(
        { error: "Assessment answers are incomplete" },
        { status: 400 }
      );
    }

    const answers = assessment.answers as Record<
      string,
      unknown
    >;

    const brandDNA =
      calculateBrandDNAFromAssessment({
        step: assessment.progress,

        selectedValues:
          Array.isArray(answers.selectedValues)
            ? answers.selectedValues.filter(
                (value): value is string =>
                  typeof value === "string"
              )
            : [],

        primaryArchetypeId:
          typeof answers.primaryArchetypeId === "string"
            ? answers.primaryArchetypeId
            : "sage",

        secondaryArchetypeId:
          typeof answers.secondaryArchetypeId === "string"
            ? answers.secondaryArchetypeId
            : "creator",

        personName:
          typeof answers.personName === "string"
            ? answers.personName
            : "",

        purpose:
          typeof answers.purpose === "string"
            ? answers.purpose
            : "",

        vision:
          typeof answers.vision === "string"
            ? answers.vision
            : "",

        perception:
          answers.perception &&
          typeof answers.perception === "object"
            ? (answers.perception as {
                authorityVsAccessibility: number;
                innovationVsTradition: number;
                provocativeVsReassuring: number;
                specialistVsPolymath: number;
              })
            : {
                authorityVsAccessibility: 50,
                innovationVsTradition: 50,
                provocativeVsReassuring: 50,
                specialistVsPolymath: 50,
              },

        ikigai:
          answers.ikigai &&
          typeof answers.ikigai === "object"
            ? (answers.ikigai as {
                passion: string;
                mission: string;
                vocation: string;
                profession: string;
                intersection?: string;
              })
            : {
                passion: "",
                mission: "",
                vocation: "",
                profession: "",
              },

        selectedTones:
          Array.isArray(answers.selectedTones)
            ? answers.selectedTones.filter(
                (value): value is string =>
                  typeof value === "string"
              )
            : [],
      });

    const result =
      await prisma.result.upsert({
        where: {
          assessmentId: assessment.id,
        },

        update: {
          brandDNA:
            brandDNA as unknown as Prisma.InputJsonValue,
        },

        create: {
          assessmentId: assessment.id,
          brandDNA:
            brandDNA as unknown as Prisma.InputJsonValue,
        },
      });

    await prisma.assessment.update({
      where: {
        id: assessment.id,
      },

      data: {
        status: "COMPLETED",
        progress: 100,
      },
    });

    return NextResponse.json({
      success: true,
      resultId: result.id,
      brandDNA,
    });
  } catch (error) {
    console.error(
      "Assessment completion error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to complete assessment",
      },
      {
        status: 500,
      }
    );
  }
}