import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { prisma } from "../config/database.js";

const router = Router();

// ─── Get Analytics Dashboard Data ───────────────────────────────────────────

router.get("/", authenticate, async (req, res, next) => {
  try {
    const userId = req.userId!;
    const userRole = req.userRole!;

    // Get all cases based on user role
    let casesWhere: any = {};
    if (userRole === "COMPLAINANT") {
      casesWhere = { complainantUserId: userId };
    } else if (userRole === "RESPONDENT") {
      casesWhere = { respondentUserId: userId };
    }
    // Committee/Admin can see all cases (no filter)

    const [totalCases, resolvedCases, allCases, hearingsCount] = await Promise.all([
      // Total cases
      prisma.case.count({ where: casesWhere }),
      
      // Resolved/Closed cases
      prisma.case.count({ 
        where: { 
          ...casesWhere,
          status: { in: ["CLOSED", "WITHDRAWN"] }
        }
      }),
      
      // All cases for detailed stats
      prisma.case.findMany({
        where: casesWhere,
        include: {
          hearings: { select: { id: true, panelChairId: true, panelMemberIds: true } },
          decision: { select: { outcome: true } },
        },
      }),
      
      // Total hearings conducted
      prisma.hearing.count({
        where: userRole === "COMPLAINANT" || userRole === "RESPONDENT"
          ? { case: casesWhere }
          : {},
      }),
    ]);

    // Calculate resolution rate
    const resolutionRate = totalCases > 0 
      ? Math.round((resolvedCases / totalCases) * 100) 
      : 0;

    // Calculate average resolution time (in days) - simplified
    const closedCases = allCases.filter(c => c.status === "CLOSED" || c.status === "WITHDRAWN");
    const avgResolutionTime = closedCases.length > 0
      ? Math.round(
          closedCases.reduce((sum, c) => {
            // Use incidentDate as proxy for case creation, or 30 days default
            const created = c.incidentDate ? new Date(c.incidentDate).getTime() : Date.now() - 30 * 24 * 60 * 60 * 1000;
            const closed = c.closedAt ? new Date(c.closedAt).getTime() : Date.now();
            return sum + (closed - created) / (1000 * 60 * 60 * 24);
          }, 0) / closedCases.length
        )
      : 0;

    // Monthly stats (last 6 months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthCases = allCases.filter(c => {
        // Use incidentDate or updatedAt as proxy
        const dateToUse = c.incidentDate || c.updatedAt;
        const cDate = new Date(dateToUse || Date.now());
        return cDate.getMonth() === d.getMonth() && cDate.getFullYear() === d.getFullYear();
      });
      const monthResolved = monthCases.filter(c => c.status === "CLOSED" || c.status === "WITHDRAWN");
      const monthHearings = monthCases.reduce((sum, c) => sum + c.hearings.length, 0);
      
      monthlyStats.push({
        month: months[d.getMonth()],
        cases: monthCases.length,
        resolved: monthResolved.length,
        hearings: monthHearings,
      });
    }

    // Outcome distribution
    const outcomes: Record<string, number> = {};
    allCases.forEach(c => {
      const outcome = c.decision?.outcome || c.status || "Pending";
      outcomes[outcome] = (outcomes[outcome] || 0) + 1;
    });
    const outcomeColors: Record<string, string> = {
      "LIABLE": "bg-red-500",
      "NOT_LIABLE": "bg-gray-500",
      "WARNED": "bg-amber-500",
      "SUSPENDED": "bg-orange-500",
      "EXPELLED": "bg-red-600",
      "TERMINATED": "bg-red-700",
      "WITHDRAWN": "bg-blue-500",
      "RESOLVED": "bg-green-500",
      "CLOSED": "bg-green-500",
      "Pending": "bg-gray-400",
    };
    const outcomeDistribution = Object.entries(outcomes).map(([outcome, count]) => ({
      outcome: outcome.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      count,
      percentage: Math.round((count / totalCases) * 100),
      color: outcomeColors[outcome] || "bg-gray-500",
    }));

    // Case types (based on stage)
    const stageCounts: Record<string, number> = {};
    allCases.forEach(c => {
      stageCounts[c.stage] = (stageCounts[c.stage] || 0) + 1;
    });
    const caseTypes = Object.entries(stageCounts).map(([type, count]) => ({
      type: type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      count,
      trend: "neutral" as string,
    }));

    // Member performance (committee only)
    let memberPerformance: any[] = [];
    if (userRole !== "COMPLAINANT" && userRole !== "RESPONDENT") {
      const committeeMembers = await prisma.user.findMany({
        where: {
          systemRole: { in: ["COMMITTEE_MEMBER", "COMMITTEE_CHAIR", "INVESTIGATOR"] },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      });
      
      memberPerformance = committeeMembers.map(m => {
        const memberCases = allCases.filter(c => 
          c.assignedInvestigatorId === m.id || 
          c.hearings.some(h => h.panelChairId === m.id || h.panelMemberIds.includes(m.id))
        );
        const memberHearings = allCases.reduce((sum, c) => 
          sum + c.hearings.filter(h => 
            h.panelChairId === m.id || h.panelMemberIds.includes(m.id)
          ).length, 0
        );
        
        return {
          name: `${m.firstName[0]}. ${m.lastName}`,
          cases: memberCases.length,
          hearings: memberHearings,
          avgDays: memberCases.length > 0
            ? Math.round(memberCases.reduce((sum, c) => {
                const days = c.incidentDate 
                  ? (Date.now() - new Date(c.incidentDate).getTime()) / (1000 * 60 * 60 * 24)
                  : 30;
                return sum + days;
              }, 0) / memberCases.length)
            : 0,
        };
      }).slice(0, 5);
    }

    res.json({
      data: {
        totalCases,
        resolutionRate,
        avgResolutionTime,
        hearingsConducted: hearingsCount,
        monthlyStats,
        outcomeDistribution,
        caseTypes,
        memberPerformance,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
