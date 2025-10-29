import { useUserStore } from '../store/userStore';
import API from '../MyAccount/api';

type ApiResponse<T> = Promise<{
  data: T;
  is_error: boolean;
  errorMessage: string[];
}>;

interface Currency {
  displayName: string;
  currencyCode: string;
}

interface Country {
  code: string;
  name: string;
}

interface Language {
  languageName: string;
  language: string;
}

interface PmsList {
  id: number;
  name: string;
}

const getPropertyTypes = propertyFilter =>
  API.get(
    `/listings/propertyTypes${propertyFilter ? `/${propertyFilter}` : ''}`,
  );

const getCurrencies = (): ApiResponse<Currency[]> => {
  return API.get('/listings/currencies');
};

const getCountries = (): ApiResponse<Country[]> =>
  API.get('/listings/location/countries');

const getLanguages = (): ApiResponse<Language[]> =>
  API.get('listings/languages');

export const getPmsList = (): ApiResponse<PmsList[]> =>
  API.get(`/account/pmsList`);

const getStatesByCountryCode = countryCode =>
  API.get(`/listings/location/country/states?countryCode=${countryCode}`);

const getGroupedAddresses = () => API.get('/listings/grouped-addresses');

const getPropertyCount = () => API.get('/listings/propertyCount');

const getCoordinatesByAdress = ({ country, city, streetAddress, zip, state }) =>
  API.get(
    `/listings/location/coordinates-by-address?country=${country}&city=${city}&streetAddress=${streetAddress}&zip=${zip}${
      state ? `&state=${state}` : ''
    }`,
  );

const getProperty = propertyId => API.get(`/listings/${propertyId}`);

const createProperty = propertyData =>
  API.post('/listings/create', { data: propertyData });

const updateProperty = propertyData =>
  API.put('/listings', { data: propertyData });

const searchProperties = data =>
  API.post('/listings/search', {
    data: {
      ...data,
    },
  });

const searchPropertyById = propertyId =>
  API.post('/listings/search', {
    data: {
      propertyId,
    },
  });

const getPropertyPolicies = () => API.get('/listings/policies');

const getPropertyImages = propertyId => API.get(`/image/${propertyId}`);

const uploadImage = (propertyId, image) => {
  const {
    user: { token },
  } = useUserStore.getState();

  const partyID = (token || '').split(/\/|(%2F)|(%252F)/gi)[0] || '';
  const bodyFormData = new FormData();
  bodyFormData.append('pos', partyID);
  bodyFormData.append('actor', partyID);
  bodyFormData.append('image', image);

  return API.post(`/image/insert-without-queue/${propertyId}`, bodyFormData);
};

export const getImageAsBlob = imageUrl => {
  return API.get(imageUrl, { responseType: 'blob' });
};

export const updateAdvanceNotification = (productId, value) => {
  const requestData = {
    data: {
      productId,
      ...(!Number.isNaN(value) && { leadTime: value }),
    },
  };

  return API.post('/ra/insert-without-queue', requestData);
};

const deleteImage = (propertyId, imageData) => {
  return API.delete(`/image/delete-without-queue`, {
    data: {
      data: {
        productId: propertyId,
        images: [
          {
            ...imageData,
          },
        ],
      },
    },
  });
};

const getTags = () => API.get('/image/get-tags');

const updateTagsForImage = (propertyId, url, tags) =>
  API.put(`/image/update-tags/${propertyId}`, {
    data: {
      url,
      imageTags: tags,
    },
  });

const getBedTypes = () => API.get('/listings/bedTypes');

const updateImageSorting = (propertyId, images) =>
  API.put(`/image/image-sorting/${propertyId}`, { data: images });

const getProductUpdateType = propertyId =>
  API.get(`/listings/productUpdateType/${propertyId}`);

const updateProductUpdateType = (propertyId, data) =>
  API.put(`/listings/productUpdateType/${propertyId}`, { data });

const updateBedroomConfiguration = (propertyId, data) =>
  API.put(`/listings/bedroomConfiguration/${propertyId}`, data);

