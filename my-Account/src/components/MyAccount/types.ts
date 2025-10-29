export interface Contact {
  id: number;
  name: string;
  phone: string;
  emailAddress: string;
  type: string;
  pmId: string;
  version: string;
}
export interface ContactType {
  contactTypeEnum: string;
  contactTypeValue: string;
}

export interface BackendContact {
  id: number;
  pmId: string;
  emailAddress: string;
  phone: string;
  version: string;
  type: string;
  name: string;
}

export interface Configuration {
  id: number;
  name: string;
  checked: boolean;
}

export interface BackendResponseEmail {
  message: string;
  errorMessage: string[];
  code: string;
  data: [{ configuration: Configuration[] }];
  is_error: boolean;
}
export interface BackendChannelSpecificContacts {
  channelAbbreviation: string;
  emailAddress: string;
  id: number;
  name: string;
}

export interface ChannelSpecificContacts {
  channelAbbreviation: string;
  emailAddress: string;
  id: number;
  name: string;
}
