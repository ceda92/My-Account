import { z } from "zod";

export const basicInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Email is required"),
  phone: z
    .string()
    .min(12, { message: "Phone number is required" })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Invalid phone number format",
    }),
  website: z
    .string()
    .min(1, { message: "Website is required" })
    .regex(/^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/.*)?$/i, {
      message: "Invalid website format",
    }),
  company: z.string().min(1, "Company name is required"),
  otherBussiness: z.string().min(1, "Other business name is required"),
});

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

export const addressInfoSchema = z.object({
  country: z.string().min(1, "Country required"),
  state: z.string().min(1, "State required"),
  city: z.string().min(1, "City required"),
  zipcode: z.string().min(1, "ZipCode required"),
  address: z.string().min(1, "Address required"),
  useMainAddressAsBilling: z.boolean(),
});

export const billingSchema = z.object({
  country: z.string().min(1, "Country required"),
  city: z.string().min(1, "City required"),
  address: z.string().min(1, "Address required"),
  zipcode: z.string().min(1, "ZipCode required"),
});

export const accountInfoSchema = z.object({
  curency: z.string().min(1, "Currency required"),
  language: z.string().min(1, "Language required"),
});

export const propertyManagmentSchema = z
  .object({
    pmsName: z.string().min(1, "PMS Name required"),
    pmsAccountId: z.string().min(1, "PMS Acoount Id  required"),
    tokeyKey: z.string().optional(),
    tokenSecret: z.string().optional(),
    bookWebAddress: z.string().optional(),
  })
  .refine(
    (data) => {
      const isSiteminderOrTrack = ["siteminder", "track"].some((pms) =>
        data.pmsName.toLowerCase().includes(pms)
      );

      // If PMS is Siteminder or Track, all 3 fields must be nonempty
      if (isSiteminderOrTrack) {
        return (
          data.tokeyKey?.trim() &&
          data.tokenSecret?.trim() &&
          data.bookWebAddress?.trim()
        );
      }
      return true; // other PMS → no requirement
    },
    {
      message:
        "Token Key, Token Secret, and URL are required for Siteminder or Track",
      path: ["tokeyKey"], // you can set path to 'tokeyKey' or leave general
    }
  );

export const contactSchema = z.object({
  contactType: z.string().min(1, "Contact type required"),
});
export type ContactFormData = z.infer<typeof contactSchema>;

export const cardTypes = [
  "masterCard",
  "visa",
  "americanExpress",
  "dinersClub",
  "discover",
] as const;
export type CardType = (typeof cardTypes)[number];
export const paymentInfoSchema = z.object({
  acceptCreditCards: z.boolean().nullable(),
  acceptedCardTypes: z.array(z.enum(cardTypes)),
});

export const formSchema = z
  .object({
    basicInfo: basicInfoSchema,
    addressInfo: addressInfoSchema,
    accountInfo: accountInfoSchema,
    billingAddress: z.union([billingSchema, z.literal(undefined)]),
    propertyManagment: propertyManagmentSchema,
    paymentInfo: paymentInfoSchema,
  })
  .refine(
    (data) => {
      // If not using main address as billing, billing address must be provided
      if (!data.addressInfo.useMainAddressAsBilling) {
        return (
          !!data.billingAddress &&
          !!data.billingAddress.country &&
          !!data.billingAddress.city &&
          !!data.billingAddress.address &&
          !!data.billingAddress.zipcode
        );
      }
      return true;
    },
    {
      message: "Billing address is required when not using main address",
      path: ["billingAddress"],
    }
  );
export type ProfileFormData = z.infer<typeof formSchema>;
