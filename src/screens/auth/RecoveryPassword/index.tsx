import { HeaderNavigation } from "@/components/miscellaneous/HeaderNavigation";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CodeInputCard from "./components/CodeInputCard";
import RecoveryPasswordForm, {
  RecoveryPasswordInputs,
} from "./components/RecoveryPasswordForm";

const API_CODE = "123456";

export function RecoveryPassword() {
  const [wasCodeRequested, setWasCodeRequested] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isInvalidCode, setIsInvalidCode] = useState(false);

  const navigate = useNavigate();

  const handleSendConfirmationCode = (data: RecoveryPasswordInputs) => {
    console.log(data);
    setPhone(data.phone);
    setWasCodeRequested(true);
  };

  const handleValidateCode = () => {
    if (code === API_CODE) {
      setIsInvalidCode(false);
      navigate("/redefinir-senha");
    } else {
      setIsInvalidCode(true);
    }
  };

  return (
    <div className="flex w-full max-w-[640px] flex-col">
      <div className="mb-5">
        <HeaderNavigation screenTitle="Recuperação de senha via Whatsapp" />
      </div>
      {wasCodeRequested ? (
        <CodeInputCard
          code={code}
          onChangeCode={(val) => setCode(val)}
          phone={phone}
          isInvalidCode={isInvalidCode}
          onValidateCode={handleValidateCode}
        />
      ) : (
        <RecoveryPasswordForm onSubmit={handleSendConfirmationCode} />
      )}
    </div>
  );
}
