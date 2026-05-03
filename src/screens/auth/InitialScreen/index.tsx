import { useAuthenticationStore } from "@/store/auth";
import { SignInForm, SignInFormInputs } from "./components/SignInForm";
import { Title } from "@/components/typography/Title";

export function InitialScreen() {
  const { signIn } = useAuthenticationStore();

  const handleSignIn = (data: SignInFormInputs) => {
    console.log(data);
    signIn();
  };

  return (
    <div className="flex flex-col lg:mt-[2vh] items-center lg:mb-2 mb-8">
      <Title
        content="Entrar na plataforma"
        className="text-black dark:text-white mb-6 text-xl font-bold md:text-3xl font-secondary"
      />
      <SignInForm onSubmit={handleSignIn} />
    </div>
  );
}
