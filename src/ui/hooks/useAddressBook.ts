import {
  addAddress as addAddressAction,
  removeAddress as removeAddressAction,
  selectAddress,
  updateAddresses,
} from "../../core/reducers/addressBookSlice";
import { Address } from "@/types";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../core/store/hooks";

import transformAddress, { RawAddressModel } from "../../core/models/address";
import databaseService from "../../core/services/databaseService";

export default function useAddressBook() {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddress);
  const [loading, setLoading] = React.useState(true);

  // 1) Load saved addresses once
  const loadSavedAddresses = React.useCallback(async () => {
    const saved = await databaseService.getItem<RawAddressModel[]>("addresses");
    if (Array.isArray(saved)) {
      const transformed = saved.map(transformAddress);
      dispatch(updateAddresses(transformed));
    }
    setLoading(false);
  }, [dispatch]);

  // 2) Persist to IndexedDB whenever `addresses` changes (and not during initial load)
  React.useEffect(() => {
    if (!loading) {
      databaseService.setItem("addresses", addresses);
    }
  }, [addresses, loading]);

  // 3) Actions
  const addAddress = React.useCallback(
    (address: Address) => {
      dispatch(addAddressAction(address));
    },
    [dispatch]
  );

  const removeAddress = React.useCallback(
    (id: string) => {
      dispatch(removeAddressAction(id));
    },
    [dispatch]
  );

  return {
    addresses,
    loading,
    loadSavedAddresses,
    addAddress,
    removeAddress,
  };
}
