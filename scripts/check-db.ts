import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("🔍 Checking database connection...");

    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful");

    // Check if users table exists and has data
    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}`);

    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      console.log("\n👥 Users in database:");
      users.forEach((user, index) => {
        console.log(
          `${index + 1}. ${user.name} (${user.email}) - ${user.role}`
        );
      });
    } else {
      console.log("❌ No users found in database");
    }
  } catch (error) {
    console.error("❌ Database check failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
