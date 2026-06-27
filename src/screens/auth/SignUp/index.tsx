import { HeaderNavigation } from "@/components/miscellaneous/HeaderNavigation";
import { registerUser } from "@/services/auth";
import {
  getErrorMessage,
  showAlertError,
  showAlertSuccess,
} from "@/utils/alerts";
import { useNavigate } from "react-router-dom";
import SignUpForm, { type SignUpFormInputs } from "./components/SignUpForm";

export function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = async (data: SignUpFormInputs) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        // Sign-ups on the admin platform create administrative users.
        isAdmin: true,
        isCouncilman: false,
        address: "",
        neighborhood: "",
        // Binds the user to the selected tenant (city/UF).
        cityId: data.cityId,
        city: data.city,
        uf: data.uf,
      });

      showAlertSuccess(
        "Cadastro realizado com sucesso! Faça login para continuar.",
      );
      navigate("/");
    } catch (error) {
      showAlertError(
        getErrorMessage(error, "Não foi possível concluir o cadastro."),
      );
    }
  };

  return (
    <div className="flex w-full max-w-[460px] flex-col">
      <div className="mb-5">
        <HeaderNavigation screenTitle="Cadastro de administrador" />
      </div>
      <SignUpForm onSubmit={handleSubmit} />
    </div>
  );
}
