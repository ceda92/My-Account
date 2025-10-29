import FormSelect from "../ui/form-select";
import { ReactComponent as AccountInfoIcon } from "../../assets/icons/accountInfo.svg";
import { ReactComponent as LanguageIcon } from "../../assets/icons/language.svg";
import { BsCurrencyExchange } from "react-icons/bs";
import { useProfileFormContext } from "../MyAccount/FormContext";

export function AccountInformation() {
  const { register, control, options, isLoadingOptions } =
    useProfileFormContext();

  return (
    <>
      <div className="grid grid-cols-1 mt-8 pb-3 bg-white rounded-lg shadow-lg  ">
        <div className="bg-lime-green  rounded-t-lg shadow-lg py-2">
          <h1 className="flex gap-4  text-white ">
            <AccountInfoIcon className="w-6 h-6 ml-4" /> 
            Account Information
          </h1>
        </div>

        <div className="  p-4">
          <FormSelect
            control={control}
            name="accountInfo.curency"
            label="Preferred Currency"
            options={options.currenciesOption}
            placeholder="Choose Currency"
            required
            icon={<BsCurrencyExchange className="w-5 h-5 text-gray-500" />}
            loading={isLoadingOptions}
          />
          <div className="pt-4">
            <FormSelect
              control={control}
              name="accountInfo.language"
              label="Preferred Language"
              options={options.languageOption}
              placeholder="Choose Language"
              required
              icon={<LanguageIcon className="w-5 h-5" />}
              loading={isLoadingOptions}
            />
          </div>
        </div>
      </div>
    </>
  );
}