const exportReport = () => API.get('product/export');

const getFeesAndTaxes = (propertyId, idInResponse) =>
  API.get(`/taxfee/${propertyId}${idInResponse ? '?idInResponse=true' : ''}`);

const saveTaxes = data => API.post(`/taxfee/insert-taxes`, { data });

const saveFees = data => API.post(`/taxfee/insert-fees`, { data });

const notConnectPropertyPerChannel = channel =>
  API.get(`/onboarding/notConnectPropertyPerChannel/${channel}`);

const getPropertyMapping = channel =>
  API.get(`onboarding/propertyMappingToolState/${channel?.toUpperCase()}`);

const getPropertiesAvailableForUpdate = channel =>
  API.get(`onboarding/availableForUpdate/${channel?.toUpperCase()}`);

const createListing = (channel, products, newListingPromotionIds) =>
  API.post('/onboarding/build', {
    data: {
      productIds: products,
      channelABBs: [channel.toUpperCase()],
      ...(newListingPromotionIds && {
        mapNewPropertyPromotion: newListingPromotionIds,
      }),
    },
  });

const updateContent = (channel, products) =>
  API.post('onboarding/updateStatic', {
    data: { productIds: products, channelABBs: [channel.toUpperCase()] },
  });

const updateImages = (channel, products) =>
  API.post('onboarding/updateImages', {
    data: { productIds: products, channelABBs: [channel.toUpperCase()] },
  });

const updateDynamic = (channel, products) =>
  API.post('onboarding/updateDynamic', {
    data: { productIds: products, channelABBs: [channel.toUpperCase()] },
  });

const getLOSRates = productId => API.get(`/losrates/${productId}`);

const updateProductStatus = (
  productIds,
  action,
  channel,
  supportCloseReason = null,
  reasons = null,
) =>
  API.post(`onboarding/${action}`, {
    data: {
      productIds,
      channelABBs: [channel.toUpperCase()],
      ...(action === 'close' &&
        supportCloseReason && {
          deactivationReason: reasons.reason,
          deactivationDetails: reasons.reasonDetails,
          deactivationOtherDetails: reasons.subReason,
        }),
    },
  });

export const getBookingSettings = () => API.get('/listings/bookingSettings');

export const getRestriction = productId =>
  API.get(`/ra/${productId}/restriction`);

export const getCheckoutTasks = channel =>
  API.get(`/listings/checkOutTasks/${channel}`);

export const getCheckoutTasksForProperty = (channel, propertyId) =>
  API.get(`/listings/checkOutTasks/${channel}/${propertyId}`);

export const deleteCheckoutTask = (channel, taskId) =>
  API.delete(`/listings/checkOutTasks/${channel}/${taskId}`);

export const createCheckoutTasksForProperty = (channel, propertyId, data) =>
  API.post(`/listings/checkOutTasks/${channel}/${propertyId}`, { data });

export default {
  getPropertyTypes,
  getCurrencies,
  getCountries,
  getStatesByCountryCode,
  getGroupedAddresses,
  getPropertyCount,
  getCoordinatesByAdress,
  getProperty,
  createProperty,
  updateProperty,
  updateAdvanceNotification,
  searchProperties,
  searchPropertyById,
  getPropertyPolicies,
  exportReport,
  getPropertyImages,
  getImageAsBlob,
  uploadImage,
  deleteImage,
  getTags,
  updateTagsForImage,
  updateImageSorting,
  getProductUpdateType,
  updateProductUpdateType,
  updateBedroomConfiguration,
  getLanguages,
  getBedTypes,
  getFeesAndTaxes,
  saveTaxes,
  saveFees,
  notConnectPropertyPerChannel,
  getPropertyMapping,
  getPropertiesAvailableForUpdate,
  createListing,
  updateProductStatus,
  updateContent,
  updateImages,
  updateDynamic,
  getBookingSettings,
  getRestriction,
  getLOSRates,
  getPmsList,
  getCheckoutTasks,
  getCheckoutTasksForProperty,
  createCheckoutTasksForProperty,
  deleteCheckoutTask,
};
