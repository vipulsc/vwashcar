import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    console.log("🌱 Seeding users...");

    // Hash passwords
    const saltRounds = 12;
    const superAdminPassword = await bcrypt.hash("super123", saltRounds);
    const adminPassword = await bcrypt.hash("admin123", saltRounds);
    const salesmanPassword = await bcrypt.hash("sales123", saltRounds);

    // Create Super Admin user
    const superAdmin = await prisma.user.upsert({
      where: { email: "super@vwashcar.com" },
      update: {},
      create: {
        name: "Super Admin",
        email: "super@vwashcar.com",
        password: superAdminPassword,
        role: "SUPER_ADMIN",
      },
    });

    // Create Admin user
    const admin = await prisma.user.upsert({
      where: { email: "admin@vwashcar.com" },
      update: {},
      create: {
        name: "Admin User",
        email: "admin@vwashcar.com",
        password: adminPassword,
        role: "ADMIN",
      },
    });

    // Create Salesman user
    const salesman = await prisma.user.upsert({
      where: { email: "sales@vwashcar.com" },
      update: {},
      create: {
        name: "Sales User",
        email: "sales@vwashcar.com",
        password: salesmanPassword,
        role: "SALESMAN",
      },
    });

    console.log("✅ Users seeded successfully!");
    console.log("\n📋 Test Accounts:");
    console.log("Super Admin:");
    console.log("  Email: super@vwashcar.com");
    console.log("  Password: super123");
    console.log("\nAdmin:");
    console.log("  Email: admin@vwashcar.com");
    console.log("  Password: admin123");
    console.log("\nSalesman:");
    console.log("  Email: sales@vwashcar.com");
    console.log("  Password: sales123");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();
