import React, { FunctionComponent, InputHTMLAttributes } from 'react';
import Button from '../Button/Button';
import InputText from '../InputText/InputText';
import $ from './Form.module.css';

type ExtraProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value"
> & { value: string | number };

interface FormEntry {
  name: string;
  placeholder: string;
  // TODO: Defined a suitable type for extra props
  // This type should cover all different of attribute types
  extraProps: ExtraProps;
}

interface FormProps {
  label: string;
  loading: boolean;
  formEntries: FormEntry[];
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  submitText: string;
}


const Form: FunctionComponent<FormProps> = ({
  label,
  loading,
  formEntries,
  onFormSubmit,
  submitText,
}) => {
  return (
    <form onSubmit={onFormSubmit} className={$.form}>
      <fieldset>
        <h3 className={$.formHeading}>{label}</h3>

        {formEntries.map(({ name, placeholder, extraProps }, idx) => {
          const { value } = extraProps;
          const typeOfValue = typeof value;

          // Runtime guard
          if (typeOfValue !== "string" && typeOfValue !== "number") {
            alert(
              `Form field "${name}" has invalid value type: ` +
                `${typeOfValue}. Only string or number allowed.`
            );
          }

          return (
            <div key={`${name}-${idx}`} className={$.formRow}>
              <InputText
                name={name}
                placeholder={placeholder}
                {...extraProps}
              />
            </div>
          );
        })}

        <Button loading={loading} type="submit">
          {submitText}
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;
