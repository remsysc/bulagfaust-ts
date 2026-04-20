import prisma from "./prisma";
import bcrypt from "bcrypt";

const migrate = async () => {
  try {
    // Ensure default roles exist
    await prisma.role.upsert({
      where: { name: "ROLE_USER" },
      update: {},
      create: { name: "ROLE_USER" },
    });
    await prisma.role.upsert({
      where: { name: "ROLE_ADMIN" },
      update: {},
      create: { name: "ROLE_ADMIN" },
    });
    console.log("roles seeded");

    // Ensure admin user exists
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
      where: { email: "admin@test.com" },
      update: {},
      create: {
        username: "admin",
        email: "admin@test.com",
        password: hashedPassword,
      },
    });
    console.log("admin user seeded");

    // Assign admin role
    const adminRole = await prisma.role.findUnique({
      where: { name: "ROLE_ADMIN" },
    });
    if (adminRole) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: admin.id,
            roleId: adminRole.id,
          },
        },
        update: {},
        create: {
          userId: admin.id,
          roleId: adminRole.id,
        },
      });
      console.log("Admin role assigned");
    }

    console.log("migration complete");
  } catch (err) {
    console.error("migration failed:", (err as Error).message);
  }
};

migrate();

