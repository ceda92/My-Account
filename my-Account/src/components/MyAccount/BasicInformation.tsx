import Input from "../ui/Input";
import { Label } from "../ui/label";
import { ReactComponent as BussinessIcon } from "../../assets/icons/bussinesLogo.svg";
import { ReactComponent as BussinessIconYellow } from "../../assets/icons/BussinessIconYellow.svg";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-square.svg";
import { ReactComponent as MailIcon } from "../../assets/icons/mail.svg";
import { ReactComponent as UrlIcon } from "../../assets/icons/url.svg";
import { ReactComponent as UserIcon } from "../../assets/icons/user.svg";
import { useProfileFormContext } from "./FormContext";
import { FormPhoneInput } from "./FormPhoneInput";
import { FormInput } from "../MyAccount/FormIntput";

const BasicInformation: React.FC = () => {
  const {
    register,
    formState: { errors },
    control,
  } = useProfileFormContext();

  return (
    <>
      <div className="rounded-t-xl bg-lime-green shadow-lg">
        <h1 className="flex gap-4 py-2 text-white">
          <InfoIcon className="ml-4 h-6 w-6" /> 
          Basic information
        </h1>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 rounded-b-lg bg-white p-4 py-8 shadow-lg">
        <div>
          <Label htmlFor="name">Person Name *</Label>
          <div>
            <FormInput
              name="basicInfo.name"
              placeholder="Name"
              icon={<UserIcon className="h-6 w-6" />}
            />
            {/* <Input
              id="name"
              {...register('basicInfo.name')}
              icon={<UserIcon className="h-6 w-6" />}
              type="text"
              placeholder="Your name..."
              errorMessage={errors.basicInfo?.name?.message}
            /> */}
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <div>
            <FormInput
              name="basicInfo.email"
              placeholder="Your email..."
              icon={<MailIcon className="h-6 w-6" />}
              iconPosition="left"
              type="text"
            />

            {/* <Input
              id="email"
              {...register('basicInfo.email', {
                required: 'Email is required',
              })}
              icon={<MailIcon className="h-6 w-6" />}
              type="email"
              placeholder="Your email..."
              errorMessage={errors.basicInfo?.email?.message}
            /> */}
          </div>
        </div>

        <div>
          <Label>Phone number *</Label>
          <div className="mt-1 flex">
            <FormPhoneInput name="basicInfo.phone" className="w-full" />
          </div>
        </div>

        <div>
          <Label htmlFor="websiteURL">Website URL</Label>

          <FormInput
            name="basicInfo.website"
            icon={<UrlIcon className="h-6 w-6" />}
            type="text"
            placeholder="Your website URL..."
          />

          {/* <Input
            id="websiteURL"
            {...register('basicInfo.website', {
              required: 'Website URL required',
            })}
            icon={<UrlIcon className="h-6 w-6" />}
            type="text"
            placeholder="Your website URL..."
            errorMessage={errors.basicInfo?.website?.message}
          /> */}
        </div>
        <div>
          <Label htmlFor="company">Company Legal Name *</Label>

          <FormInput
            name="basicInfo.company"
            icon={<BussinessIcon className="h-6 w-6" />}
            type="text"
            placeholder="Your Company name..."
          />

          {/* <Input
            id="company"
            {...register('basicInfo.company')}
            icon={<BussinessIcon className="h-6 w-6" />}
            type="text"
            placeholder="Your Company name..."
            errorMessage={errors.basicInfo?.company?.message}
          /> */}
        </div>
        <div>
          <Label htmlFor="otherBussiness">Other Bussiness Name *</Label>

          <FormInput
            name="basicInfo.otherBussiness"
            icon={<BussinessIconYellow className="h-6 w-6" />}
            type="text"
            placeholder="Your Bussiness Name..."
          />
          {/* <Input
            id="otherBussiness"
            {...register('basicInfo.otherBussiness')}
            icon={<BussinessIconYellow className="h-6 w-6" />}
            type="text"
            placeholder="Your Bussiness Name..."
            errorMessage={errors.basicInfo?.otherBussiness?.message}
          /> */}
        </div>
      </div>
    </>
  );
};

export default BasicInformation;
