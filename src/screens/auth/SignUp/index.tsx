import { HeaderNavigation } from "@/components/miscellaneous/HeaderNavigation";
import SignUpForm from "./components/SignUpForm";

export function SignUp() {
  //TODO-PABLO: Submit data to real API
  const handleSubmit = (data: any) => {
    console.log(data);
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
