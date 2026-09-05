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
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Check the role of the currently authenticated user
    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: true,
      },
    });

    // Only ADMIN and DEVELOPER can verify payments
    if (
      !currentUser ||
      (currentUser.role !== "ADMIN" &&
        currentUser.role !== "DEVELOPER")
    ) {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const { id: userId } = await context.params;

    if (!userId) {
      return NextResponse.json(
        {
          error: "User ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // Find the client
    const client = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        accessGranted: true,
        assessments: {
          where: {
            status: "COMPLETED",
          },
          select: {
            id: true,
            result: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        {
          error: "Client not found",
        },
        {
          status: 404,
        }
      );
    }

    // Make sure the target user is actually a client
    if (client.role !== "CLIENT") {
      return NextResponse.json(
        {
          error: "This user is not a client.",
        },
        {
          status: 400,
        }
      );
    }

    // Prevent unnecessary duplicate unlocks
    if (client.accessGranted) {
      return NextResponse.json({
        success: true,
        message: "Brand DNA is already unlocked.",
      });
    }

    const completedAssessment = client.assessments[0];

    // Client must have completed the assessment
    if (!completedAssessment) {
      return NextResponse.json(
        {
          error:
            "This client has not completed the assessment.",
        },
        {
          status: 400,
        }
      );
    }

    // Brand DNA must already exist
    if (!completedAssessment.result) {
      return NextResponse.json(
        {
          error:
            "Brand DNA has not been generated for this client yet.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * MVP PAYMENT VERIFICATION
     *
     * Saif verifies the payment receipt manually by email.
     * Once verified, this action grants access to the Brand DNA.
     */
    const updatedUser = await prisma.user.update({
      where: {
        id: client.id,
      },
      data: {
        accessGranted: true,
      },
      select: {
        id: true,
        email: true,
        accessGranted: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and Brand DNA unlocked.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Admin unlock payment error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to verify payment and unlock Brand DNA.",
      },
      {
        status: 500,
      }
    );
  }
}