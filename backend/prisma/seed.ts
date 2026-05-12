import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPin(pin: string) {
  return bcrypt.hash(pin, 12);
}

async function main() {
  console.log("🌱 Seeding SafeSpace UG database...\n");

  // ─────────────────────────────────────────────────────────────────────────────
  // 5 ADMIN / COMMITTEE-ASSIGNABLE STAFF
  // These are staff you can assign as committee members, chair, investigators.
  // Login: email + 5-digit passcode
  // ─────────────────────────────────────────────────────────────────────────────

  const admins = [
    {
      firstName: "Ama",
      lastName: "Mensah",
      email: "ama.mensah@ug.edu.gh",
      passcode: "29471",
      systemRole: "ADMIN" as const,
      affiliation: "FACULTY" as const,
      department: "Gender Studies",
      staffId: "GS-2018-001",
    },
    {
      firstName: "Kofi",
      lastName: "Asante",
      email: "kofi.asante@ug.edu.gh",
      passcode: "38512",
      systemRole: "ADMIN" as const,
      affiliation: "ADMINISTRATIVE_STAFF" as const,
      department: "Registrar Office",
      staffId: "RO-2016-044",
    },
    {
      firstName: "Abena",
      lastName: "Owusu",
      email: "abena.owusu@ug.edu.gh",
      passcode: "46803",
      systemRole: "ADMIN" as const,
      affiliation: "FACULTY" as const,
      department: "Law Faculty",
      staffId: "LF-2019-012",
    },
    {
      firstName: "Kwame",
      lastName: "Boateng",
      email: "kwame.boateng@ug.edu.gh",
      passcode: "57294",
      systemRole: "ADMIN" as const,
      affiliation: "FACULTY" as const,
      department: "Psychology",
      staffId: "PS-2017-008",
    },
    {
      firstName: "Adjoa",
      lastName: "Darko",
      email: "adjoa.darko@ug.edu.gh",
      passcode: "61837",
      systemRole: "ADMIN" as const,
      affiliation: "ADMINISTRATIVE_STAFF" as const,
      department: "Student Affairs",
      staffId: "SA-2020-003",
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // 3 STUDENTS (for testing complaint submission, respondent response, etc.)
  // Email format: firstname.lastname@st.ug.edu.gh
  // ─────────────────────────────────────────────────────────────────────────────

  const students = [
    {
      firstName: "Esi",
      lastName: "Quartey",
      email: "esi.quartey@st.ug.edu.gh",
      passcode: "12345",
      systemRole: "COMPLAINANT" as const,
      affiliation: "UNDERGRADUATE" as const,
      department: "Political Science",
      studentId: "10945023",
    },
    {
      firstName: "Yaw",
      lastName: "Mensah",
      email: "yaw.mensah@st.ug.edu.gh",
      passcode: "23456",
      systemRole: "COMPLAINANT" as const,
      affiliation: "UNDERGRADUATE" as const,
      department: "Computer Science",
      studentId: "10832041",
    },
    {
      firstName: "Akosua",
      lastName: "Frimpong",
      email: "akosua.frimpong@st.ug.edu.gh",
      passcode: "34567",
      systemRole: "COMPLAINANT" as const,
      affiliation: "POSTGRADUATE" as const,
      department: "Sociology",
      studentId: "11203387",
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // 4 RANDOM GENERAL USERS (mixed roles — staff, faculty, etc.)
  // Use these for ad-hoc testing (witnesses, respondents, representatives)
  // ─────────────────────────────────────────────────────────────────────────────

  const randomUsers = [
    {
      firstName: "Daniel",
      lastName: "Agyei",
      email: "daniel.agyei@ug.edu.gh",
      passcode: "78901",
      systemRole: "RESPONDENT" as const,
      affiliation: "FACULTY" as const,
      department: "Political Science",
      staffId: "PS-2019-044",
    },
    {
      firstName: "Felicia",
      lastName: "Nkrumah",
      email: "felicia.nkrumah@ug.edu.gh",
      passcode: "89012",
      systemRole: "COMPLAINANT" as const,
      affiliation: "TECHNICAL_STAFF" as const,
      department: "Engineering",
      staffId: "EN-2021-017",
    },
    {
      firstName: "Samuel",
      lastName: "Tetteh",
      email: "samuel.tetteh@st.ug.edu.gh",
      passcode: "90123",
      systemRole: "COMPLAINANT" as const,
      affiliation: "UNDERGRADUATE" as const,
      department: "Business Administration",
      studentId: "10678234",
    },
    {
      firstName: "Gifty",
      lastName: "Amoah",
      email: "gifty.amoah@ug.edu.gh",
      passcode: "45678",
      systemRole: "COMPLAINANT" as const,
      affiliation: "ADMINISTRATIVE_STAFF" as const,
      department: "Finance Office",
      staffId: "FO-2020-009",
    },
  ];

  // ─── Seed all users ────────────────────────────────────────────────────────

  console.log("┌─────────────────────────────────────────────────────────────────┐");
  console.log("│  ADMIN / COMMITTEE-ASSIGNABLE STAFF (5)                         │");
  console.log("├──────────────────────┬────────────────────────────┬─────────────┤");
  console.log("│  Name                │  Email                     │  Passcode   │");
  console.log("├──────────────────────┼────────────────────────────┼─────────────┤");

  for (const user of admins) {
    const passwordHash = await hashPin(user.passcode);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { passwordHash },
      create: {
        email: user.email,
        passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        systemRole: user.systemRole,
        affiliation: user.affiliation,
        department: user.department,
        staffId: user.staffId,
      },
    });
    const name = `${user.firstName} ${user.lastName}`.padEnd(18);
    const email = user.email.padEnd(26);
    console.log(`│  ${name}│  ${email}│  ${user.passcode}      │`);
  }

  console.log("├──────────────────────┴────────────────────────────┴─────────────┤");
  console.log("│  STUDENTS (3)                                                   │");
  console.log("├──────────────────────┬────────────────────────────┬─────────────┤");
  console.log("│  Name                │  Email                     │  Passcode   │");
  console.log("├──────────────────────┼────────────────────────────┼─────────────┤");

  for (const user of students) {
    const passwordHash = await hashPin(user.passcode);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { passwordHash },
      create: {
        email: user.email,
        passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        systemRole: user.systemRole,
        affiliation: user.affiliation,
        department: user.department,
        studentId: user.studentId,
      },
    });
    const name = `${user.firstName} ${user.lastName}`.padEnd(18);
    const email = user.email.padEnd(26);
    console.log(`│  ${name}│  ${email}│  ${user.passcode}      │`);
  }

  console.log("├──────────────────────┴────────────────────────────┴─────────────┤");
  console.log("│  GENERAL TEST USERS (4)                                         │");
  console.log("├──────────────────────┬────────────────────────────┬─────────────┤");
  console.log("│  Name                │  Email                     │  Passcode   │");
  console.log("├──────────────────────┼────────────────────────────┼─────────────┤");

  for (const user of randomUsers) {
    const passwordHash = await hashPin(user.passcode);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { passwordHash },
      create: {
        email: user.email,
        passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        systemRole: user.systemRole,
        affiliation: user.affiliation,
        department: user.department,
        staffId: user.staffId,
        studentId: user.studentId,
      },
    });
    const name = `${user.firstName} ${user.lastName}`.padEnd(18);
    const email = user.email.padEnd(26);
    console.log(`│  ${name}│  ${email}│  ${user.passcode}      │`);
  }

  console.log("└──────────────────────┴────────────────────────────┴─────────────┘");
  console.log("");
  console.log("✅ All 12 users seeded successfully.");
  console.log("   Passcodes are 5-digit PINs used as passwords.");
  console.log("   Admins can be assigned as committee members via the dashboard.");
  console.log("");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
