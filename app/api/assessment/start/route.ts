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

    // Find the user's existing assessment.
    // For the MVP, each client should have only ONE assessment.
    const existingAssessment = await prisma.assessment.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // If an assessment already exists, resume/use it.
    if (existingAssessment) {
      return NextResponse.json({
        success: true,
        assessmentId: existingAssessment.id,
        status: existingAssessment.status,
        progress: existingAssessment.progress,
        answers: existingAssessment.answers ?? {},
      });
    }

    // Create the first and only assessment for this client.
    const assessment = await prisma.assessment.create({
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
      status: assessment.status,
      progress: assessment.progress,
      answers: assessment.answers ?? {},
    });
  } catch (error) {
    console.error("Assessment start error:", error);

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