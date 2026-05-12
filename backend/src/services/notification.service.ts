import { prisma } from "../config/database.js";
import { logger } from "../config/logger.js";
import { env } from "../config/env.js";

// ─── Notification Creation ───────────────────────────────────────────────────

interface CreateNotificationParams {
  recipientUserId: string;
  caseId?: string;
  caseReference?: string;
  type: string;
  title: string;
  body: string;
  actionUrl?: string;
  actionLabel?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  const notification = await prisma.notification.create({
    data: {
      recipientUserId: params.recipientUserId,
      caseId: params.caseId,
      caseReference: params.caseReference,
      type: params.type as any,
      title: params.title,
      body: params.body,
      actionUrl: params.actionUrl,
      actionLabel: params.actionLabel,
    },
  });

  // TODO: Push via WebSocket/SSE for real-time delivery
  // TODO: Queue email notification if user preferences allow

  logger.debug(
    { notificationId: notification.id, recipient: params.recipientUserId, type: params.type },
    "Notification created"
  );

  return notification;
}

// ─── Batch Notifications ─────────────────────────────────────────────────────

export async function createBatchNotifications(
  recipients: string[],
  params: Omit<CreateNotificationParams, "recipientUserId">
) {
  const notifications = await prisma.notification.createMany({
    data: recipients.map((recipientUserId) => ({
      recipientUserId,
      caseId: params.caseId,
      caseReference: params.caseReference,
      type: params.type as any,
      title: params.title,
      body: params.body,
      actionUrl: params.actionUrl,
      actionLabel: params.actionLabel,
    })),
  });

  logger.info(
    { count: notifications.count, type: params.type },
    "Batch notifications created"
  );

  return notifications;
}

// ─── User Notifications ──────────────────────────────────────────────────────

export async function getUserNotifications(
  userId: string,
  filters: { unreadOnly?: boolean; page?: number; pageSize?: number }
) {
  const page = filters.page || 1;
  const pageSize = Math.min(filters.pageSize || 20, 100);
  const skip = (page - 1) * pageSize;

  const where: any = { recipientUserId: userId };
  if (filters.unreadOnly) where.isRead = false;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.notification.count({ where }),
  ]);

  return {
    data: notifications,
    meta: { total, page, pageSize, hasMore: skip + pageSize < total },
  };
}

// ─── Mark Read ───────────────────────────────────────────────────────────────

export async function markNotificationRead(notificationId: string, userId: string) {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, recipientUserId: userId },
  });

  if (!notification) return null;

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function markAllNotificationsRead(userId: string) {
  const result = await prisma.notification.updateMany({
    where: { recipientUserId: userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

  return { count: result.count };
}

// ─── Formal Notice Service ───────────────────────────────────────────────────

interface CreateFormalNoticeParams {
  caseId: string;
  noticeType: string;
  recipientUserIds: string[];
  subject: string;
  body: string;
  issuedBy: string;
  deliveryMethod?: string;
}

export async function createFormalNotice(params: CreateFormalNoticeParams) {
  const notice = await prisma.formalNotice.create({
    data: {
      caseId: params.caseId,
      noticeType: params.noticeType as any,
      recipientUserIds: params.recipientUserIds,
      subject: params.subject,
      body: params.body,
      issuedBy: params.issuedBy,
      deliveryMethod: (params.deliveryMethod as any) || "IN_PLATFORM",
    },
  });

  // Also create in-app notifications for each recipient
  for (const recipientId of params.recipientUserIds) {
    await createNotification({
      recipientUserId: recipientId,
      caseId: params.caseId,
      type: "GENERAL",
      title: `Formal Notice: ${params.subject}`,
      body: params.body.substring(0, 200) + (params.body.length > 200 ? "..." : ""),
      actionUrl: `/communications/${notice.id}`,
      actionLabel: "View Notice",
    });
  }

  // TODO: Queue email delivery for formal notices
  logger.info(
    { noticeId: notice.id, type: params.noticeType, recipients: params.recipientUserIds.length },
    "Formal notice created"
  );

  return notice;
}

export async function getCaseFormalNotices(caseId: string) {
  return prisma.formalNotice.findMany({
    where: { caseId },
    orderBy: { issuedAt: "desc" },
  });
}

export async function acknowledgeFormalNotice(noticeId: string, userId: string) {
  return prisma.formalNotice.update({
    where: { id: noticeId },
    data: { acknowledgedAt: new Date(), acknowledgedBy: userId },
  });
}

// ─── Email Service (abstraction) ─────────────────────────────────────────────

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  try {
    // In production, use nodemailer or a transactional email provider
    // For development, we just log (MailHog captures on port 1025)
    logger.info(
      { to: params.to, subject: params.subject },
      "Email queued for delivery"
    );

    // TODO: Implement with nodemailer transport
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ from: env.SMTP_FROM, ...params });

    return true;
  } catch (err) {
    logger.error({ err, to: params.to }, "Failed to send email");
    return false;
  }
}
