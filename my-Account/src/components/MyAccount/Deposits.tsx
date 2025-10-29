import { Button } from "../ui/button";
import Input from "../ui/Input";
import { Label } from "../ui/label";
import { ReactComponent as DepositIcon } from "../../assets/icons/deposits.svg";
import { ReactComponent as DollarIcon } from "../../assets/icons/dollar.svg";
import { ReactComponent as PercentageIcon } from "../../assets/icons/percentage.svg";
import React from "react";
import FullPaymentPolicies from "./FullPaymentPolicies";

interface DepositProps {
  paymentType: string;
  depositType: string;
  percentage: string;
  flatFee: string;
  balanceDays: string;

  setPaymentType: (value: string) => void;
  setDepositType: (value: string) => void;
  setPercentage: (value: string) => void;
  setFlatFee: (value: string) => void;
  setBalanceDays: (value: string) => void;

  onStateChange: () => void;

  depositTypeError: string;
  paymentAmountError: string;
  balanceDaysError: string;
  paymentPercentageError: string;
}

function Deposits({
  paymentType,
  depositType,
  percentage,
  flatFee,
  balanceDays,
  setPaymentType,
  setDepositType,
  setPercentage,
  setFlatFee,
  setBalanceDays,
  onStateChange,
  depositTypeError,
  paymentAmountError,
  balanceDaysError,
  paymentPercentageError,
}: DepositProps) {
  const handleSplitPayment = () => {
    setPaymentType("split");
    onStateChange();
  };

  const handleFullPayment = () => {
    setPaymentType("full");
    onStateChange();
  };

  const handleDepositPercentage = () => {
    setDepositType("percentage");
    onStateChange();
  };

  const handleDepositFlat = () => {
    setDepositType("flat");
    onStateChange();
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPercentage(value);
    onStateChange();
  };

  const handleFlatFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFlatFee(value);
    onStateChange();
  };

  const handleBalanceDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBalanceDays(value);
    onStateChange();
  };

  return (
    <>
      <div className="h-full rounded-lg bg-white text-lg shadow-lg">
        <h2 className="flex gap-4 rounded-t-lg bg-dark-blue py-1 text-white">
          <DepositIcon className="ml-2 h-6 w-6" />
          Deposits *
        </h2>

        <div>
          <div className="mb-4 ml-2 mt-4">
            <Label className="font-semibold text-dark-blue">
              Would you like to receive full or partial payment at time of
              booking?
            </Label>
          </div>
          <div className="m-2 mb-4 flex flex-auto gap-2">
            <Button
              onClick={handleSplitPayment}
              className={`flex-auto ${
                paymentType === "split"
                  ? "bg-dark-blue"
                  : "bg-gray-400 text-white"
              }`}
            >
              Split Payment
            </Button>
            <Button
              onClick={handleFullPayment}
              className={`flex-auto ${
                paymentType === "full"
                  ? "bg-dark-blue"
                  : "bg-gray-400 text-white"
              }`}
            >
              Full Payment
            </Button>
          </div>

          {paymentType === "split" && (
            <>
              <div className="m-2 mb-4">
                <Label className="font-semibold text-dark-blue">
                  Guest makes first payment at the time of booking and the
                  remainder as defined by you below.
                </Label>
                <div>
                  <Label className="font-semibold text-dark-blue">
                    Select how you would like to calculate deposit amounts
                  </Label>
                </div>
                <div className="mt-4 flex flex-auto gap-2">
                  <Button
                    onClick={handleDepositPercentage}
                    className={`flex-auto ${
                      depositType === "percentage"
                        ? "dark-blue"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    Percentage
                  </Button>
                  <Button
                    onClick={handleDepositFlat}
                    className={`flex-auto ${
                      depositType === "flat"
                        ? "bg-dark-blue"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    Flat fee
                  </Button>
                </div>
                {depositTypeError && (
                  <p className="ml-2 mt-2 flex items-center gap-1 text-sm text-red-500">
                    {depositTypeError}
                  </p>
                )}
              </div>
              <div>
                <Label className="m-2 font-semibold text-[#00385F]">
                  The deposit is percentage of the total booking cost
                </Label>
              </div>
              <div className="m-2 mb-1 flex items-center gap-4">
                <Label className="font-semibold text-dark-blue">
                  First payment of
                </Label>
                {depositType === "percentage" && (
                  <div className="flex">
                    <Input
                      type="number"
                      value={percentage}
                      onChange={handlePercentageChange}
                      icon={
                        <PercentageIcon className="h-[1.375rem] w-[1.375rem]" />
                      }
                      iconPosition="right"
                    />
                    {paymentPercentageError && (
                      <p className="ml-2 mt-1 text-sm text-red-500">
                        {paymentPercentageError}
                      </p>
                    )}
                  </div>
                )}
                {depositType === "flat" && (
                  <div className="flex">
                    <Input
                      type="number"
                      icon={
                        <DollarIcon className="h-[1.375rem] w-[1.375rem]" />
                      }
                      iconPosition="right"
                      value={flatFee}
                      onChange={handleFlatFeeChange}
                    />

                    {paymentAmountError && (
                      <p className="ml-2 mt-1 text-sm text-red-500">
                        {paymentAmountError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="m-2 mb-1 flex items-center gap-4 py-2">
                <Label className="mb-1 font-semibold text-dark-blue">
                  Balance due
                </Label>

                {depositType === "flat" && (
                  <div className="ml-7 flex">
                    <Input
                      className="h-12 w-[200px]"
                      placeholder="Enter Days"
                      value={balanceDays}
                      type="number"
                      onChange={handleBalanceDaysChange}
                    />
                    {balanceDaysError && (
                      <p className="ml-2 mt-1 text-sm text-red-500">
                        {balanceDaysError}
                      </p>
                    )}
                  </div>
                )}
                {depositType === "percentage" && (
                  <div className="ml-7 flex">
                    <Input
                      placeholder="Enter Days"
                      value={balanceDays}
                      type="number"
                      onChange={handleBalanceDaysChange}
                    />

                    {balanceDaysError && (
                      <p className="ml-2 mt-1 text-sm text-red-500">
                        {balanceDaysError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
          {paymentType === "full" && (
            <>
              <div className="m-2 flex py-2">
                <FullPaymentPolicies />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Deposits;
