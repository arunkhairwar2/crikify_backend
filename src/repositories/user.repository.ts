import prisma from "../config/database.ts";
import type { RegisterSchemaType } from "../schemas/auth/register.schema.ts";
import type { UserRegisterType } from "../types/auth.types.ts";
import type { UpdateUserDTO } from "../types/user.types.ts";

class UserRepositories {
  async create(userData: UserRegisterType) {
    const user = await prisma.user.create({
      data: {
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        countryCode: userData.countryCode,
        mobile: userData.mobile,
        email: userData.email,

        security: {
          create: {
            passwordHash: userData.password,
            isAdultConfirmed: userData.isAdultConfirmed,
            otp: userData.otp,
            otpExpiry: userData.otpExpiry,
          },
        },
        personal: { create: {} },
        sports: { create: {} },
        professional: { create: {} },
        address: { create: {} },
      },
    });

    return user;
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
      include: {
        security: {
          select: {
            otp: true,
            otpExpiry: true,
            mobileVerified: true,
            passwordHash: true,
          },
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

  // async update(id: string, userData: Partial<RegisterSchemaType>) {
  //   const user = await prisma.user.update({
  //     where: { id },
  //     data: userData,
  //   });
  //   return user;
  // }

  async delete(id: string) {
    const user = await prisma.user.delete({
      where: { id },
    });
    return user;
  }

  async updateMobileVerification(id: string, isMobileVerified: boolean) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        security: {
          update: {
            mobileVerified: isMobileVerified,
          },
        },
      },
    });
    return user;
  }

  async updateOtpAndExpiry(userId: string, otp: string, otpExpiry: Date) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        security: {
          update: {
            otp: otp,
            otpExpiry: otpExpiry,
          },
        },
      },
      // select: {
      //   security: {
      //     select: {
      //       otp: true,
      //       otpExpiry: true,
      //     },
      //   },
      // },
    });
    return user;
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        countryCode: true,
        mobile: true,
        email: true,
        personal: true,
        sports: true,
        professional: true,
        address: true,
      },
    });
    return user;
  }

  async updateProfile(userId: string, profileData: UpdateUserDTO) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: profileData.firstName,
        middleName: profileData.middleName,
        lastName: profileData.lastName,
        personal: {
          update: {
            gender: profileData.personal?.gender,
            dob: profileData.personal?.dob,
            nickname: profileData.personal?.nickname,
            ageGroup: profileData.personal?.ageGroup,
            foodPreference: profileData.personal?.foodPreference,
            profilePicture: profileData.personal?.profilePicture,
          },
        },
        sports: {
          update: {
            jerseySize: profileData.sports?.jerseySize,
            jerseyName: profileData.sports?.jerseyName,
            jerseyNumber: profileData.sports?.jerseyNumber,
            trackPantSize: profileData.sports?.trackPantSize,
            shoeSize: profileData.sports?.shoeSize,
          },
        },
        professional: {
          update: {
            currentDesignation: profileData.professional?.currentDesignation,
            organizationName: profileData.professional?.organizationName,
            orgType: profileData.professional?.orgType,
          },
        },
        address: {
          update: {
            addressLine1: profileData.address?.addressLine1,
            addressLine2: profileData.address?.addressLine2,
            city: profileData.address?.city,
            state: profileData.address?.state,
            country: profileData.address?.country,
            pinCode: profileData.address?.pinCode,
          },
        },
      },
    });
    return user;
  }
}

export default new UserRepositories();
