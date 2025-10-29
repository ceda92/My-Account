import { US_CODE } from "../CreateProperty/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { getContactTypes, getProfileInfo } from "../services/Account.service";
import PropertyDetailsService from "../services/ProrertyDetails.service";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, useMemo } from "react";
import {
  Control,
  FormProvider,
  FormState,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import toast from "react-hot-toast";
import { parsePhoneNumber } from "react-phone-number-input";
import { CardType, formSchema, ProfileFormData } from "../MyAccount/FormSchema";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



export interface ProfileDataBackendResponse {
  message: string;
  errorMessage: string[];
  code: string;
  data: BackendProfileData[];
  is_error: boolean;
}

interface BackendContactResponse {
  message: string;
  errorMessage: string[];
  code: string;
  data: BackendContactData[];
  is_error: boolean;
}
export interface BackendProfileData {
  profile: {
    name: string;
    companyName: string;
    otherCompanyOperatingName: string;
    phone: string;
    email: string;
    address: {
      city: string;
      state: string;
      streetAddress: string;
      zipCode: string;
      country: string;
      invoiceCity: string;
      invoiceZip: string;
      invoiceAddress: string;
      invoiceCountry: string;
      invoiceCompanyName: string;
      useRegistrationAddress: boolean;
      address: string;
    };

    pmsName: string;
    pmsId: string;
    language: string;
    currency: string;
    webSite: string;
    userType: string;
    tokeyKey: string;
    tokenSecret: string;
    bookWebAddress: string;
  };
  contacts: [
    {
      id: number;
      pmId: string;
      emailAddress: string;
      phone: string;
      version: string;
      type: string;
      name: string;
    }
  ];
  channelSpecificContacts: [
    {
      id: number;
      channelAbbreviation: string;
      emailAddress: string;
      name: string;
    }
  ];
  policies: {
    arrival: string;
    departure: string;
    minCheckInAge: number;
    leadTime: number;
  };
  deposits: {
    type: string;
    splitPayment: {
      depositType: string;
      value: number;
      secondPaymentDays: number;
    };
  };
  validationSettingsList: [
    {
      name: string;
      id: number;
      validate: boolean;
    }
  ];
  creditCards: string[];
  canProcessPayment: boolean;
  partyId: number;
  pmBelongsToSupplierApi: boolean;
  pmsBelongsToSupplierApi: boolean;
}

interface BackendContactData {
  transportAccount: {
    contactTypeEnum: string;
    contactTypeValue: string;
  }[];
}

interface BackendStatesData {
  states: {
    code: string;
    countryCode: string;
    name: string;
  }[];
}

const queryClient = new QueryClient();


const formatPhoneFromBackend = (phoneNumber: string): string => {
  if (!phoneNumber) return "";

  try {
    let phoneWithCode = phoneNumber;

    if (!phoneNumber.startsWith("+")) {
      if (phoneNumber.startsWith("0")) {
        phoneWithCode = `+1${phoneNumber.substring(1)}`;
      } else {
        phoneWithCode = `+1${phoneNumber}`;
      }
    }
    const parsedPhone = parsePhoneNumber(phoneWithCode);

    if (parsedPhone && parsedPhone.isValid()) {
      return parsedPhone.number;
    }
  } catch (error) {
    toast.error("Save Fail");
  }

  return phoneNumber;
};

export const useContactFormData = () => {
  return useQuery({
    queryKey: ["contactsTypes"],
    queryFn: getContactTypes,
    select: transformBackendContactsToFormData,
  });
};

export const transformBackendContactsToFormData = (
  backendResponse: BackendContactResponse
): { contactTypes: { enum: string; value: string }[] } => {
  const { data } = backendResponse;
  const contactData = data[0];
  const { transportAccount } = contactData;

  return {
    contactTypes: transportAccount.map((contact) => ({
      enum: contact?.contactTypeEnum,
      value: contact?.contactTypeValue,
    })),
  };
};

export const useProfileFormData = () => {
  return useQuery({
    queryKey: ["profileFormData"],
    queryFn: getProfileInfo,
    select: transformBackendToFormData,
  });
};

export const transformBackendToFormData = (
  backendResponse: ProfileDataBackendResponse
): ProfileFormData => {
  const { data } = backendResponse;
  const profileData = data[0];
  const { profile } = profileData;

  const backendToFrontendCards: Record<string, string> = {
    MASTER_CARD: "masterCard",
    VISA: "visa",
    AMERICAN_EXPRESS: "americanExpress",
    DINERS_CLUB: "dinersClub",
    DISCOVER: "discover",
  };

  return {
    basicInfo: {
      name: profile?.name,
      email: profile?.email,
      phone: formatPhoneFromBackend(profile.phone),
      website: profile?.webSite,
      company: profile?.otherCompanyOperatingName,
      otherBussiness: profile?.companyName,
    },

    addressInfo: {
      country: profile?.address.country.toUpperCase() ?? "",
      state: profile?.address.state.toUpperCase(),
      city: profile?.address.city,
      zipcode: profile?.address.zipCode,
      address: profile?.address.address,
      useMainAddressAsBilling: profile?.address.useRegistrationAddress,
    },
    accountInfo: {
      curency: profile?.currency,
      language: profile?.language?.toUpperCase(),
    },

    billingAddress: profile?.address?.useRegistrationAddress
      ? undefined
      : {
          country: profile?.address.invoiceCountry,
          city: profile?.address.invoiceCity,
          zipcode: profile?.address.invoiceZip,
          address: profile?.address.invoiceAddress,
        },
    propertyManagment: {
      pmsName: profile?.pmsName,
      pmsAccountId: profile?.pmsId,
      tokeyKey: profile?.tokeyKey,
      tokenSecret: profile?.tokenSecret,
      bookWebAddress: profile?.bookWebAddress,
    },
    paymentInfo: {
      acceptCreditCards: profileData?.canProcessPayment ?? null,
      acceptedCardTypes: (profileData?.creditCards || [])
        .map((card) => backendToFrontendCards[card])
        .filter((card): card is CardType => Boolean(card)),
    },
  };
};

type FormContextType = {
  handleSubmit: (
    onSubmit: SubmitHandler<ProfileFormData>,
    onError?: SubmitErrorHandler<ProfileFormData>
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  formState: FormState<ProfileFormData>;
  register: UseFormRegister<ProfileFormData>;
  reset: UseFormReset<ProfileFormData>;
  control: Control<ProfileFormData>;
  watch: UseFormWatch<ProfileFormData>;
  setValue: UseFormSetValue<ProfileFormData>;
  options: {
    languageOption: { value: string; label: string }[];
    currenciesOption: { value: string; label: string }[];
    countryOptions: { value: string; label: string }[];
    pmsOptions: { value: string; label: string }[];
    statesOptions: { value: string; label: string }[];
  };
  isLoadingOptions: boolean;
};

// Create the context with proper typing
const FormContext = createContext<FormContextType | undefined>(undefined);

// Create custom hook to access the form context
export const useProfileFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error(
      "useFormContext must be used within a ProflieFormContextProvider"
    );
  }
  return context;
};

