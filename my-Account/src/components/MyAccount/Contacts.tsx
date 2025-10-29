import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { LocalTable } from "../ui/local-data-table";
import { TableStyleProps } from "../ui/tableTypes";
import { ReactComponent as ContactsIcon } from "../../assets/icons/contacts.svg";
import { ReactComponent as DeleteIcon } from "../../assets/icons/deleteGreen.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import { ReactComponent as MailIcon } from "../../assets/icons/mailSml.svg";
import {
  deleteAdditionalContact,
  getEmailNotifications,
  getProfileInfo,
  saveEmailNotifications,
} from "../services/Account.service" ;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import _ from "underscore";
import ContactDialog from "./ContactDialog";
import {
  BackendContact,
  BackendResponseEmail,
  Configuration,
  Contact,
} from "./types";

export const transformFromBackendContacts = (
  backendResponse: Awaited<ReturnType<typeof getProfileInfo>>
): Contact[] => {
  const profileData = backendResponse.data?.[0];
  if (!profileData?.contacts) return [];

  return profileData.contacts.map((contact: BackendContact) => ({
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    emailAddress: contact.emailAddress,
    type: contact.type,
    pmId: contact.pmId,
  }));
};

const Contacts = () => {
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [rowId, setRowId] = useState<number | null>(null);

  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const queryClient = useQueryClient();
  const [emailNotificationSetings, setEmailNotificationSetings] = useState<
    Configuration[]
  >([]);

  const handleDialogOpenChange = (open: boolean) => {
    setNotificationDialogOpen(open);
  };

  const {
    data: emailNotifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["emailNotifications", rowId],
    enabled: !!rowId,
    queryFn: () => getEmailNotifications(rowId),
    select: (response: BackendResponseEmail): Configuration[] =>
      response?.data?.[0]?.configuration ?? [],
  });

  // Delete Contact

  const deleteContact = useMutation({
    mutationFn: deleteAdditionalContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileContacts"] });

      toast.success("Contact deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete contact. Please try again.");
    },
  });

  const { data: profileContacts = [], isLoading: isContactsLoading } = useQuery(
    {
      queryKey: ["profileContacts"],
      queryFn: getProfileInfo,
      select: transformFromBackendContacts,
    }
  );

  const handleNotificationToggle = (configIndex: number) => {
    setEmailNotificationSetings((prev) =>
      prev.map((config, index) =>
        index === configIndex ? { ...config, checked: !config.checked } : config
      )
    );
  };

  const hasUserChangedNotificationSetings = useMemo(
    () => _.isEqual(emailNotificationSetings, emailNotifications),
    [emailNotificationSetings, emailNotifications]
  );

  useEffect(() => {
    if (emailNotifications.length > 0) {
      setEmailNotificationSetings(emailNotifications);
    }
  }, [emailNotifications]);

  const handleSaveNotifications = () => {
    if (!rowId) {
      toast("No contact selected");
      return;
    }
    saveNotificationsMutation.mutate(
      { rowId, settings: emailNotificationSetings },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["emailNotifications"] });

          toast.success("Settings saved successfully!");
          setNotificationDialogOpen(false);
        },
        onError: (error) => {
          alert("Failed to save settings. Please try again.");
        },
      }
    );
  };

  const saveNotificationsMutation = useMutation({
    mutationFn: (data: { rowId: number; settings: Configuration[] }) =>
      saveEmailNotifications(data.rowId, data.settings),
    onSuccess: () => {
      setRowId(null);
    },
    onError: (error) => {
      toast.error("Failed to save settings. Please try again.");
    },
  });

  const columns: ColumnDef<Contact>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Person Details",
      },
      {
        accessorKey: "phone",
        header: "Phone Number",
      },
      {
        accessorKey: "emailAddress",
        header: "Email Address",
      },
      {
        accessorKey: "type",
        header: "Contact Type",
      },
      {
        id: "actions",
        header: () => <div className="pl-4">Actions</div>,

        cell: ({ row }) => {
          const contact = row.original;

          return (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                className="bg-white"
                size="sm"
                onClick={() => {
                  deleteContact.mutate(contact.id);
                }}
              >
                <DeleteIcon />
              </Button>

              <Button
                variant="ghost"
                type="button"
                className="bg-white"
                size="sm"
                onClick={() => {
                  setRowId(row.original.id);
                  setNotificationDialogOpen(true);
                }}
              >
                <MailIcon />
              </Button>

              <Button
                variant="ghost"
                type="button"
                className="h-8 w-8 bg-white"
                onClick={() => {
                  setEditingContact(contact);
                  setContactDialogOpen(true);
                }}
              >
                <EditIcon />
              </Button>
            </div>
          );
        },
        size: 160,
      },
    ],
    [selectedContacts, profileContacts]
  );

  const customTableStyles: TableStyleProps = {
    headerRowClassName:
      "bg-gradient-to-r from-dark-blue via-dark-blue-600 to-lime-green hover:bg-green-100/80  text-xs sm:text-sm",
  };

  return (
    <div className="min-[940px] mx-auto max-w-[1280px]">
      <div className="px-6">
        <ContactsIcon className="h-11 w-11" />
        <h1>Contacts</h1>
      </div>
      <Dialog
        open={notificationDialogOpen}
        onOpenChange={(open: boolean) => {
          return handleDialogOpenChange(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Notifications</DialogTitle>
            <DialogDescription>
              Notification settings for{" "}
              {profileContacts.find((c) => c.id !== rowId)?.emailAddress}
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <p>Loading notifications...</p>
          ) : (
            <ul className="space-y-2">
              {emailNotificationSetings?.map((config, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>{config.name}</span>
                  <Checkbox
                    checked={config.checked}
                    onCheckedChange={() => handleNotificationToggle(i)}
                  />
                </li>
              ))}
            </ul>
          )}
          <div className="">
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  disabled={
                    hasUserChangedNotificationSetings ||
                    saveNotificationsMutation.isPending
                  }
                  onClick={handleSaveNotifications}
                >
                  {saveNotificationsMutation.isPending ? "Saving..." : "SAVE"}
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex justify-end">
        <Button
          className="h-10 w-10 rounded-r-none text-black"
          onClick={() => {
            setContactDialogOpen(true);
          }}
        >
          <span className="text-4xl text-white">+</span>
        </Button>
        <Button
          className="disabled rounded-l-none bg-white px-10 py-5"
          disabled
        >
          <span className="text-black">Add Additional Contacts</span>
        </Button>
      </div>
      <ContactDialog
        isOpen={contactDialogOpen}
        onClose={() => {
          setContactDialogOpen(false);
          setEditingContact(null);
        }}
        editingContact={editingContact}
      />
      <div className="overflow-x-auto rounded-lg">
        <LocalTable
          columns={columns}
          data={profileContacts}
          getRowId={(row) => row.id.toString()}
          isLoading={false}
          tableStyles={customTableStyles}
        />
      </div>
    </div>
  );
};

export default Contacts;
