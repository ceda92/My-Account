import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { updateAccount } from "../services/Account.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFormState,
} from "react-hook-form";
import toast from "react-hot-toast";
import { AccountInformation } from "./AccountInformation";
import AddressInformation from "./AddressInformation";
import BasicInformation from "./BasicInformation";
import { useProfileFormContext } from "./FormContext";
import { CardType, ProfileFormData } from "../MyAccount/FormSchema";
import PaymentInformation from "./PaymentInformation";
import PropertyManagement from "./PropertyManagement";
import { useProfileData } from "../MyAccount/Hooks/useProfileData";



const ProfileInfo: React.FC = () => {
  const { handleSubmit, reset, control } = useProfileFormContext();
  const { isDirty, isSubmitting, isValid } = useFormState({ control });

  const { data: originalProfileData } = useProfileData();

  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const backendToFrontend: Record<string, CardType> = {
    MASTER_CARD: 'masterCard',
    VISA: 'visa',
    AMERICAN_EXPRESS: 'americanExpress',
    DINERS_CLUB: 'dinersClub',
    DISCOVER: 'discover',
  };

  const frontendToBackend: Record<CardType, string> = {
    masterCard: 'MASTER_CARD',
    visa: 'VISA',
    americanExpress: 'AMERICAN_EXPRESS',
    dinersClub: 'DINERS_CLUB',
    discover: 'DISCOVER',
  };

  const updateAccountMutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      toast.dismiss();
      toast.success('Profile saved successfully');
      queryClient.invalidateQueries({ queryKey: ['profileInfo'] });
    },
    onError: error => {
      toast.dismiss();
      toast.error('Failed to save profile. Please try again.');
    },
  });

  // Handler for form submission with proper typing
  const onSubmit: SubmitHandler<ProfileFormData> = async data => {
    const loadingToastId = toast.loading('Saving your information...');

    try {
      const formattedData = {
        canProcessPayment: data.paymentInfo.acceptCreditCards || false,
        creditCards: data.paymentInfo.acceptCreditCards
          ? data.paymentInfo.acceptedCardTypes.map(cc => frontendToBackend[cc])
          : [],

        partyId: originalProfileData?.partyId,
        pmBelongsToSupplierApi: originalProfileData?.pmBelongsToSupplierApi,
        pmsBelongsToSupplierApi: originalProfileData?.pmsBelongsToSupplierApi,

        profile: {
          name: data.basicInfo.name,
          companyName: data.basicInfo.otherBussiness,
          phone: data.basicInfo.phone,
          email: data.basicInfo.email,
          webSite: data.basicInfo.website,
          otherCompanyOperatingName: data.basicInfo.company,
          address: {
            country: data?.addressInfo?.country,
            state: data.addressInfo.state,
            city: data.addressInfo.city,
            zipCode: data.addressInfo.zipcode,
            address: data.addressInfo.address,
            invoiceCity: data.billingAddress?.city,
            invoiceZip: data.billingAddress?.zipcode,
            invoiceAddress: data.billingAddress?.address,
            invoiceCountry: data.billingAddress?.country,
            invoiceCompanyName: data.basicInfo.name,
            useRegistrationAddress: data.addressInfo.useMainAddressAsBilling,
            streetAddress: data.addressInfo.address,
          },
          pmsName: data?.propertyManagment?.pmsName,
          pmsId: originalProfileData?.profile?.pmsId,
          tokeyKey: data?.propertyManagment?.tokeyKey,
          tokenSecret: data?.propertyManagment?.tokenSecret,
          bookWebAddress: data?.propertyManagment?.bookWebAddress,
          currency: data?.accountInfo?.curency,
          language: data?.accountInfo?.language,
          userType: 'PropertyManager',
        },

        contacts: originalProfileData?.contacts ?? [],
        channelSpecificContacts:
          originalProfileData?.channelSpecificContacts ?? [],
        policies: originalProfileData?.policies ?? {},
        deposits: originalProfileData?.deposits ?? {},
        validationSettingsList:
          originalProfileData?.validationSettingsList ?? [],
      };

      await updateAccountMutation.mutateAsync(formattedData);
      queryClient.invalidateQueries({ queryKey: ['profileInfo'] });
      reset(data, { keepDirty: false });
      toast.dismiss(loadingToastId);
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error('Failed to save profile. Please try again.');
    }
  };

  const isSaveDisabled = isSaving || !isDirty || !isValid;

  // Handler for invalid form submission with proper typing
  const handleInvalidSubmit: SubmitErrorHandler<ProfileFormData> = errors => {
    toast.error('Please fix the errors in the form before submitting.');
  };

  // Handler for form reset
  const handleReset = () => {
    // Reset the form to default values
    reset(
      {
        basicInfo: {
          name: originalProfileData?.profile.name ?? '',
          email: originalProfileData?.profile.email ?? '',
          website: originalProfileData?.profile.webSite ?? '',
          company: originalProfileData?.profile.companyName ?? '',
          otherBussiness:
            originalProfileData?.profile.otherCompanyOperatingName ?? '',
          phone: originalProfileData?.profile.phone ?? '',
        },
        addressInfo: {
          country: originalProfileData?.profile.address.country ?? '',
          state: originalProfileData?.profile.address.state ?? '',
          city: originalProfileData?.profile.address.city ?? '',
          zipcode: originalProfileData?.profile.address.zipCode ?? '',
          address: originalProfileData?.profile.address.address ?? '',
          useMainAddressAsBilling:
            originalProfileData?.profile.address.useRegistrationAddress ??
            false,
        },
        accountInfo: {
          curency: originalProfileData?.profile.currency ?? '',
          language: originalProfileData?.profile.language.toUpperCase() ?? '',
        },
        billingAddress: {
          country: originalProfileData?.profile.address.invoiceCountry ?? '',
          city: originalProfileData?.profile.address.invoiceCity ?? '',
          address: originalProfileData?.profile.address.invoiceAddress ?? '',
          zipcode: originalProfileData?.profile.address.invoiceZip ?? '',
        },
        paymentInfo: {
          acceptCreditCards: originalProfileData?.canProcessPayment ?? null,
          acceptedCardTypes: (originalProfileData?.creditCards || [])
            .map(cc => backendToFrontend[cc])
            .filter(Boolean),
        },
        propertyManagment: {
          pmsName: originalProfileData?.profile?.pmsName ?? '',
        },
      },
      { keepDirty: false },
    );
    toast.success('Form has been reset successfully');
  };

  return (
    <div className="mx-auto w-full">
      <form
        onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)}
        data-test="my-form"
        className="bg-gray-100"
      >
        <div className="mx-auto grid h-fit max-w-[1280px] grid-cols-1 px-4 py-8 min-[940px]:grid-cols-2">
          <div className="m-4">
            <BasicInformation />
            <div className="mt-4">
              <AccountInformation />
            </div>
          </div>
          <div className="m-4">
            <AddressInformation />
          </div>
          <div className="col-span-1 m-4 min-[940px]:col-span-2">
            <PropertyManagement />
          </div>
          <div className="col-span-1 m-4 min-[940px]:col-span-2">
            <PaymentInformation />
          </div>
        </div>

        {/* Buttons only in profile tab */}
        <div className="mx-auto flex max-w-[1280px] justify-between bg-gray-100 px-4 pb-8 min-[940px]:col-span-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" className="w-32 bg-lime-green">
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will reset all fields in
                  the form.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>
                  Reset Form
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button className="w-32" disabled={isSaveDisabled} type="submit">
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;
