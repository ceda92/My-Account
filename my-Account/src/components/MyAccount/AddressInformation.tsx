import { Checkbox } from "../ui/checkbox";
import FormSelect from "../ui/form-select";
import Input from "../ui/Input";
import { Label } from "../ui/label";
import { ReactComponent as AddressYellow } from "../../assets/icons/addressYellow.svg";
import { ReactComponent as AddressIcon } from "../../assets/icons/adress.svg"
import { ReactComponent as AdressHomeIcon } from "../../assets/icons/adressInfo.svg";
import { ReactComponent as CityIcon } from "../../assets/icons/city.svg";
import { ReactComponent as CityYellow } from "../../assets/icons/cityYellow.svg";
import { ReactComponent as Flag } from "../../assets/icons/flag.svg";
import { ReactComponent as StateIcon } from "../../assets/icons/state.svg";
import { ReactComponent as ZipCodeIcon } from "../../assets/icons/zipCode.svg";
import { ReactComponent as ZipCodeYellow } from "../../assets/icons/zipCodeYellow.svg";
import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useProfileFormContext } from "../MyAccount/FormContext";
import { FormInput } from "../MyAccount/FormIntput";

const AddressInformation: React.FC = () => {
  const {
    register,
    formState: { errors },
    control,
    setValue,
    watch,
    options,
    isLoadingOptions,
  } = useProfileFormContext();

  const useMainAsBilling = useWatch({
    control,
    name: "addressInfo.useMainAddressAsBilling",
  });

  const mainAddressCountry = watch("addressInfo.country");
  const mainAddressCity = watch("addressInfo.city");
  const mainAddressAddress = watch("addressInfo.address");
  const mainAddressZipcode = watch("addressInfo.zipcode");

  // This function will be called when the checkbox value changes
  const handleMainAddressAsBilling = (checked: boolean) => {
    setValue("addressInfo.useMainAddressAsBilling", checked, {
      shouldValidate: true,
    });

    if (checked) {
      // Copy values from main address to billing address
      updateBillingAddress();
    }
  };
  const updateBillingAddress = () => {
    setValue("billingAddress.country", mainAddressCountry);
    setValue("billingAddress.city", mainAddressCity);
    setValue("billingAddress.address", mainAddressAddress);
    setValue("billingAddress.zipcode", mainAddressZipcode);
  };

  useEffect(() => {
    if (useMainAsBilling) {
      updateBillingAddress();
    }
  }, [
    mainAddressCountry,
    mainAddressCity,
    mainAddressAddress,
    mainAddressZipcode,
    useMainAsBilling,
  ]);

  const registerBillingField = (name: string) => {
    const fieldProps = register(`billingAddress.address`);
    return {
      ...fieldProps,
      disabled: useMainAsBilling,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!useMainAsBilling) {
          fieldProps.onChange(e);
        }
      },
    };
  };

  return (
    <>
      <div className="rounded-lg bg-white pb-4 shadow-lg">
        <div className="mb-4 rounded-t-xl bg-dark-blue py-2 shadow-lg">
          <h1 className="flex gap-4 text-white">
            <AdressHomeIcon className="ml-4 h-6 w-6" />
            Address Information 
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className={mainAddressCountry === "US" ? "" : "col-span-2"}>
            <FormSelect
              name="addressInfo.country"
              options={options.countryOptions}
              control={control}
              label="Country *"
              icon={<Flag className="h-6 w-6" />}
              placeholder="Choose Country..."
              loading={isLoadingOptions}
            />
          </div>

          {mainAddressCountry === "US" && (
            <div>
              <FormSelect
                name="addressInfo.state"
                options={options.statesOptions}
                control={control}
                label="State/Province *"
                icon={<StateIcon className="h-6 w-6" />}
                placeholder="Chose State/Province..."
                loading={isLoadingOptions}
              />
            </div>
          )}

          <div>
            <Label htmlFor="city">City *</Label>

            <FormInput
              name="addressInfo.city"
              icon={<CityIcon className="h-6 w-6" />}
              type="text"
              placeholder="Type City..."
            />
          </div>

          <div>
            <Label htmlFor="zipcode">ZipCode *</Label>
            <FormInput
              name="addressInfo.zipcode"
              icon={<ZipCodeIcon className="h-6 w-6" />}
              type="text"
              placeholder="Type ZipCode..."
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="address">Address *</Label>

            <FormInput
              name="addressInfo.address"
              icon={<AddressIcon className="h-6 w-6" />}
              type="text"
              placeholder="Type Address..."
            />

            <Checkbox
              className="m-2 mt-5"
              id="use-main-address"
              checked={useMainAsBilling}
              onCheckedChange={handleMainAddressAsBilling}
            />
            <Label
              htmlFor="use-main-address"
              className="cursor-pointer text-sm font-medium"
            >
              Use may main address as the billing address
            </Label>
          </div>
          <h1 className="mt-1 pb-4 text-left text-xl font-semibold">
            Billing Address
          </h1>
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div>
              <FormSelect
                name="addressInfo.country"
                options={options.countryOptions}
                control={control}
                label="Country *"
                icon={<Flag className="h-6 w-6" />}
                placeholder="Choose Country..."
                loading={isLoadingOptions}
                disabled={useMainAsBilling}
              />
            </div>

            <div>
              <Label htmlFor="city">City *</Label>

              <Input
                id="city"
                {...register("billingAddress.city")}
                icon={<CityYellow className="h-6 w-6" />}
                type="text"
                placeholder="Type City..."
                disabled={useMainAsBilling}
                errorMessage={errors.addressInfo?.city?.message}
              />
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                {...register("billingAddress.address")}
                icon={<AddressYellow className="h-6 w-6" />}
                type="text"
                placeholder="Type Address..."
                disabled={useMainAsBilling}
                errorMessage={errors.addressInfo?.address?.message}
              />
            </div>
            <div>
              <Label htmlFor="zipcode">ZipCode *</Label>
              <Input
                id="zipcode"
                {...register("billingAddress.zipcode")}
                icon={<ZipCodeYellow className="h-6 w-6" />}
                type="text"
                placeholder="Type ZipCode..."
                disabled={useMainAsBilling}
                errorMessage={errors.addressInfo?.zipcode?.message}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressInformation;
