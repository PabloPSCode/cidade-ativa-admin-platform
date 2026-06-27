import {
  BIRTH_DATE_INVALID_MESSAGE,
  CPF_INVALID_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  MIN_PASSWORD_LENGTH,
  PASSWORD_MESSAGES_NOT_MATCH,
  PASSWORD_MIN_LENGTH_MESSAGE,
  PHONE_INVALID_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { LinkButton } from "@/components/buttons/LinkButton";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { MaskedTextInput } from "@/components/inputs/MaskedTextInput";
import { PasswordTextInput } from "@/components/inputs/PasswordInput";
import { SelectInput } from "@/components/inputs/SelectInput";
import { TextInput } from "@/components/inputs/TextInput";
import { PasswordRequirements } from "@/components/miscellaneous/PasswordRequirements";
import { StepIndicator } from "@/components/miscellaneous/StepIndicator";
import { useCities } from "@/hooks/useCities";
import { birthDateMask, cpfMask, phoneMask } from "@/utils/masks";
import {
  birthDateValidationRegex,
  cpfValidationRegex,
  lowerCaseRegex,
  numbersRegex,
  phoneValidationRegex,
  specialCharacterRegex,
  upperCaseRegex,
} from "@/utils/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

const PUBLIC_ROLE_OPTIONS = [
  { value: "secretary", label: "Secretário" },
  { value: "mayor", label: "Prefeito" },
];

const STEP_ONE_FIELDS = [
  "name",
  "email",
  "birthDate",
  "cpf",
  "phone",
  "uf",
  "cityId",
  "role",
] as const;

export interface SignUpFormInputs {
  name: string;
  email: string;
  cpf: string;
  birthDate: string;
  phone: string;
  uf: string;
  cityId: string;
  /** Resolved display name of the selected city; filled on submit. */
  city?: string;
  role: string;
  password: string;
  passwordConfirmation: string;
}

interface SignUpFormProps {
  onSubmit: (data: SignUpFormInputs) => void | Promise<void>;
}

export default function SignUpForm({ onSubmit }: SignUpFormProps) {
  const validationSchema = yup.object({
    name: yup.string().required(REQUIRED_FIELD_MESSAGE),
    email: yup
      .string()
      .required(REQUIRED_FIELD_MESSAGE)
      .email(EMAIL_INVALID_MESSAGE),
    birthDate: yup
      .string()
      .matches(birthDateValidationRegex, BIRTH_DATE_INVALID_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
    cpf: yup
      .string()
      .matches(cpfValidationRegex, CPF_INVALID_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
    phone: yup
      .string()
      .matches(phoneValidationRegex, PHONE_INVALID_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
    uf: yup.string().required(REQUIRED_FIELD_MESSAGE),
    cityId: yup.string().required(REQUIRED_FIELD_MESSAGE),
    role: yup.string().required(REQUIRED_FIELD_MESSAGE),
    password: yup
      .string()
      .min(MIN_PASSWORD_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE)
      .matches(lowerCaseRegex, "Inclua pelo menos 1 letra minúscula")
      .matches(upperCaseRegex, "Inclua pelo menos 1 letra maiúscula")
      .matches(numbersRegex, "Inclua pelo menos 1 número")
      .matches(specialCharacterRegex, "Inclua pelo menos 1 caractere especial")
      .required(REQUIRED_FIELD_MESSAGE),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password")], PASSWORD_MESSAGES_NOT_MATCH)
      .required(REQUIRED_FIELD_MESSAGE),
  });

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState("");
  const passwordValidatedRef = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignUpFormInputs>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const {
    ufOptions,
    citiesByUf,
    cityNameById,
    isLoading: isLoadingCities,
  } = useCities();
  const selectedUf = watch("uf") ?? "";
  const selectedCityId = watch("cityId") ?? "";
  const cityOptions = citiesByUf(selectedUf);

  const passwordValue = watch("password") ?? "";
  const stepOneValues = watch(STEP_ONE_FIELDS);
  const isStepOneFilled =
    stepOneValues.every((v) => !!v && v.toString().trim() !== "") &&
    selectedRole !== "";
  const hasStepOneErrors = STEP_ONE_FIELDS.some((field) => !!errors[field]);
  const isStepOneValid = isStepOneFilled && !hasStepOneErrors;

  const handleSubmitForm: SubmitHandler<SignUpFormInputs> = async (data) => {
    await onSubmit({ ...data, city: cityNameById(data.cityId) });
  };

  const handleRoleSelect = (option: {
    value: string | number;
    label: string;
  }) => {
    setSelectedRole(String(option.value));
    setValue("role", String(option.value), { shouldValidate: true });
  };

  const handleUfSelect = (option: { value: string | number; label: string }) => {
    setValue("uf", String(option.value), { shouldValidate: true });
    // Reset the dependent city selection when the UF changes.
    setValue("cityId", "", { shouldValidate: true });
  };

  const handleCitySelect = (option: {
    value: string | number;
    label: string;
  }) => {
    setValue("cityId", String(option.value), { shouldValidate: true });
  };

  const handleAdvanceToStepTwo = async () => {
    const isStepOneValid = await trigger([...STEP_ONE_FIELDS]);
    if (isStepOneValid && selectedRole) {
      setStep(2);
    }
  };

  const handleBackToStepOne = () => {
    setStep(1);
  };

  const roleRegister = register("role");
  const ufRegister = register("uf");
  const cityRegister = register("cityId");

  return (
    <form
      className="mx-auto mb-10 w-[95%] rounded-md border border-[#e8e8e8] bg-white p-6 shadow-md sm:w-[440px]"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <div className="mb-4">
        <StepIndicator
          stepLabel={`Etapa ${step} de 2`}
          steps={2}
          activeUntilStep={step}
        />
      </div>

      {step === 1 && (
        <div className="flex flex-col w-full">
          <div className="w-full mb-2">
            <TextInput
              inputLabel="Nome"
              placeholder="Seu nome"
              autoComplete="name"
              {...register("name")}
            />
            {errors.name && <ErrorMessage errorMessage={errors.name.message} />}
          </div>

          <div className="mb-2 flex w-full flex-row gap-2">
            <div className="w-full">
              <TextInput
                inputLabel="Email"
                placeholder="Seu e-mail"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <ErrorMessage errorMessage={errors.email.message} />
              )}
            </div>
            <div className="w-full">
              <MaskedTextInput
                mask={birthDateMask}
                inputLabel="Data de nascimento"
                placeholder="__/__/____"
                autoComplete="bday"
                inputMode="numeric"
                {...register("birthDate")}
              />
              {errors.birthDate && (
                <ErrorMessage errorMessage={errors.birthDate.message} />
              )}
            </div>
          </div>

          <div className="mb-2 flex w-full flex-row gap-2">
            <div className="w-full">
              <MaskedTextInput
                mask={cpfMask}
                inputLabel="CPF"
                placeholder="CPF"
                autoComplete="off"
                inputMode="numeric"
                {...register("cpf")}
              />
              {errors.cpf && <ErrorMessage errorMessage={errors.cpf.message} />}
            </div>
            <div className="w-full">
              <MaskedTextInput
                mask={phoneMask}
                inputLabel="Telefone"
                placeholder="Telefone"
                autoComplete="tel"
                inputMode="numeric"
                {...register("phone")}
              />
              {errors.phone && (
                <ErrorMessage errorMessage={errors.phone.message} />
              )}
            </div>
          </div>

          <div className="mb-4 flex w-full flex-row gap-2">
            <div className="w-full">
              <SelectInput
                label="UF"
                placeholder={
                  isLoadingCities ? "Carregando..." : "Selecione a UF"
                }
                options={ufOptions}
                value={selectedUf || null}
                isSearchable
                isDisabled={isLoadingCities}
                onSelectOption={handleUfSelect}
                labelClassName="text-[12px] font-semibold text-[#4e4e4e] mb-1"
                selectStyle={{
                  minHeight: "40px",
                  backgroundColor: "#f0f0f0",
                  borderColor: "#cfcfcf",
                  boxShadow: "none",
                  fontFamily: "Roboto, sans-serif",
                  color: "#2b2b2b",
                }}
              />
              <input type="hidden" value={selectedUf} {...ufRegister} />
              {errors.uf && <ErrorMessage errorMessage={errors.uf.message} />}
            </div>
            <div className="w-full">
              <SelectInput
                label="Cidade"
                placeholder={
                  !selectedUf
                    ? "Selecione a cidade"
                    : isLoadingCities
                      ? "Carregando..."
                      : "Selecione a cidade"
                }
                options={cityOptions}
                value={selectedCityId || null}
                isSearchable
                isDisabled={!selectedUf || isLoadingCities}
                onSelectOption={handleCitySelect}
                labelClassName="text-[12px] font-semibold text-[#4e4e4e] mb-1"
                selectStyle={{
                  minHeight: "40px",
                  backgroundColor: "#f0f0f0",
                  borderColor: "#cfcfcf",
                  boxShadow: "none",
                  fontFamily: "Roboto, sans-serif",
                  color: "#2b2b2b",
                }}
              />
              <input type="hidden" value={selectedCityId} {...cityRegister} />
              {errors.cityId && (
                <ErrorMessage errorMessage={errors.cityId.message} />
              )}
            </div>
          </div>

          <div className="w-full mb-4">
            <SelectInput
              label="Cargo público"
              placeholder="Selecione seu cargo na administração pública"
              options={PUBLIC_ROLE_OPTIONS}
              value={selectedRole || null}
              disableSort
              onSelectOption={handleRoleSelect}
              labelClassName="text-[12px] font-semibold text-[#4e4e4e] mb-1"
              selectStyle={{
                minHeight: "40px",
                backgroundColor: "#f0f0f0",
                borderColor: "#cfcfcf",
                boxShadow: "none",
                fontFamily: "Roboto, sans-serif",
                color: "#2b2b2b",
              }}
            />
            <input type="hidden" value={selectedRole} {...roleRegister} />
            {errors.role && <ErrorMessage errorMessage={errors.role.message} />}
          </div>

          <div className="w-full mt-1">
            <Button
              type="button"
              title="Próximo"
              onClick={handleAdvanceToStepTwo}
              className="h-[44px] w-full rounded-md bg-primary text-base font-medium text-gray-50"
              disabled={!isStepOneValid}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col w-full">
          <div className="w-full mb-3">
            <PasswordRequirements
              password={passwordValue}
              passwordValidated={passwordValidatedRef}
            />
          </div>

          <div className="w-full mb-2">
            <PasswordTextInput
              inputLabel="Senha"
              autoComplete="new-password"
              placeholder="Sua nova senha"
              {...register("password")}
            />
            {errors.password && (
              <ErrorMessage errorMessage={errors.password.message} />
            )}
          </div>

          <div className="w-full mb-4">
            <PasswordTextInput
              inputLabel="Confirmação da senha"
              placeholder="Confirme sua nova senha"
              autoComplete="new-password"
              {...register("passwordConfirmation")}
            />
            {errors.passwordConfirmation && (
              <ErrorMessage errorMessage={errors.passwordConfirmation.message} />
            )}
          </div>

          <div className="w-full mt-1">
            <Button
              type="submit"
              title={isSubmitting ? "Cadastrando..." : "Cadastrar usuário"}
              className="h-[44px] w-full rounded-md bg-primary text-base font-medium text-gray-50"
              disabled={!isValid || !selectedRole || isSubmitting}
            />
          </div>

          <div className="mt-4 flex w-full justify-center">
            <LinkButton
              type="button"
              title="Voltar"
              onClick={handleBackToStepOne}
            />
          </div>
        </div>
      )}
    </form>
  );
}
