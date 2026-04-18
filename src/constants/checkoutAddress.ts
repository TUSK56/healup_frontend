/** Persisted when patient saves profile; used to auto-fill checkout delivery fields. */
export const CHECKOUT_SELECTED_ADDRESS_KEY = "healup_selected_checkout_address";

export type StoredCheckoutAddressSelection = {
  addressId: number;
};
