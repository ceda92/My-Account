/* eslint-disable prefer-destructuring */
import { Button } from "../ui/button";
import {updateAccount } from "../services/Account.service";
import { MutationFunctionContext, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ArrivalPolicies from "./ArrivalPolicies";
import Deposits from "./Deposits";
import PropertyValidation from "./PropertyValidation";
import { useProfileData } from "../MyAccount/Hooks/useProfileData";



interface ProfileData {
  canProcessPayment: boolean;
  partyId: number;
  pmBelongsToSupplierApi: boolean;
  pmsBelongsToSupplierApi: boolean;
  deposits: {
    type: string;
    splitPayment?: {
      depositType: string;
      secondPaymentDays: number;
      value: number;
    };
  };
  policies: {
    arrival: string;
    departure: string;
    minCheckInAge: number;
    leadTime: number;
  };
  validationSettingsList: { id: number; name: string; validate: boolean }[];
}



function Policies() {
  const [policies, setPolicies] = useState({
    startTime: null as dayjs.Dayjs | null,
    endTime: null as dayjs.Dayjs | null,
    pressToggleFee: false,
    pressToggleTax: false,
    minimumAge: '',
    balanceDays: '',
    percentage: '',
    flatFee: '',
    paymentType: '',
    depositType: '',
    leadTime: '',
  });

  const [errors, setErrors] = useState({
    minimumAge: '',
    timeFields: '',
    paymentAmount: '',
    depositType: '',
    balanceDays: '',
    percentage: '',
    leadTime: '',
  });

  const queryClient = useQueryClient();

  const { data: originalProfileData, isLoading, isError } = useProfileData();

  const { mutateAsync: savePoliciesMutation, isPending: isSaving } =
    useMutation({
      mutationFn: updateAccount,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profileInfo'] });
        toast.success('Policies updated successfully!');
        setPolicies(perv => ({ ...perv, hasChanges: false }));
      },
      onError: error => {
        toast.error('Failed to update policies!');
      },
    });

  const parseTimeFromBackend = (timeString: string): dayjs.Dayjs => {
    return dayjs(timeString, 'HH:mm:ss');
  };

  function mapBackendToPolicies(profileData: any) {
    const { policies, deposits, validationSettingsList } = profileData;
    return {
      startTime: policies?.arrival
        ? parseTimeFromBackend(policies.arrival)
        : null,
      endTime: policies?.departure
        ? parseTimeFromBackend(policies.departure)
        : null,

      leadTime: policies?.leadTime?.toString() || '',
      minimumAge: policies?.minCheckInAge?.toString() || '',
      balanceDays: deposits?.splitPayment?.secondPaymentDays?.toString() || '',
      paymentType: deposits?.type === 'SPLIT' ? 'split' : 'full',
      depositType:
        deposits?.splitPayment?.depositType === 'PERCENTAGE'
          ? 'percentage'
          : 'flat',
      percentage:
        deposits?.splitPayment?.depositType === 'PERCENTAGE'
          ? deposits.splitPayment?.value?.toString() || ''
          : '',
      flatFee:
        deposits?.splitPayment?.depositType === 'FLAT'
          ? deposits?.splitPayment?.value.toString() || ''
          : '',
      pressToggleFee:
        validationSettingsList?.find((i: any) => i.name === 'At least 1 fee')
          ?.validate || false,
      pressToggleTax:
        validationSettingsList?.find((i: any) => i.name === 'At least 1 tax')
          ?.validate || false,
    };
  }

  useEffect(() => {
    if (!isLoading && originalProfileData) {
      const mapped = mapBackendToPolicies(originalProfileData);
      setPolicies(mapped);
    }
  }, [isLoading, originalProfileData]);

  const originalPolicies = useMemo(
    () =>
      originalProfileData ? mapBackendToPolicies(originalProfileData) : null,
    [originalProfileData],
  );

  const hasChanges = useMemo(() => {
    if (!originalPolicies) return false;
    return JSON.stringify(policies) !== JSON.stringify(originalPolicies);
  }, [policies, originalPolicies]);

  const formatTimeForBackend = (time: dayjs.Dayjs | null): string => {
    if (!time) {
      throw new Error('Date is required for formatting');
    }
    return time.format('HH:mm:ss');

    // TODO use dayjs
  };

  const handleStateChange = () => {
    setPolicies(perv => ({ ...perv, hasChanges: true }));
  };

  const handleSave = async () => {
    const inputErrors = {
      minimumAge: '',
      timeFields: '',
      paymentAmount: '',
      depositType: '',
      balanceDays: '',
      percentage: '',
      leadTime: '',
    };

    const numericAge = parseFloat(policies.minimumAge);
    if (policies.minimumAge !== '' && numericAge < 18) {
      inputErrors.minimumAge =
        'Please enter a valid minimum age (18 or higher)';
    }
    const numericTime = parseFloat(policies.leadTime);
    if (policies.leadTime !== '' && numericTime < 1) {
      inputErrors.leadTime = 'Time cannot be under one hour';
    }

    if (!policies.balanceDays && policies.paymentType === 'split') {
      inputErrors.balanceDays = 'Please enter days';
    } else if (
      policies.balanceDays !== '' &&
      Number(policies.balanceDays) < 0
    ) {
      inputErrors.balanceDays = 'days cant be lower than 0';
    }

    if (!policies.startTime || !policies.endTime) {
      inputErrors.timeFields = 'Please set both check-in and check-out times';
    }

    if (
      policies.paymentType === 'split' &&
      !policies.percentage &&
      !policies.flatFee
    ) {
      inputErrors.depositType = 'Please set Percentage or Flat Fee';
    }

    if (policies.paymentType === 'split') {
      if (policies.depositType === 'percentage') {
        if (
          !policies.percentage ||
          Number(policies.percentage) <= 0 ||
          Number(policies.percentage) > 100
        ) {
          inputErrors.percentage = 'Please enter a valid percentage (1-100)';
        }
      } else if (policies.depositType === 'flat') {
        if (!policies.flatFee || Number(policies.flatFee) <= 0) {
          inputErrors.paymentAmount = 'Please enter a valid flat fee amount';
        }
      }
    }

    setErrors(inputErrors);
    const hasValidationErrors = Object.values(inputErrors).some(
      error => error !== '',
    );

    if (hasValidationErrors) {
      return;
    }

    const payload = {
      canProcessPayment: originalProfileData?.canProcessPayment,

      partyId: originalProfileData?.partyId,
      pmBelongsToSupplierApi: originalProfileData?.pmBelongsToSupplierApi,
      pmsBelongsToSupplierApi: originalProfileData?.pmsBelongsToSupplierApi,

      deposits: {
        type: policies.paymentType === 'full' ? 'FULL' : 'SPLIT',
        ...(policies.paymentType === 'split' && {
          splitPayment: {
            depositType:
              policies.depositType === 'flat' ? 'FLAT' : 'PERCENTAGE',
            secondPaymentDays: Number(policies.balanceDays),
            value:
              policies.depositType === 'percentage'
                ? Number(policies.percentage)
                : Number(policies.flatFee),
          },
        }),
      },
      policies: {
        arrival: formatTimeForBackend(policies.startTime),
        departure: formatTimeForBackend(policies.endTime),
        minCheckInAge: numericAge || 18,
        leadTime: numericTime,
      },
      validationSettingsList: [
        policies.pressToggleFee && {
          id: originalProfileData?.validationSettingsList.find(
            (item: any) => item.name === 'At least 1 fee',
          )?.id,
          name: 'At least 1 fee',
          validate: policies.pressToggleFee,
        },
        policies.pressToggleTax && {
          id: originalProfileData?.validationSettingsList.find(
            (item: any) => item.name === 'At least 1 tax',
          )?.id,
          name: 'At least 1 tax',
          validate: policies.pressToggleTax,
        },
      ].filter(Boolean),
    };

    savePoliciesMutation(payload);

    setErrors({
      minimumAge: '',
      timeFields: '',
      paymentAmount: '',
      depositType: '',
      balanceDays: '',
      percentage: '',
      leadTime: '',
    });
  };

  const handleReset = () => {
    if (originalPolicies) {
      setPolicies(originalPolicies);
      setErrors({
        minimumAge: '',
        timeFields: '',
        paymentAmount: '',
        depositType: '',
        balanceDays: '',
        percentage: '',
        leadTime: '',
      });
    }
  };

  return (
    <div className="mx-auto grid max-h-[1280px] grid-cols-1 gap-4 min-[1200px]:grid-cols-2">
      <div>
        <ArrivalPolicies
          startTime={policies.startTime}
          endTime={policies.endTime}
          leadTime={policies.leadTime}
          minimumAge={policies.minimumAge}
          setEndTime={val =>
            setPolicies(prev => ({ ...prev, endTime: val, hasChanges: true }))
          }
          setStartTime={val =>
            setPolicies(perv => ({ ...perv, startTime: val, hasChanges: true }))
          }
          setMinimumAge={val =>
            setPolicies(perv => ({
              ...perv,
              minimumAge: val,
              hasChanges: true,
            }))
          }
          setLeadTime={val =>
            setPolicies(prev => ({ ...prev, leadTime: val, hasChanges: true }))
          }
          leadTimeError={errors.leadTime}
          onStateChange={handleStateChange}
          ageError={errors.minimumAge}
          timeError={errors.timeFields}
        />
      </div>

      <div className="row-span-2 grid">
        <Deposits
          paymentType={policies.paymentType}
          setPaymentType={val =>
            setPolicies(perv => ({
              ...perv,
              paymentType: val,
              hasChanges: true,
            }))
          }
          depositType={policies.depositType}
          setDepositType={val =>
            setPolicies(perv => ({
              ...perv,
              depositType: val,
              hasChanges: true,
            }))
          }
          percentage={policies.percentage}
          setPercentage={val =>
            setPolicies(perv => ({
              ...perv,
              percentage: val,
              hasChanges: true,
            }))
          }
          flatFee={policies.flatFee}
          setFlatFee={val =>
            setPolicies(perv => ({ ...perv, flatFee: val, hasChanges: true }))
          }
          balanceDays={policies.balanceDays}
          setBalanceDays={val =>
            setPolicies(perv => ({
              ...perv,
              balanceDays: val,
              hasChanges: true,
            }))
          }
          onStateChange={() =>
            setPolicies(perv => ({ ...perv, hasChanges: true }))
          }
          depositTypeError={errors.depositType}
          paymentAmountError={errors.paymentAmount}
          balanceDaysError={errors.balanceDays}
          paymentPercentageError={errors.percentage}
        />
      </div>

      <div>
        <PropertyValidation
          pressToggleFee={policies.pressToggleFee}
          pressToggleTax={policies.pressToggleTax}
          setPressToggleTax={val =>
            setPolicies(perv => ({
              ...perv,
              pressToggleTax: val,
              hasChanges: true,
            }))
          }
          setPressToggleFee={val =>
            setPolicies(perv => ({
              ...perv,
              pressToggleFee: val,
              hasChanges: true,
            }))
          }
          onStateChange={() =>
            setPolicies(perv => ({ ...perv, hasChanges: true }))
          }
        />
      </div>

      <div className="col-span-full flex w-full justify-between">
        <Button className="w-32 bg-lime-green" onClick={handleReset}>
          Reset
        </Button>

        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="w-32"
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default Policies;

