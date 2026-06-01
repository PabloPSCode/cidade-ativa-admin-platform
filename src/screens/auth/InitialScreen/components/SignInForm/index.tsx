import {
  EMAIL_INVALID_MESSAGE,
  MIN_PASSWORD_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { LinkButton } from "@/components/buttons/LinkButton";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { PasswordTextInput } from "@/components/inputs/PasswordInput";
import { TextInput } from "@/components/inputs/TextInput";
import { Subtitle } from "@/components/typography/Subtitle";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";

export interface SignInFormInputs {
  email: string;
  password: string;
}

interface SignInFormProps {
  onSubmit: (data: SignInFormInputs) => void;
}

export function SignInForm({ onSubmit }: SignInFormProps) {
  const validationSchema = yup.object({
    email: yup
      .string()
      .email(EMAIL_INVALID_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
    password: yup
      .string()
      .required(REQUIRED_FIELD_MESSAGE)
      .min(MIN_PASSWORD_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const handleSubmitForm: SubmitHandler<SignInFormInputs> = (data) => {
    onSubmit(data);
  };

  return (
    <form
      className="w-full rounded-md border border-[#e8e8e8] bg-white p-8 shadow-md mb-4"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <Subtitle
        content="Fazer login"
        className="mb-6 text-center text-[15px] font-bold text-black font-secondary"
      />
      <div className="mb-3">
        <TextInput
          inputLabel="Email"
          placeholder="johndoe@gmail.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && <ErrorMessage errorMessage={errors.email.message} />}
      </div>
      <div className="mb-6">
        <PasswordTextInput
          inputLabel="Senha"
          placeholder="Mínimo de 6 dígitos"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <ErrorMessage errorMessage={errors.password.message} />
        )}
      </div>
      <Button
        title="Fazer login"
        type="submit"
        className="h-[48px] w-full rounded-md bg-primary text-base font-semibold text-gray-50 hover:bg-primary-dark"
        disabled={!isValid}
      />
      <div className="mt-5 flex w-full flex-row items-center justify-between">
        <Link to="/recuperar-senha">
          <LinkButton title="Recuperar senha" />
        </Link>
        <Link to="/cadastro">
          <LinkButton title="Criar minha conta" />
        </Link>
      </div>
    </form>
  );
}
