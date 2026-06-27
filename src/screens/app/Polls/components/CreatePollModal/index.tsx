import { REQUIRED_FIELD_MESSAGE } from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { FileInput } from "@/components/inputs/FileInput";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { TextInput } from "@/components/inputs/TextInput";
import { computePollStatus } from "@/screens/app/Polls/constants/polls";
import { createPoll, type CreatePollDTO } from "@/services/polls";
import { createVote } from "@/services/votes";
import { createVoteOption } from "@/services/vote-options";
import { useAuthenticationStore } from "@/store/auth";
import {
  getErrorMessage,
  showAlertError,
  showAlertSuccess,
} from "@/utils/alerts";
import { yupResolver } from "@hookform/resolvers/yup";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useState, type ChangeEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import type { PollResponseDTO } from "@/services/polls";

const MAX_COVER_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MIN_VOTE_OPTIONS = 2;
const TODAY = new Date().toISOString().slice(0, 10);

/** Reads an image file as a base64 data URL (stored in the database). */
const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao carregar a imagem."));
    reader.readAsDataURL(file);
  });

/** Form values mirror CreatePollDTO (dates handled as date-input strings). */
interface CreatePollFormInputs {
  title: string;
  description: string;
  pollCoverUrl: string;
  startedAt: string;
  finishedAt: string;
}

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (poll: PollResponseDTO) => void;
}

