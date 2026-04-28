import prisma from "../config/database.ts";
import type { RegisterSchemaType } from "../schemas/auth.schema.ts";

class UserRepositories {
  async create(userData: RegisterSchemaType) {
    const user = await prisma.user.create({
      data: {
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        countryCode: userData.countryCode,
        mobile: userData.mobile,
        email: userData.email,
        passwordHash: userData.password,
      },
    });

    const personalDetails = await prisma.personalDetails.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        isAdultConfirmed: userData.isAdultConfirmed,
        // gender: userData.gender,
        // dob: userData.dob.toISOString(),
      },
    });
    return { user, personalDetails };
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findByMobile(countryCode: string, mobile: string) {
    const user = await prisma.user.findUnique({
      where: {
        mobile_unique: {
          mobile: mobile,
          countryCode: countryCode,
        },
      },
    });
    return user;
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async update(id: string, userData: Partial<RegisterSchemaType>) {
    const user = await prisma.user.update({
      where: { id },
      data: userData,
    });
    return user;
  }

  async delete(id: string) {
    const user = await prisma.user.delete({
      where: { id },
    });
    return user;
  }
}

export default new UserRepositories();
