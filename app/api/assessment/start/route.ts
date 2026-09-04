import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Resume the user's latest unfinished assessment
    const existingAssessment =
      await prisma.assessment.findFirst({
        where: {
          userId,
          status: "IN_PROGRESS",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (existingAssessment) {
      return NextResponse.json({
        success: true,
        assessmentId: existingAssessment.id,
        progress: existingAssessment.progress,
        answers: existingAssessment.answers ?? {},
      });
    }

    // Create a new assessment
    const assessment =
      await prisma.assessment.create({
        data: {
          userId,
          status: "IN_PROGRESS",
          progress: 0,
          answers: {},
          startedAt: new Date(),
        },
      });

    return NextResponse.json({
      success: true,
      assessmentId: assessment.id,
      progress: assessment.progress,
      answers: assessment.answers ?? {},
    });
  } catch (error) {
    console.error(
      "Assessment start error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to start assessment",
      },
      {
        status: 500,
      }
    );
  }
}