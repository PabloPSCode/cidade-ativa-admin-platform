import { Title } from "@/components/typography/Title";
import { authenticate } from "@/services/auth";
import { getUserByEmail } from "@/services/users";
import { setAuthToken } from "@/services/api";
import { useAuthenticationStore } from "@/store/auth";
import {
  getErrorMessage,
  showAlertError,
  showAlertSuccess,
} from "@/utils/alerts";
import { SignInForm, SignInFormInputs } from "./components/SignInForm";

export function InitialScreen() {
  const { signIn } = useAuthenticationStore();

  const handleSignIn = async (data: SignInFormInputs) => {
    try {
      const { token } = await authenticate({
        email: data.email,
        password: data.password,
      });

      // Authorize the follow-up request that loads the signed-in profile.
      setAuthToken(token);
      const user = await getUserByEmail(data.email);

      signIn(token, user);
      showAlertSuccess(`Bem-vindo(a), ${user.name}!`);
    } catch (error) {
      showAlertError(getErrorMessage(error, "Não foi possível entrar."));
    }
  };

  return (
    <div className="flex flex-col lg:mt-[2vh] items-center lg:mb-2 mb-8 sm:min-w-[480px]">
      <Title
        content="Entrar na plataforma"
        className="text-black dark:text-white mb-6 text-xl font-bold md:text-3xl font-secondary"
      />
      <SignInForm onSubmit={handleSignIn} />
    </div>
  );
}