export default function CreatePollModal({
  isOpen,
  onClose,
  onCreated,
}: CreatePollModalProps) {
  const { user } = useAuthenticationStore();

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState("");
  const [voteOptions, setVoteOptions] = useState<string[]>(["", ""]);
  const [uploadKey, setUploadKey] = useState(0);

  const validationSchema = yup.object({
    title: yup.string().required(REQUIRED_FIELD_MESSAGE),
    description: yup.string().required(REQUIRED_FIELD_MESSAGE),
    pollCoverUrl: yup.string().required("Selecione uma imagem de capa"),
    startedAt: yup.string().required("Informe a data de início"),
    finishedAt: yup
      .string()
      .required("Informe a data de encerramento")
      .test(
        "after-start",
        "O encerramento deve ser após o início",
        (value, ctx) =>
          !value || !ctx.parent.startedAt || value >= ctx.parent.startedAt,
      ),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreatePollFormInputs>({
    resolver: yupResolver(validationSchema) as never,
    mode: "onChange",
  });

  const filledOptions = voteOptions.map((o) => o.trim()).filter(Boolean);
  const hasEnoughOptions = filledOptions.length >= MIN_VOTE_OPTIONS;

  const resetAll = () => {
    setCoverPreview(null);
    setCoverFileName("");
    setVoteOptions(["", ""]);
    setUploadKey((key) => key + 1);
    reset();
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetAll();
    onClose();
  };

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showAlertError("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > MAX_COVER_SIZE_BYTES) {
      showAlertError("A imagem deve ter no máximo 5MB.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setCoverPreview(dataUrl);
      setCoverFileName(file.name);
      setValue("pollCoverUrl", dataUrl, { shouldValidate: true });
    } catch {
      showAlertError("Não foi possível carregar a imagem.");
    } finally {
      setUploadKey((key) => key + 1);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    setVoteOptions((current) =>
      current.map((option, i) => (i === index ? value : option)),
    );
  };

  const handleAddOption = () => {
    setVoteOptions((current) => [...current, ""]);
  };

  const handleRemoveOption = (index: number) => {
    setVoteOptions((current) =>
      current.length <= MIN_VOTE_OPTIONS
        ? current
        : current.filter((_, i) => i !== index),
    );
  };

  const handleCreatePoll: SubmitHandler<CreatePollFormInputs> = async (
    data,
  ) => {
    if (!user?.id) {
      showAlertError("Não foi possível identificar o usuário autenticado.");
      return;
    }
    if (!hasEnoughOptions) {
      showAlertError("Informe ao menos duas opções de voto.");
      return;
    }

    const payload: CreatePollDTO = {
      title: data.title.trim(),
      description: data.description.trim(),
      pollCoverUrl: data.pollCoverUrl,
      status: computePollStatus(data.startedAt, data.finishedAt),
      startedAt: new Date(data.startedAt),
      finishedAt: new Date(data.finishedAt),
    };

    try {
      const poll = await createPoll(payload);
      const vote = await createVote({
        title: payload.title,
        description: payload.description,
        pollId: poll.id,
        userId: user.id,
      });
      await Promise.all(
        filledOptions.map((optionText) =>
          createVoteOption({ optionText, voteId: vote.id }),
        ),
      );

      onCreated(poll);
      showAlertSuccess("Enquete cadastrada com sucesso.");
      resetAll();
      onClose();
    } catch (error) {
      showAlertError(
        getErrorMessage(error, "Não foi possível cadastrar a enquete."),
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <form
        noValidate
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit(handleCreatePoll)}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] border border-border-card/70 bg-bg-card p-6 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.6)]"
      >
        <h2 className="text-xl font-black tracking-tight">Cadastrar enquete</h2>
        <p className="mt-2 text-sm text-foreground/65">
          Informe os dados da enquete e cadastre as opções de voto.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <TextInput
              inputLabel="Título *"
              placeholder="Título da enquete"
              {...register("title")}
            />
            {errors.title && (
              <ErrorMessage errorMessage={errors.title.message} />
            )}
          </div>

          <div className="flex flex-col">
            <TextAreaInput
              label="Descrição *"
              placeholder="Descreva o objetivo da enquete"
              {...register("description")}
            />
            {errors.description && (
              <ErrorMessage errorMessage={errors.description.message} />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <FileInput
              key={`cover-${uploadKey}`}
              label="Imagem de capa *"
              labelDescription="Selecione uma imagem (máximo 5MB)."
              buttonTitle={
                coverFileName ? "Trocar imagem" : "Selecionar imagem"
              }
              accept="image/*"
              onUpload={handleCoverUpload}
            />
            {coverPreview && (
              <div className="flex items-center gap-3 rounded-sm border border-border-card/60 bg-background/70 p-3 dark:bg-white/[0.02]">
                <img
                  src={coverPreview}
                  alt="Pré-visualização da capa"
                  className="h-16 w-16 shrink-0 rounded-sm object-cover"
                />
                <span className="min-w-0 truncate text-xs text-foreground/70">
                  {coverFileName}
                </span>
              </div>
            )}
            {errors.pollCoverUrl && (
              <ErrorMessage errorMessage={errors.pollCoverUrl.message} />
            )}
          </div>

          <p className="text-xs text-foreground/55">
            O status da enquete é definido automaticamente conforme o período de
            início e encerramento.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="w-full">
              <TextInput
                inputLabel="Início *"
                type="date"
                min={TODAY}
                {...register("startedAt")}
              />
              {errors.startedAt && (
                <ErrorMessage errorMessage={errors.startedAt.message} />
              )}
            </div>
            <div className="w-full">
              <TextInput
                inputLabel="Encerramento *"
                type="date"
                min={TODAY}
                {...register("finishedAt")}
              />
              {errors.finishedAt && (
                <ErrorMessage errorMessage={errors.finishedAt.message} />
              )}
            </div>
          </div>

          <div className="rounded-sm border border-border-card/60 bg-background/70 p-4 dark:bg-white/[0.02]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-medium text-secondary dark:text-slate-200">
                Opções de voto *
              </span>
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center gap-1 rounded-sm border border-foreground/15 px-2.5 py-1.5 text-xs font-semibold text-foreground transition hover:bg-foreground/5"
              >
                <PlusIcon size={14} weight="bold" />
                Adicionar
              </button>
            </div>
            <p className="mt-1 text-[11px] text-foreground/55">
              Cadastre ao menos {MIN_VOTE_OPTIONS} opções para finalizar.
            </p>

            <div className="mt-3 flex flex-col gap-2">
              {voteOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(event) =>
                      handleOptionChange(index, event.target.value)
                    }
                    placeholder={`Opção ${index + 1}`}
                    className="h-[40px] w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-secondary outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    disabled={voteOptions.length <= MIN_VOTE_OPTIONS}
                    title="Remover opção"
                    aria-label="Remover opção"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-destructive-500/25 bg-destructive-500/10 text-destructive-600 transition hover:bg-destructive-500/15 disabled:cursor-not-allowed disabled:opacity-40 dark:text-destructive-300"
                  >
                    <TrashIcon size={18} weight="fill" />
                  </button>
                </div>
              ))}
            </div>
            {!hasEnoughOptions && (
              <ErrorMessage
                errorMessage={`Informe ao menos ${MIN_VOTE_OPTIONS} opções de voto.`}
              />
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-sm border border-foreground/15 bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground/5 disabled:opacity-50"
          >
            Cancelar
          </button>
          <Button
            type="submit"
            title={isSubmitting ? "Cadastrando..." : "Cadastrar enquete"}
            className="sm:w-auto sm:px-6"
            disabled={!isValid || !hasEnoughOptions || isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
