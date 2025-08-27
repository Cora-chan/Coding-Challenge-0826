import { Address } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
interface CounterState {
  addresses: Address[];
  error: string | null;
}

// Define the initial state using that type
const initialState: CounterState = {
  addresses: [],
  error: null,
};

export const addressBookSlice = createSlice({
  name: "address",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      /** TODO: Prevent duplicate addresses */

      const newAddr = action.payload;
      const normalized = (s: string) => s.trim().toLowerCase();

      const exists = state.addresses.some(
        (a) =>
          normalized(a.firstName) === normalized(newAddr.firstName) &&
          normalized(a.lastName) === normalized(newAddr.lastName)
      );

      if (exists) {
        // Prevent duplicate and notify user
        state.error = "Address already exists.";
        return;
      }

      state.addresses.push(newAddr);
      state.error = null; // Clear any previous error
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      /** TODO: Write a state update which removes an address from the addresses array. */
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);
      state.error = null; 
    },
    updateAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
      state.error = null; 
    },
  },
});

export const {
  addAddress,
  removeAddress,
  updateAddresses,
  setError,
  clearError,
} = addressBookSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
export const selectAddress = (state: RootState) => state.addressBook.addresses;

export const selectAddressError = (state: RootState) => state.addressBook.error;

export default addressBookSlice.reducer;
