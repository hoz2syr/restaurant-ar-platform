// Feature Flags Configuration
export interface FeatureFlags {
  enableArMenu: boolean;
  enableOnlineOrdering: boolean;
  enableReservations: boolean;
  enablePromotions: boolean;
  enableLoyaltyProgram: boolean;
  enableMultiLanguage: boolean;
  enablePushNotifications: boolean;
  enableTableQrOrdering: boolean;
  enableDeliveryTracking: boolean;
  enablePaymentGateway: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableArMenu: true,
  enableOnlineOrdering: true,
  enableReservations: true,
  enablePromotions: true,
  enableLoyaltyProgram: false,
  enableMultiLanguage: true,
  enablePushNotifications: false,
  enableTableQrOrdering: true,
  enableDeliveryTracking: false,
  enablePaymentGateway: false,
};

// Function to get feature flags from environment
export function getFeatureFlags(): FeatureFlags {
  return {
    enableArMenu: process.env.ENABLE_AR_MENU === 'true',
    enableOnlineOrdering: process.env.ENABLE_ONLINE_ORDERING === 'true',
    enableReservations: process.env.ENABLE_RESERVATIONS === 'true',
    enablePromotions: process.env.ENABLE_PROMOTIONS === 'true',
    enableLoyaltyProgram: process.env.ENABLE_LOYALTY_PROGRAM === 'true',
    enableMultiLanguage: process.env.ENABLE_MULTI_LANGUAGE === 'true',
    enablePushNotifications: process.env.ENABLE_PUSH_NOTIFICATIONS === 'true',
    enableTableQrOrdering: process.env.ENABLE_TABLE_QR_ORDERING === 'true',
    enableDeliveryTracking: process.env.ENABLE_DELIVERY_TRACKING === 'true',
    enablePaymentGateway: process.env.ENABLE_PAYMENT_GATEWAY === 'true',
  };
}
