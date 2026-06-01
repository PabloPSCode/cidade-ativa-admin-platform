import { Button } from "@/components/buttons/Button";
import { Text } from "@/components/typography/Text";
import { Dispatch, SetStateAction } from "react";
import VerificationInput from "react-verification-input";

interface CodeInputCardProps {
  code: string;
  onChangeCode: Dispatch<SetStateAction<string>>;
  isInvalidCode: boolean;
  phone: string;
  onValidateCode: () => void;
}

const DEFAULT_CODE_LENGTH = 6;

export default function CodeInputCard({
  phone,
  code,
  isInvalidCode,
  onChangeCode,
  onValidateCode,
}: CodeInputCardProps) {
  return (
    <div className="w-full rounded-md border border-[#e8e8e8] bg-white p-8 shadow-md">
      <div className="mb-5">
        <Text
          content={`Informe o código numérico de 6 dígitos que enviamos para ${phone}`}
        />
      </div>
      <div className="mb-6 flex w-full justify-center">
        <VerificationInput
          value={code}
          onChange={onChangeCode}
          validChars="0-9"
          placeholder=""
          length={DEFAULT_CODE_LENGTH}
          classNames={{
            container: "gap-2",
            character:
              "flex items-center justify-center rounded-md border border-[#cfcfcf] bg-white text-xl text-gray-700",
            characterInactive: "bg-white",
            characterSelected: "border-primary bg-white text-gray-700",
            characterFilled: "bg-white",
          }}
        />
      </div>
      {code.length === DEFAULT_CODE_LENGTH && isInvalidCode && (
        <div className="mb-4 flex w-full flex-col items-center text-sm">
          <span className="text-center text-red-400">Código inválido</span>
        </div>
      )}
      <Button
        type="button"
        title="Validar código"
        onClick={onValidateCode}
        className="h-[48px] w-full rounded-md bg-primary text-base font-semibold text-gray-50 hover:bg-primary-dark"
        disabled={code.length !== DEFAULT_CODE_LENGTH}
      />
    </div>
  );
}
