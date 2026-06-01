import { Button } from "@/components/buttons/Button";
import { PasswordTextInput } from "@/components/inputs/PasswordInput";
import { PasswordRequirements } from "@/components/miscellaneous/PasswordRequirements";
import { Text } from "@/components/typography/Text";
import {
  lowerCaseRegex,
  numbersRegex,
  specialCharacterRegex,
  upperCaseRegex,
} from "@/utils/regex";
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";

interface UpdatePasswordFormProps {
  onSubmit: () => void;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
}

const MIN_PASSWORD_LENGTH = 8;

export function UpdatePasswordForm({
  onSubmit,
  password,
  setPassword,
}: UpdatePasswordFormProps) {
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const passwordValidatedRef = useRef(false);

  const submit = async (form: FormEvent) => {
    form.preventDefault();
    onSubmit();
  };

  const passwordMatchesRules =
    password.length >= MIN_PASSWORD_LENGTH &&
    lowerCaseRegex.test(password) &&
    upperCaseRegex.test(password) &&
    numbersRegex.test(password) &&
    specialCharacterRegex.test(password);

  const isFormValid =
    passwordMatchesRules &&
    passwordConfirmation.length > 0 &&
    password === passwordConfirmation;

  return (
    <form
      className="w-full rounded-md border border-[#e8e8e8] bg-white p-8 shadow-md"
      onSubmit={submit}
    >
      <div className="mb-4 flex w-full flex-row">
        <Text content="Informe uma nova senha de acesso à plataforma." />
      </div>
      <div className="mb-4 flex w-full">
        <PasswordRequirements
          password={password}
          passwordValidated={passwordValidatedRef}
        />
      </div>
      <div className="mb-3 flex w-full flex-row">
        <PasswordTextInput
          inputLabel="Nova senha"
          placeholder="Sua nova senha"
          value={password}
          onChange={(val) => setPassword(val.target.value)}
        />
      </div>
      <div className="mb-6 flex w-full flex-row">
        <PasswordTextInput
          inputLabel="Confirmação da nova senha"
          placeholder="Confirme sua nova senha"
          value={passwordConfirmation}
          onChange={(val) => setPasswordConfirmation(val.target.value)}
        />
      </div>
      <Button
        type="submit"
        title="Redefinir senha"
        className="h-[48px] w-full rounded-md bg-primary text-base font-semibold text-gray-50"
        disabled={!isFormValid}
      />
    </form>
  );
}
