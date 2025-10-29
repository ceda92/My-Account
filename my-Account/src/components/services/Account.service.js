import API from "../MyAccount/api";

export const getAirbnbPmInfo = () => API.get('airbnb-host-creation/getPmInfo');

export const getAuthToken = () => API.get('airbnb-host-creation/getAuthToken');

export const createAirbnbHostAccount = data =>
  API.post('airbnb-host-creation/createAirbnbHostAccunt', { data });

export const claimAirbnbAccount = () =>
  API.get('airbnb-host-creation/claimAccount');

export const getProfileInfo = () => API.get('account/profileInfo');

export const updateAccount = data => API.put('account', { data });

export const getContactTypes = () => API.get('account/contactTypes');

export const getEmailNotifications = additionalContactId =>
  API.get(`account/emailNotifications/${additionalContactId}`);

export const saveEmailNotifications = (additionalContactId, configuration) =>
  API.put(`account/updateEmailNotifications`, {
    data: { configuration, additionalContactId },
  });

export const getUserData = () => API.get(`account/profileData`);

export const deleteAdditionalContact = additionalContactId =>
  API.delete(`account/deleteAdditionalContact/${additionalContactId}`);

export const logAuthorizationTrigger = data =>
  API.post('channel-authorization/authorizationProcess', data);
