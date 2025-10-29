import { Label } from "../ui/label";
import { Toggle } from "@radix-ui/react-toggle";
import { ReactComponent as PropertyValidationIcon } from "../../assets/icons/propertyValidationIcoon.svg";

interface PropertyValidationProps {
  pressToggleFee: boolean;
  pressToggleTax: boolean;

  setPressToggleFee: (value: boolean) => void;
  setPressToggleTax: (value: boolean) => void;
  onStateChange: () => void;
}

function PropertyValidation({
  pressToggleFee,
  pressToggleTax,
  setPressToggleFee,
  setPressToggleTax,
  onStateChange,
}: PropertyValidationProps) {
  const handleFeeToggle = (pressed: boolean) => {
    setPressToggleFee(pressed);
    onStateChange();
  };

  const handleTaxToggle = (pressed: boolean) => {
    setPressToggleTax(pressed);
    onStateChange();
  };

  return (
    <div className="h-full w-full rounded-lg bg-white text-lg shadow-lg">
      <h2 className="flex gap-4 rounded-t-lg bg-lime-green py-1 text-white">
        <PropertyValidationIcon className="ml-2 h-6 w-6" />
        Property validation rules
      </h2>

      <div className="ml-2 py-4">
        <Label className="font-semibold text-dark-blue">
          Property validation rules (used for property validation during
          property creation)
        </Label>
      </div>
      <div className="ml-2 flex items-center gap-3 py-1">
        <Toggle
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-lime-green focus:ring-offset-2 ${
            pressToggleFee ? "bg-dark-blue-700" : "bg-gray-200"
          } `}
          pressed={pressToggleFee}
          onPressedChange={handleFeeToggle}
          aria-label="Toggle bold"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-lime-green shadow-lg transition-transform duration-200 ease-in-out ${
              pressToggleFee ? "translate-x-6" : "translate-x-1"
            } `}
          />
        </Toggle>

        <Label className="font-semibold text-[#00385F]">
          {" "}
          At least 1 fee(one by default)
        </Label>
      </div>
      <div className="mb-2 ml-2 flex items-center gap-3 py-1">
        <Toggle
          pressed={pressToggleTax}
          onPressedChange={handleTaxToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-lime-green focus:ring-offset-2 ${
            pressToggleTax ? "bg-dark-blue-700" : "bg-gray-200"
          } `}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-lime-green shadow-lg transition-transform duration-200 ease-in-out ${
              pressToggleTax ? "translate-x-6" : "translate-x-1"
            } `}
          />
        </Toggle>
        <Label className="font-semibold text-dark-blue">
          {" "}
          At least 1 tax(one by default)
        </Label>
      </div>
    </div>
  );
}

export default PropertyValidation;