// Form Provider component
export const ProflieFormContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const defaultValues: ProfileFormData = {
    basicInfo: {
      name: "",
      email: "",
      phone: "",
      website: "",
      company: "",
      otherBussiness: "",
    },
    addressInfo: {
      country: "US_CODE",
      state: "",
      city: "",
      zipcode: "",
      address: "",
      useMainAddressAsBilling: false,
    },
    accountInfo: {
      curency: "",
      language: "",
    },
    billingAddress: {
      country: "",
      city: "",
      address: "",
      zipcode: "",
    },
    propertyManagment: {
      pmsName: "",
      pmsAccountId: "",
      tokeyKey: "",
      tokenSecret: "",
      bookWebAddress: "",
    },
    paymentInfo: {
      acceptCreditCards: null,
      acceptedCardTypes: [],
    },
  };

  const transformBackendStatesToFormData = (backendResponse: any) => {
    const statesArray = Array.isArray(backendResponse)
      ? backendResponse
      : backendResponse?.data;

    return (
      statesArray?.map((state: { code: string; name: string }) => ({
        value: state.code.toUpperCase(),
        label: state.name,
      })) ?? []
    );
  };

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues,
  });

  const { data: initialProfileData, isLoading: isLoadingProfileData } =
    useProfileFormData();

  const {
    data: currencies,
    isLoading: loadingCurrencies,
    error: currencyError,
  } = useQuery({
    queryKey: ["currencies"],
    queryFn: PropertyDetailsService.getCurrencies,
  });

  const {
    data: languages,
    isLoading: loadingLanguage,
    error: languageError,
  } = useQuery({
    queryKey: ["languages"],
    queryFn: PropertyDetailsService.getLanguages,
  });

  const {
    data: countrys,
    isLoading: loadingCountries,
    error: countriesError,
  } = useQuery({
    queryKey: ["countrys"],
    queryFn: PropertyDetailsService.getCountries,
  });

  const {
    data: states,
    isLoading: loadingCountryState,
    error: countryStateError,
  } = useQuery({
    queryKey: ["states"],
    queryFn: () => PropertyDetailsService.getStatesByCountryCode(US_CODE),
    select: transformBackendStatesToFormData,
  });

  const {
    data: pmsList,
    isLoading: loadingPms,
    error: pmsError,
  } = useQuery({
    queryKey: ["pmsList"],
    queryFn: PropertyDetailsService.getPmsList,
  });

  const options = useMemo(
    () => ({
     languageOption: languages?.data ? languages.data.map(lan => ({
  value: lan.language,
  label: lan.languageName,
})) : [],

      currenciesOption:
        currencies?.data ? currencies.data.map(curr => ({ value: curr.currencyCode, label: curr.displayName })) : [],
      countryOptions:
        countrys?.data ? countrys.data.map(c => ({ value: c.code, label: c.name })) : [],
  statesOptions: states ?? [],


      pmsOptions:
        pmsList?.data ? pmsList.data.map(pms => ({ value: pms.id.toString(), label: pms.name })) : [],
}), [languages, currencies, countrys, pmsList, states]);
  

  const isLoadingOptions =
    loadingCurrencies ||
    loadingLanguage ||
    loadingCountries ||
    loadingPms ||
    loadingCountryState;

  const hasReset = React.useRef(false);

  React.useEffect(() => {
    if (!initialProfileData || isLoadingProfileData || isLoadingOptions) return;

    if (!hasReset.current) {
      methods.reset({
        ...initialProfileData,
        addressInfo: {
          ...initialProfileData.addressInfo,
          country: initialProfileData.addressInfo.country || US_CODE,
        },
      });
      hasReset.current = true;
    }
  }, [initialProfileData, isLoadingProfileData, isLoadingOptions, methods]);

  const contextValue = useMemo(
    () => ({
      ...methods,
      options,
      isLoadingOptions,
    }),
    [methods, options, isLoadingOptions]
  );

  return (
    <FormContext.Provider value={contextValue}>
      <FormProvider {...methods}>{children}</FormProvider>
    </FormContext.Provider>
  );
};
