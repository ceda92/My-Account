import FormSelect from "../ui/form-select";
import Input from "../ui/Input";
import { Label } from "../ui/label";
import { ReactComponent as PmsAccIcon } from "../../assets/icons/pmsAcc.svg";
import { ReactComponent as PmsNameIcon } from "../../assets/icons/pmsName.svg";
import { ReactComponent as PropertyManIcon } from "../../assets/icons/propertyManagment.svg";
import React from "react";
import { useProfileFormContext } from "./FormContext";

const PropertyManagement: React.FC = () => {
  const { register, control, isLoadingOptions, options, watch } =
    useProfileFormContext();

  const selectedPms = watch("propertyManagment.pmsName");

  const showCredentials =
    selectedPms?.toLowerCase().includes("siteminder") ||
    selectedPms?.toLowerCase().includes("track");

  return (
    <div className="rounded-lg bg-white shadow-lg">
      <h2 className="flex gap-4 rounded-t-lg bg-gradient-to-r from-dark-blue via-dark-blue-600 to-lime-green py-2 text-white">
        <PropertyManIcon className="ml-4 h-6 w-6" />
        Property Management System Information
      </h2>
      <div className="mt-10 p-6">
        <p>PM using Property Managment System</p>
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2">
          <div className="mt-4 justify-start">
            <FormSelect
              control={control}
              name="propertyManagment.pmsName"
              label="PMS Name"
              options={options.pmsOptions}
              placeholder="Select PMS Name"
              icon={<PmsNameIcon className="h-6 w-6" />}
              required
              loading={isLoadingOptions}
              disabled
              key={options.pmsOptions.length}
            />
            {showCredentials && (
              <div>
                <Label>Token Key</Label>
                <Input
                  {...register("propertyManagment.tokeyKey")}
                  disabled
                  readOnly
                  placeholder="Token Key"
                  icon={<PmsNameIcon className="h-6 w-6" />}
                />
              </div>
            )}
          </div>

          <div className="mt-1 justify-end py-2">
            <Label>PMS Account Identifier *</Label>
            <Input
              className="pt-2"
              {...register("propertyManagment.pmsAccountId")}
              placeholder="PMS Account Identifier"
              icon={<PmsAccIcon className="h-6 w-6" />}
            />

            <div className="mt-4">
              {showCredentials && (
                <div>
                  <Label>Token Secret</Label>
                  <Input
                    {...register("propertyManagment.tokenSecret")}
                    placeholder="Token Secret"
                    icon={<PmsAccIcon className="h-6 w-6" />}
                  />
                </div>
              )}
              {showCredentials && (
                <div>
                  <Label>Url</Label>
                  <Input
                    {...register("propertyManagment.bookWebAddress")}
                    placeholder="URL"
                    icon={<PmsNameIcon className="h-6 w-6" />}
                  />
                </div>
              )}
            </div>
          </div>

          {/* <div>
            <Label>Are you a</Label>

            <div className="mt-4 flex gap-4">
              <Button className="w-full">Property Manager</Button>

              <Button className="w-full">Property Owner/Host</Button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PropertyManagement;
