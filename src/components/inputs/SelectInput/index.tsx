import { collapseLongString } from "../../../utils/formats";
import { CSSProperties, forwardRef, InputHTMLAttributes } from "react";
import Select, { StylesConfig } from "react-select";

interface SelectOption {
  value: number | string;
  label: string;
}

interface SelectInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "defaultValue"
  > {
  label: string;
  options: SelectOption[];
  /** Currently selected value (controlled). Use `null`/`undefined` for none. */
  value?: number | string | null;
  /** Keeps the provided options order instead of sorting alphabetically. */
  disableSort?: boolean;
  /** Disables the control (forwarded to react-select). */
  isDisabled?: boolean;
  widthVariant?: "mid" | "full";
  isSearchable?: boolean;
  labelStyle?: CSSProperties;
  selectStyle?: CSSProperties;
  singleValueStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  labelClassName?: string;
  singleValueClassName?: string;
  containerClassName?: string;
  onSelectOption?: (selectedOption: {
    value: number | string;
    label: string;
  }) => void;
}

// //TODO-PABLO: Grant all select input is filled with an object that contains the label and the value whose must be the id for the selected option that represents the record on database

export const SelectInput = forwardRef<HTMLInputElement, SelectInputProps>(
  (
    {
      label,
      options,
      value,
      disableSort,
      widthVariant,
      isSearchable,
      containerStyle,
      selectStyle,
      labelStyle,
      singleValueStyle,
      onSelectOption,
      labelClassName,
      containerClassName,
      singleValueClassName,
      ...rest
    },
    ref
  ) => {
    const customStyles: StylesConfig = {
      input: (base) => ({
        ...base,
        display: "flex",
        alignItems: "center",
        color: "var(--color-foreground)",
      }),
      control: (base, state) => ({
        ...base,
        fontSize: "14px",
        minHeight: "40px",
        backgroundColor: "var(--color-background)",
        borderColor: state.isFocused
          ? "var(--color-primary-500)"
          : "var(--color-border-card)",
        boxShadow: "none",
        "&:hover": { borderColor: "var(--color-border-card)" },
        ...selectStyle,
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: "var(--color-bg-card)",
        border: "1px solid var(--color-border-card)",
        overflow: "hidden",
      }),
      menuList: (base) => ({
        ...base,
        maxHeight: "200px",
      }),
      menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
      }),
      singleValue: (base) => ({
        ...base,
        color: "var(--color-foreground)",
        ...singleValueStyle,
      }),
      placeholder: (base) => ({
        ...base,
        color: "color-mix(in srgb, var(--color-foreground) 55%, transparent)",
      }),
      option: (base, state) => ({
        ...base,
        fontSize: "14px",
        cursor: "pointer",
        color: state.isSelected ? "#ffffff" : "var(--color-foreground)",
        backgroundColor: state.isSelected
          ? "var(--color-primary-500)"
          : state.isFocused
          ? "color-mix(in srgb, var(--color-foreground) 8%, transparent)"
          : "transparent",
      }),
      dropdownIndicator: (base, state) =>
        ({
          ...base,
          fontSize: "14px",
          transform: state.isFocused ? "rotateZ(90deg)" : null,
          transition: "transform 0.2s",
        } as never),
    };

    const MAX_SELECT_INPUT_MID_WIDTH_OPTION_STRING_LENGTH = 32;
    const MAX_SELECT_INPUT_FULL_WIDTH_OPTION_STRING_LENGTH = 80;

    const formattedOptions = options.map((opt) => ({
      value: opt.value,
      label:
        widthVariant === "mid"
          ? collapseLongString(
              opt.label,
              MAX_SELECT_INPUT_MID_WIDTH_OPTION_STRING_LENGTH
            )
          : collapseLongString(
              opt.label,
              MAX_SELECT_INPUT_FULL_WIDTH_OPTION_STRING_LENGTH
            ),
    }));

    if (!disableSort) {
      formattedOptions.sort((a, b) => {
        if (typeof a.value === "string" && typeof b.value === "string") {
          if (a.label.toLowerCase() > b.label.toLowerCase()) return 1;
          if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
        }
        return 0;
      });
    }

    const handleChange = (selectedOption: any) => {
      if (onSelectOption) {
        onSelectOption(selectedOption);
      }
    };

    // When `value` is provided the component is controlled; otherwise it falls
    // back to the first option as the (uncontrolled) default.
    const isControlled = value !== undefined;
    const selectedOption = isControlled
      ? formattedOptions.find((opt) => opt.value === value) ?? null
      : undefined;

    return (
      <div
        className={
          containerClassName
            ? containerClassName
            : "flex flex-col min-w-[96px] w-full"
        }
        style={containerStyle}
      >
        <label
          htmlFor="select"
          className={
            labelClassName
              ? labelClassName
              : "text-gray-700 dark:text-gray-100 text-[12px] lg:text-sm mb-1"
          }
          style={labelStyle}
        >
          {label}
        </label>
        <Select
          {...(isControlled
            ? { value: selectedOption }
            : { defaultValue: options[0] })}
          className={
            widthVariant === "full"
              ? "w-full text-gray-600"
              : "w-[99%] text-gray-700"
          }
          classNamePrefix="select"
          styles={customStyles}
          menuPortalTarget={
            typeof document !== "undefined" ? document.body : undefined
          }
          options={formattedOptions}
          onChange={handleChange}
          noOptionsMessage={({ inputValue }) =>
            !inputValue
              ? inputValue
              : "Não foi encontrado nenhum dado nesta lista para a pesquisa " +
                "'" +
                inputValue +
                "'"
          }
          isSearchable={isSearchable}
          maxMenuHeight={200}
          {...rest}
          blurInputOnSelect
          ref={ref as never}
        />
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";
