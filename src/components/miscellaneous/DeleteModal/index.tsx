import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { KeyboardEvent, MouseEvent } from "react";
import Modal from "react-modal";

interface DeleteModalProps {
  resource: string;
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  onConfirmAction: (param: any) => void;
  onClose: () => void;
  /** Disables both buttons and shows a pending label while the deletion runs. */
  isProcessing?: boolean;
}

export function DeleteModal({
  resource,
  isOpen,
  onRequestClose,
  onConfirmAction,
  onClose,
  isProcessing = false,
}: DeleteModalProps) {
  const { theme } = useThemeStore();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose as never}
      style={
        theme === "light" ? reactModalCustomStyles : reactModalCustomStylesDark
      }
    >
      <Title
        content="Confirmação de remoção"
        className="text-center text-black dark:text-white mb-4 font-bold text-sm md:text-lg"
      />
      <Subtitle
        content={`Deseja realmente remover esse ${resource}?`}
        className="text-center text-gray-700 dark:text-gray-100 text-[13px] md:text-[14px]"
      />
      <Subtitle
        content="Essa ação não é reversível!"
        className="text-center text-gray-700 dark:text-gray-100 mb-6  text-[13px] md:text-[14px]"
      />
      <div className="flex flex-row items-center justify-around w-full md:w-[400px]">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="text-black dark:text-white bg-gray-200 dark:bg-slate-700  px-4 py-2 rounded-md  text-[13px] md:text-[14px] mr-4 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancelar remoção
        </button>
        <button
          onClick={onConfirmAction}
          disabled={isProcessing}
          className="text-white  text-[13px] md:text-[14px] bg-red-500 px-4 py-2 rounded-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? "Removendo..." : "Confirmar remoção"}
        </button>
      </div>
    </Modal>
  );
}
