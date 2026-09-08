import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const DEVELOPER_RATE = 0.1;

export async function GET() {
  try {
    // --------------------------------------------------
    // AUTHENTICATION
    // --------------------------------------------------

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // ADMIN / DEVELOPER AUTHORIZATION
    // --------------------------------------------------

    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: true,
      },
    });

    if (
      !currentUser ||
      (currentUser.role !== "ADMIN" &&
        currentUser.role !== "DEVELOPER")
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const now = new Date();

    // --------------------------------------------------
    // DATE RANGES
    // --------------------------------------------------

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const startOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    // --------------------------------------------------
    // CLIENT ACCOUNTS
    // --------------------------------------------------

    const totalAccounts = await prisma.user.count({
      where: {
        role: "CLIENT",
      },
    });

    const newAccountsThisMonth = await prisma.user.count({
      where: {
        role: "CLIENT",
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    const newAccountsLastMonth = await prisma.user.count({
      where: {
        role: "CLIENT",
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // --------------------------------------------------
    // ASSESSMENTS
    // --------------------------------------------------

    const assessmentsStarted = await prisma.assessment.count({
      where: {
        startedAt: {
          not: null,
        },
        user: {
          role: "CLIENT",
        },
      },
    });

    const assessmentsCompleted = await prisma.assessment.count({
      where: {
        status: "COMPLETED",
        user: {
          role: "CLIENT",
        },
      },
    });

    const assessmentsInProgress = await prisma.assessment.count({
      where: {
        status: "IN_PROGRESS",
        user: {
          role: "CLIENT",
        },
      },
    });

    const assessmentsNotStarted = await prisma.assessment.count({
      where: {
        status: "NOT_STARTED",
        user: {
          role: "CLIENT",
        },
      },
    });

    // --------------------------------------------------
    // CLIENTS WITHOUT AN ASSESSMENT
    // --------------------------------------------------

    const clientsWithoutAssessment =
      await prisma.user.count({
        where: {
          role: "CLIENT",
          assessments: {
            none: {},
          },
        },
      });

    // --------------------------------------------------
    // PAYMENTS
    // --------------------------------------------------

    const paidPayments = await prisma.payment.findMany({
      where: {
        status: "PAID",
        user: {
          role: "CLIENT",
        },
      },
      select: {
        amount: true,
        currency: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const totalRevenue = paidPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    const paidClients = await prisma.user.count({
      where: {
        role: "CLIENT",
        payments: {
          some: {
            status: "PAID",
          },
        },
      },
    });

    const developerProfit = Math.round(
      totalRevenue * DEVELOPER_RATE
    );

    const barandyRevenue =
      totalRevenue - developerProfit;

    // --------------------------------------------------
    // CURRENT MONTH REVENUE
    // --------------------------------------------------

    const revenueThisMonth = paidPayments
      .filter(
        (payment) =>
          new Date(payment.createdAt) >= startOfMonth
      )
      .reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

    const developerProfitThisMonth = Math.round(
      revenueThisMonth * DEVELOPER_RATE
    );

    // --------------------------------------------------
    // REVENUE BY MONTH
    // --------------------------------------------------

    const revenueByMonth: Record<string, number> = {};

    paidPayments.forEach((payment) => {
      const date = new Date(payment.createdAt);

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      revenueByMonth[key] =
        (revenueByMonth[key] || 0) + payment.amount;
    });

    // --------------------------------------------------
    // ACCOUNTS BY MONTH
    // --------------------------------------------------

    const clients = await prisma.user.findMany({
      where: {
        role: "CLIENT",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const accountsByMonth: Record<string, number> = {};

    clients.forEach((client) => {
      const date = new Date(client.createdAt);

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      accountsByMonth[key] =
        (accountsByMonth[key] || 0) + 1;
    });

    // --------------------------------------------------
    // ACCOUNT CREATION BY HOUR
    // --------------------------------------------------

    const accountCreationByHour = Array.from(
      { length: 24 },
      (_, hour) => ({
        hour,
        count: 0,
      })
    );

    clients.forEach((client) => {
      const hour = new Date(
        client.createdAt
      ).getHours();

      accountCreationByHour[hour].count++;
    });

    // --------------------------------------------------
    // ASSESSMENT ACTIVITY BY HOUR
    // --------------------------------------------------

    const startedAssessments =
      await prisma.assessment.findMany({
        where: {
          startedAt: {
            not: null,
          },
          user: {
            role: "CLIENT",
          },
        },
        select: {
          startedAt: true,
        },
      });

    const assessmentActivityByHour = Array.from(
      { length: 24 },
      (_, hour) => ({
        hour,
        count: 0,
      })
    );

    startedAssessments.forEach((assessment) => {
      if (!assessment.startedAt) return;

      const hour = new Date(
        assessment.startedAt
      ).getHours();

      assessmentActivityByHour[hour].count++;
    });

    // --------------------------------------------------
    // RECENT USERS
    // --------------------------------------------------

    const recentUsers = await prisma.user.findMany({
      where: {
        role: "CLIENT",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // --------------------------------------------------
    // RECENT ASSESSMENTS
    // --------------------------------------------------

    const recentAssessments =
      await prisma.assessment.findMany({
        where: {
          user: {
            role: "CLIENT",
          },
        },
        select: {
          id: true,
          status: true,
          progress: true,
          startedAt: true,
          updatedAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 5,
      });

    // --------------------------------------------------
    // RECENT PAYMENTS
    // --------------------------------------------------

    const recentPayments =
      await prisma.payment.findMany({
        where: {
          user: {
            role: "CLIENT",
          },
        },
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });

    // --------------------------------------------------
    // CONVERSION FUNNEL
    // --------------------------------------------------

    const accountToAssessment =
      totalAccounts > 0
        ? Math.round(
            (assessmentsStarted /
              totalAccounts) *
              100
          )
        : 0;

    const assessmentCompletion =
      assessmentsStarted > 0
        ? Math.round(
            (assessmentsCompleted /
              assessmentsStarted) *
              100
          )
        : 0;

    const completionToPayment =
      assessmentsCompleted > 0
        ? Math.round(
            (paidClients /
              assessmentsCompleted) *
              100
          )
        : 0;

    const accountToPayment =
      totalAccounts > 0
        ? Math.round(
            (paidClients /
              totalAccounts) *
              100
          )
        : 0;

    // --------------------------------------------------
    // PEAK HOURS
    // --------------------------------------------------

    const peakAccountCreationHour =
      accountCreationByHour.reduce(
        (max, current) =>
          current.count > max.count
            ? current
            : max,
        accountCreationByHour[0]
      );

    const peakAssessmentHour =
      assessmentActivityByHour.reduce(
        (max, current) =>
          current.count > max.count
            ? current
            : max,
        assessmentActivityByHour[0]
      );

    // --------------------------------------------------
    // MONTHLY ACCOUNT GROWTH
    // --------------------------------------------------

    const accountGrowth = Object.entries(
      accountsByMonth
    )
      .sort(([a], [b]) =>
        a.localeCompare(b)
      )
      .map(([month, count]) => ({
        month,
        count,
      }));

    // --------------------------------------------------
    // MONTHLY REVENUE GROWTH
    // --------------------------------------------------

    const revenueGrowth = Object.entries(
      revenueByMonth
    )
      .sort(([a], [b]) =>
        a.localeCompare(b)
      )
      .map(([month, revenue]) => ({
        month,
        revenue,
      }));

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return NextResponse.json({
      success: true,

      kpis: {
        totalAccounts,
        newAccountsThisMonth,
        newAccountsLastMonth,

        assessmentsStarted,
        assessmentsCompleted,
        assessmentsInProgress,
        assessmentsNotStarted,

        clientsWithoutAssessment,

        paidClients,

        totalRevenue,
        revenueThisMonth,

        developerProfit,
        developerProfitThisMonth,

        barandyRevenue,

        accountToAssessment,
        assessmentCompletion,
        completionToPayment,
        accountToPayment,
      },

      charts: {
        accountGrowth,
        revenueGrowth,
        accountCreationByHour,
        assessmentActivityByHour,
      },

      peaks: {
        accountCreationHour:
          peakAccountCreationHour,
        assessmentHour:
          peakAssessmentHour,
      },

      recent: {
        users: recentUsers,
        assessments: recentAssessments,
        payments: recentPayments,
      },
    });
  } catch (error) {
    console.error(
      "Admin analytics error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load admin analytics",
      },
      {
        status: 500,
      }
    );
  }
}