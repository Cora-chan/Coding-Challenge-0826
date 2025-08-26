import React, { useState } from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Form from "@/components/Form/Form";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import useFormFields from "@/hooks/useFormFields";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { Address as AddressType } from "./types";
import localforage from "localforage";
import { useEffect } from "react";

const transformAddress = (address: AddressType): AddressType => {
  return {
    ...address,
    id: Math.random().toString(36).substring(2, 9),
  };
};

const App: React.FC = () => {

  const { fields: addressFields, handleChange: handleAddressChange, resetFields: resetAddressFields } = useFormFields({
    postCode: "",
    houseNumber: "",
  });

  const { fields: personFields, handleChange: handlePersonChange, resetFields: resetPersonFields } = useFormFields({
    firstName: "",
    lastName: "",
  });

  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */

  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState("");
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);

  /**
   * Redux actions
   */
    const { addAddress } = useAddressBook();
  /**
   * Text fields onChange handlers
   */


  const handleSelectedAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setSelectedAddress(e.target.value);

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setAddresses([]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=${addressFields.postCode}&streetnumber=${addressFields.houseNumber}`
      );
      console.log("addressFields", addressFields);

      if (!response.ok) throw new Error("Failed to fetch addresses");

      const data = await response.json();
      console.log("data", data);
      const transformed = data.details.map(transformAddress);
      setAddresses(transformed);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (!personFields.firstName || !personFields.lastName) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const found = addresses.find((a) => a.id === selectedAddress);
    if (!found) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...found, ...personFields });
    // resetPersonFields();
    // setSelectedAddress("");
  };

  const handleClearAll = () => {
    resetAddressFields();
    resetPersonFields();
    setSelectedAddress("");
    setAddresses([]);
    setError(undefined);
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small className="font-small">
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}

        <Form
          label="🏠 Find an address"
          loading={loading}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                value: addressFields.postCode,
                onChange: handleAddressChange,
              },
            },
            {
              name: "houseNumber",
              placeholder: "House Number",
              extraProps: {
                value: addressFields.houseNumber,
                onChange: handleAddressChange,
              },
            },
          ]}
        />


        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                checked={selectedAddress === address.id}
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            loading={false}
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                extraProps: {
                  value: personFields.firstName,
                  onChange: handlePersonChange,
                },
              },
              {
                name: "lastName",
                placeholder: "Last name",
                extraProps: {
                  value: personFields.lastName,
                  onChange: handlePersonChange,
                },
              },
            ]}
          />
        )}


        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <ErrorMessage message={error} />}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages



        */<Button variant="tertiary" onClick={handleClearAll}>
            Clear all fields
          </Button>}
      </Section>

      <Section variant="dark">
           <AddressBook
          // addresses={addresses}
          // loading={loading}
          // removeAddress={removeAddress}
        />
        
      </Section>
    </main>
  );
}

export default App;
