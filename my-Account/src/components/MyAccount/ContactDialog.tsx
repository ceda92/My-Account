import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import FloatingLabelSelect from "../ui/floating-label-select";
import Input from "../ui/Input";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getContactTypes,
  getProfileInfo,
  updateAccount,
} from "../services/Account.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { transformFromBackendContacts } from "./Contacts";
import { useProfileData } from "../MyAccount/Hooks/useProfileData";
import { Contact, ContactType } from "./types";

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingContact?: Contact | null;
}

function ContactDialog({
  isOpen,
  onClose,
  editingContact,
}: ContactDialogProps) {
  const queryClient = useQueryClient();

  const { data: originalProfileData, isLoading, isError } = useProfileData();

  const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    phone: z.string().min(6, "Phone must be at least 6 digits"),
    emailAddress: z.string().email("Invalid email address"),
    type: z.string().min(1, "Contact type is required"),
  });

  type FormDataAdd = z.infer<typeof schema>;

  const {
    data: contactType,
    isLoading: loadingContactType,
    error: contactTypeError,
  } = useQuery({
    queryKey: ["contactType"],
    queryFn: getContactTypes,
  });

  const contactTypeOptions: { value: string; label: string }[] =
    contactType?.data?.[0]?.transportAccount?.map((con: ContactType) => ({
      value: con.contactTypeEnum,
      label: con.contactTypeValue,
    })) || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormDataAdd>({
    resolver: zodResolver(schema),
    defaultValues: editingContact
      ? {
          name: editingContact.name,
          phone: editingContact.phone,
          emailAddress: editingContact.emailAddress,
          type:
            contactTypeOptions.find(
              (option) => option.label === editingContact.type
            )?.value || editingContact.type,
        }
      : {
          name: "",
          phone: "",
          emailAddress: "",
          type: "",
        },
  });

  const { data: profileContacts = [], isLoading: isContactsLoading } = useQuery(
    {
      queryKey: ["profileContacts"],
      queryFn: getProfileInfo,
      select: transformFromBackendContacts,
    }
  );

  useEffect(() => {
    if (editingContact) {
      const contactTypeValue =
        contactTypeOptions.find(
          (option) => option.label === editingContact.type
        )?.value || editingContact.type;

      reset({
        name: editingContact.name,
        phone: editingContact.phone,
        emailAddress: editingContact.emailAddress,
        type: contactTypeValue,
      });
    } else {
      reset({
        name: "",
        phone: "",
        emailAddress: "",
        type: "",
      });
    }
  }, [editingContact, reset, loadingContactType, isOpen]);

  const addContactMutation = useMutation({
    mutationFn: async (newContactData: FormDataAdd) => {
      if (!originalProfileData) {
        throw new Error("Profile data not available");
      }

      const newContact = {
        name: newContactData.name,
        phone: newContactData.phone,
        emailAddress: newContactData.emailAddress,
        pmId: originalProfileData.partyId.toString(),
        type:
          contactTypeOptions.find(
            (option: { value: string }) => option.value === newContactData.type
          )?.label || newContactData.type,
      };
      const payload = {
        ...originalProfileData,
        contacts: [...(profileContacts || []), newContact],
      };

      return updateAccount(payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profileContacts"] });
      queryClient.invalidateQueries({ queryKey: ["profileInfo"] });
      toast.success("Contact added successfully!");
    },
    onError: (error) => {
      toast.error("Failed to add contact. Please try again.");
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: async ({
      contactId,
      updatedData,
    }: {
      contactId: number;
      updatedData: FormDataAdd;
    }) => {
      if (!originalProfileData) {
        throw new Error("Profile data not available");
      }

      const updatedContacts = profileContacts.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              name: updatedData.name,
              phone: updatedData.phone,
              emailAddress: updatedData.emailAddress,
              type:
                contactTypeOptions.find(
                  (option: { value: string }) =>
                    option.value === updatedData.type
                )?.label || updatedData.type,
            }
          : contact
      );

      const payload = {
        ...originalProfileData,
        contacts: updatedContacts,
      };

      return updateAccount(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileContacts"] });
      queryClient.invalidateQueries({ queryKey: ["profileInfo"] });
      toast.success("Contact updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update contact. Please try again.");
    },
  });

  const handleAddContact: SubmitHandler<FormDataAdd> = async (formData) => {
    try {
      if (editingContact) {
        await updateContactMutation.mutateAsync({
          contactId: editingContact.id,
          updatedData: formData,
        });
      } else {
        await addContactMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      setError("name", {
        message: "Operation failed. Please try again.",
      });
    }
  };

  return (
    <div className="min-[940px] flex max-w-[1280px] justify-end pb-3">
      <Dialog
        open={isOpen}
        onOpenChange={(open: any) => {
          if (!open) {
            reset();
            onClose();
          }
        }}
      >
        <DialogContent className="flex w-fit flex-col items-center">
          <DialogClose className="absolute right-1 top-1">
            {" "}
            <X className="h-5 w-5" />
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              New Contact
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddContact)}>
            <div className="flex min-w-[450px] max-w-sm flex-col gap-4 p-4 py-4">
              <div className="flex justify-start">
                <Label htmlFor="personDetails" className="mb-2">
                  Person Details *
                </Label>
              </div>
              <Input
                {...register("name", { required: "Name required" })}
                className="mb-3"
                id="personDetails"
                placeholder="Full name"
              />
              {errors.name && (
                <div className="text-red-500"> {errors.name.message}</div>
              )}

              <div className="flex justify-start">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
              </div>
              <Input
                {...register("phone", {
                  required: "Phone number required",
                })}
                id="phoneNumber"
                placeholder="phone number"
              />
              {errors.phone && (
                <div className="text-red-500"> {errors.phone.message}</div>
              )}
              <div className="flex justify-start">
                <Label htmlFor="emailAddress">Email Address *</Label>
              </div>

              <Input
                {...register("emailAddress", {
                  required: "Emil is required",
                })}
                id="emailAddress"
                placeholder="email"
              />
              {errors.emailAddress && (
                <div className="text-red-500">
                  {" "}
                  {errors.emailAddress.message}
                </div>
              )}
              <div className="flex justify-start">
                <Label>Contact Type *</Label>
              </div>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <FloatingLabelSelect
                    triggerClassName="w-full"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={contactTypeOptions}
                    placeholder="Choose contact type..."
                  />
                )}
              />
              {errors.type && (
                <div className="text-red-500">{errors.type.message}</div>
              )}
              <div className="mt-4 flex justify-center">
                <Button type="submit" className="w-48">
                  Add
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ContactDialog;
