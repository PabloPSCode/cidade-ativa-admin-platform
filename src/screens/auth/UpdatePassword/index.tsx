import { HeaderNavigation } from "@/components/miscellaneous/HeaderNavigation";
import { showAlertSuccess } from "@/utils/alerts";
import { useState } from "react";
import { UpdatePasswordForm } from "./components/UpdatePasswordForm";

export function UpdatePassword() {
  const [password, setPassword] = useState("");

  return (
    <div className="flex w-full max-w-[640px] flex-col">
      <div className="mb-5">
        <HeaderNavigation screenTitle="Redefinição de senha" />
      </div>
      <UpdatePasswordForm
        password={password}
        setPassword={setPassword}
        onSubmit={() => showAlertSuccess("Senha alterada com sucesso")}
      />
    </div>
  );
}
