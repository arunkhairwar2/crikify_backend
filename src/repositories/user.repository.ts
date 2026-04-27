import prisma from "../config/database.ts";
import type { RegisterSchemaType } from "../schemas/auth.schema.ts";

class UserRepositories {
  async create(userData: RegisterSchemaType) {
    const user = await prisma.user.create({
      data: {
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        dob: userData.dob,
        gender: userData.gender,
      },
    });
    return user;
  }

  //   async findByEmail(email: string) {
  //     const user = await prisma.user.findUnique({
  //       where: { email },
  //     });
  //     return user;
  //   }

  //   async findByPhone(phoneNumber: string) {
  //     const user = await prisma.user.findUnique({
  //       where: { primaryPhoneNumber: phoneNumber },
  //     });
  //     return user;
  //   }

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
