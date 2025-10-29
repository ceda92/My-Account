import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { ReactComponent as AmericanExpressIcon } from "../../assets/icons/americanExpressCard.svg";
import { ReactComponent as DinaCardICon } from "../../assets/icons/dinaCard.svg";
import { ReactComponent as DiscoverIcon } from "../../assets/icons/discoverCard.svg";
import { ReactComponent as MasterCardIcon } from "../../assets/icons/masterCard.svg";
import { ReactComponent as PaymentIcon } from "../../assets/icons/paymentInfo.svg";
import { ReactComponent as VisaCardIcon } from "../../assets/icons/visaCard.svg";
import React from "react";
import { Controller, useWatch } from "react-hook-form";
import { useProfileFormContext } from "./FormContext";
import { CardType } from "../MyAccount/FormSchema";

const creditCards: {
  id: CardType;
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}[] = [
  {
    id: "masterCard",
    name: "Mastercard",
    icon: MasterCardIcon,
  },
  {
    id: "visa",
    name: "Visa",
    icon: VisaCardIcon,
  },
  {
    id: "americanExpress",
    name: "AmericanExpress",
    icon: AmericanExpressIcon,
  },
  {
    id: "dinersClub",
    name: "DinersClub",
    icon: DinaCardICon,
  },
  {
    id: "discover",
    name: "Discover",
    icon: DiscoverIcon,
  },
];
// Card icon component with tooltip
interface CardIconProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  disabled: boolean;
}

const CardIcon: React.FC<CardIconProps> = ({
  Icon,
  name,
  isSelected = false,
  onClick,
  className = "w-10 h-10",
  disabled = false,
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      className={`relative cursor-pointer transition-all duration-200 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${
        isSelected && !disabled
          ? "rounded-lg bg-blue-50 p-2 ring-2 ring-blue-500"
          : !disabled
          ? "rounded-lg p-2 hover:bg-gray-200"
          : "rounded-lg p-2"
      }`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={disabled ? undefined : onClick}
      onKeyDown={
        disabled
          ? undefined
          : (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
      }
    >
      <Icon className={className} />
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white">
          {name}
        </div>
      )}
    </div>
  );
};

function PaymentInformation() {
  const { control } = useProfileFormContext();
  const acceptCreditCards = useWatch({
    control,
    name: "paymentInfo.acceptCreditCards",
  });

  return (
    <div className="mb-4 rounded-lg border-b bg-white shadow-lg">
      <h1 className="flex gap-4 rounded-t-lg bg-lime-green py-2 text-white">
        <PaymentIcon className="ml-4 h-7 w-7" />
        Payment Information
      </h1>
      <div className="m-10 flex justify-center">
        <Label>Do you currently accept credit cards for payment?</Label>
      </div>
      <div className="m-4 flex justify-center">
        <Controller
          name="paymentInfo.acceptCreditCards"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2">
              <Button
                type="button"
                variant={field.value === true ? "default" : "outline"}
                onClick={() => {
                  field.onChange(true);
                }}
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={field.value === false ? "default" : "outline"}
                onClick={() => field.onChange(false)}
              >
                No
              </Button>
            </div>
          )}
        />
      </div>
      <div className="flex justify-center">
        <h2>Which credit card do you accept?*</h2>
      </div>

      <div className="flex justify-center">
        <p className="pl-6 pt-2 text-sm font-semibold text-yellow-300">
          Select one or more offerd cards by clicking on them
        </p>
      </div>
      <Controller
        name="paymentInfo.acceptedCardTypes"
        control={control}
        render={({ field }) => (
          <div className="mb-4 flex flex-wrap justify-center">
            {creditCards.map((cc) => {
              const currentCards: CardType[] = field.value || [];
              const isSelected = currentCards.includes(cc.id);
              const isDisabled = acceptCreditCards === false;

              const toggleCard = () => {
                const updatedCards = isSelected
                  ? currentCards.filter((cardId) => cardId !== cc.id)
                  : [...currentCards, cc.id];
                field.onChange(updatedCards);
              };

              return (
                <CardIcon
                  className="h-20 w-20"
                  Icon={cc.icon}
                  name={cc.name}
                  key={cc.id}
                  isSelected={isSelected}
                  onClick={toggleCard}
                  disabled={isDisabled}             />
              );
            })}
          </div>
        )}
      />
    </div>
  );
}

export default PaymentInformation;
