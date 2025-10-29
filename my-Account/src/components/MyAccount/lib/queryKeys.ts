// src/lib/query-keys.ts

/**
 * Central place for all query keys in the application
 * This provides type safety and autocompletion when referencing keys
 */

export const queryKeys = {
  reviews: {
    all: ["reviews"] as const,
    lists: () => [...queryKeys.reviews.all, "list"] as const,
    list: (filters: unknown) =>
      [...queryKeys.reviews.lists(), { filters }] as const,
    sentiment: (productId: string | number | undefined, filters?: unknown) =>
      [...queryKeys.reviews.all, "sentiment", productId, filters] as const,
    topics: (productId: string | number | undefined) =>
      [...queryKeys.reviews.all, "topics", productId] as const,
    detail: (id: string | number) =>
      [...queryKeys.reviews.all, "detail", id] as const,
    summary: (productId: string | number | undefined) =>
      [...queryKeys.reviews.all, "summary", productId] as const,
    statistics: (productId: string | number | undefined) =>
      [...queryKeys.reviews.all, "statistics", productId] as const,
    productsOverview: (filters: unknown) =>
      [...queryKeys.reviews.all, "products-overview", filters] as const,
  },
  properties: {
    all: ["properties"] as const,
    lists: () => [...queryKeys.properties.all, "list"] as const,
    list: (filters: unknown) =>
      [...queryKeys.properties.lists(), { filters }] as const,
    detail: (id: string | number) =>
      [...queryKeys.properties.all, "detail", id] as const,
  },
  reservations: {
    all: ["reservations"] as const,
    clarityReport: (reservationId: string | number) =>
      [...queryKeys.reservations.all, "clarity-report", reservationId] as const,
    taxFee: (productId: string | number) =>
      [...queryKeys.reservations.all, "tax-fee", productId] as const,
  },
  // Add more domains as needed
};
