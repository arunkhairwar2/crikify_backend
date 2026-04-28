import {
  AgeGroupEnum,
  FoodPreferenceEnum,
  GenderEnum,
  JerseySizeEnum,
  OrganizationType,
  TrackPantSizeEnum,
} from "./enums.ts";

export type UserBase = {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  countryCode: string;
  mobile: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PersonalDetailsType = {
  gender?: GenderEnum;
  dob?: string;
  nickname?: string;
  ageGroup?: AgeGroupEnum;
  foodPreference?: FoodPreferenceEnum;
  profilePicture?: string;
};

export type ProfessionalDetailsType = {
  currentDesignation?: string;
  organizationName?: string;
  orgType?: OrganizationType;
};

export type SportsPreferencesType = {
  jerseySize?: JerseySizeEnum;
  jerseyName?: string;
  jerseyNumber?: number;
  trackPantSize?: TrackPantSizeEnum;
  shoeSize?: number;
};

export type AddressType = {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
};

export type UserProfile = UserBase & {
  personal?: PersonalDetailsType;
  professional?: ProfessionalDetailsType;
  sports?: SportsPreferencesType;
  address?: AddressType;
};

export type CreateUserDTO = {
  firstName: string;
  lastName: string;
  countryCode: string;
  mobile: string;
  email: string;

  personal?: PersonalDetailsType;
  professional?: ProfessionalDetailsType;
  sports?: SportsPreferencesType;
  address?: AddressType;
};

export type UpdateUserDTO = Partial<{
  firstName: string;
  middleName: string;
  lastName: string;

  personal: Partial<PersonalDetailsType>;
  professional: Partial<ProfessionalDetailsType>;
  sports: Partial<SportsPreferencesType>;
  address: Partial<AddressType>;
}>;
