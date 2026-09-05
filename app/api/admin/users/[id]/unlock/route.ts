import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (
      !currentUser ||
      (currentUser.role !== "ADMIN" && currentUser.role !== "DEVELOPER")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: userId } = await context.params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const client = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        accessGranted: true,
        assessments: {
          where: { status: "COMPLETED" },
          select: {
            id: true,
            result: { select: { id: true } },
          },
          orderBy: { updatedAt: "desc" },
          take: 1,
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    if (client.role !== "CLIENT") {
      return NextResponse.json(
        { error: "This user is not a client." },
        { status: 400 }
      );
    }

    if (client.accessGranted) {
      return NextResponse.json({
        success: true,
        message: "Brand DNA is already unlocked.",
      });
    }

    const completedAssessment = client.assessments[0];

    if (!completedAssessment) {
      return NextResponse.json(
        { error: "This client has not completed the assessment." },
        { status: 400 }
      );
    }

    if (!completedAssessment.result) {
      return NextResponse.json(
        { error: "Brand DNA has not been generated for this client yet." },
        { status: 400 }
      );
    }

    // Payment must exist and still be pending before an admin can verify it.
    const pendingPayment = await prisma.payment.findFirst({
      where: {
        userId: client.id,
        status: "PENDING",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!pendingPayment) {
      return NextResponse.json(
        { error: "No pending payment found for this client." },
        { status: 400 }
      );
    }

    if (pendingPayment.amount !== 100 || pendingPayment.currency !== "tnd") {
      return NextResponse.json(
        { error: "The payment amount or currency is invalid." },
        { status: 400 }
      );
    }

    const [payment, updatedUser] = await prisma.$transaction([
      prisma.payment.update({
        where: { id: pendingPayment.id },
        data: { status: "PAID" },
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
        },
      }),
      prisma.user.update({
        where: { id: client.id },
        data: { accessGranted: true },
        select: {
          id: true,
          email: true,
          accessGranted: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Payment verified and Brand DNA unlocked.",
      payment,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Admin unlock payment error:", error);

    return NextResponse.json(
      { error: "Failed to verify payment and unlock Brand DNA." },
      { status: 500 }
    );
  }
}