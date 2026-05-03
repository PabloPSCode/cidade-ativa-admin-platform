import {
  PHONE_INVALID_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { MaskedTextInput } from "@/components/inputs/MaskedTextInput";
import { Text } from "@/components/typography/Text";
import { phoneMask } from "@/utils/masks";
import { phoneValidationRegex } from "@/utils/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

export interface RecoveryPasswordInputs {
  phone: string;
}

interface RecoveryPasswordFormProps {
  onSubmit: (data: RecoveryPasswordInputs) => void;
}

export default function RecoveryPasswordForm({
  onSubmit,
}: RecoveryPasswordFormProps) {
  const validationSchema = yup.object({
    phone: yup
      .string()
      .matches(phoneValidationRegex, PHONE_INVALID_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RecoveryPasswordInputs>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const handleSubmitForm: SubmitHandler<RecoveryPasswordInputs> = (data) => {
    onSubmit(data);
  };

  return (
    <form
      className="w-full rounded-2xl border border-[#e8e8e8] bg-white p-8 shadow-md"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <div className="mb-5">
        <Text content="Informe seu número de whatsapp para receber seu código de redefinição de senha. A mensagem somente será enviada caso exista algum usuário com o número informado." />
      </div>
      <div className="mb-6">
        <MaskedTextInput
          mask={phoneMask}
          inputLabel="Telefone"
          placeholder="(31) 99999-9999"
          autoComplete="tel"
          inputMode="numeric"
          {...register("phone")}
        />
        {errors.phone && <ErrorMessage errorMessage={errors.phone.message} />}
      </div>
      <Button
        type="submit"
        title="Receber código"
        className="h-[48px] w-full rounded-lg bg-primary text-base font-semibold text-gray-50 hover:bg-primary-dark"
        disabled={!isValid}
      />
    </form>
  );
}
