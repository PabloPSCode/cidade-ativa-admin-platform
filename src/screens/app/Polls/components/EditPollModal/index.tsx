import { REQUIRED_FIELD_MESSAGE } from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { FileInput } from "@/components/inputs/FileInput";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { TextInput } from "@/components/inputs/TextInput";
import { computePollStatus } from "@/screens/app/Polls/constants/polls";
import {
  updatePoll,
  type PollResponseDTO,
  type UpdatePollDTO,
} from "@/services/polls";
import {
  createVoteOption,
  deleteVoteOption,
  listVoteOptions,
  updateVoteOption,
} from "@/services/vote-options";
import { createVote, listVotes } from "@/services/votes";
import { useAuthenticationStore } from "@/store/auth";
import {
  getErrorMessage,
  showAlertError,
  showAlertSuccess,
} from "@/utils/alerts";
import { yupResolver } from "@hookform/resolvers/yup";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useEffect, useState, type ChangeEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

const MAX_COVER_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MIN_VOTE_OPTIONS = 2;
const TODAY = new Date().toISOString().slice(0, 10);

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao carregar a imagem."));
    reader.readAsDataURL(file);
  });

const toDateInput = (value: Date | string | null) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

interface VoteOptionItem {
  id: string | null;
  optionText: string;
}

interface EditPollFormInputs {
  title: string;
  description: string;
  pollCoverUrl: string;
  startedAt?: string;
  finishedAt?: string;
}

interface EditPollModalProps {
  poll: PollResponseDTO;
  onClose: () => void;
  onUpdated: (poll: PollResponseDTO) => void;
}

export default function EditPollModal({
  poll,
  onClose,
  onUpdated,
}: EditPollModalProps) {
  const { user } = useAuthenticationStore();

  const [coverPreview, setCoverPreview] = useState<string | null>(
    poll.pollCoverUrl || null,
  );
  const [coverFileName, setCoverFileName] = useState("");
  const [uploadKey, setUploadKey] = useState(0);

  const [options, setOptions] = useState<VoteOptionItem[]>([]);
  const [originalById, setOriginalById] = useState<Map<string, string>>(
    new Map(),
  );
  const [removedOptionIds, setRemovedOptionIds] = useState<string[]>([]);
  const [voteId, setVoteId] = useState<string | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const validationSchema = yup.object({
    title: yup.string().required(REQUIRED_FIELD_MESSAGE),
    description: yup.string().required(REQUIRED_FIELD_MESSAGE),
    pollCoverUrl: yup.string().required("Selecione uma imagem de capa"),
    startedAt: yup.string().optional(),
    finishedAt: yup
      .string()
      .optional()
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
    formState: { errors, isValid, isSubmitting },
  } = useForm<EditPollFormInputs>({
    resolver: yupResolver(validationSchema) as never,
    mode: "onChange",
    defaultValues: {
      title: poll.title,
      description: poll.description,
      pollCoverUrl: poll.pollCoverUrl,
      startedAt: toDateInput(poll.startedAt),
      finishedAt: toDateInput(poll.finishedAt),
    },
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchVoteData() {
      setIsLoadingOptions(true);
      try {
        const votesResult = await listVotes({ pollId: poll.id, perPage: 100 });
        if (cancelled) return;

        const vote = votesResult.data[0] ?? null;
        if (!vote) {
          setVoteId(null);
          setOptions([]);
          setOriginalById(new Map());
          return;
        }

        setVoteId(vote.id);
        const optionsResult = await listVoteOptions({
          voteId: vote.id,
          perPage: 100,
        });
        if (cancelled) return;

        const loaded: VoteOptionItem[] = optionsResult.data.map((option) => ({
          id: option.id,
          optionText: option.optionText,
        }));
        setOptions(loaded);
        setOriginalById(
          new Map(
            loaded.map((option) => [option.id as string, option.optionText]),
          ),
        );
      } catch (error) {
        if (!cancelled) {
          showAlertError(
            getErrorMessage(
              error,
              "Não foi possível carregar as opções de voto.",
            ),
          );
        }
      } finally {
        if (!cancelled) setIsLoadingOptions(false);
      }
    }

    fetchVoteData();
    return () => {
      cancelled = true;
    };
  }, [poll.id]);

  const filledOptions = options
    .map((option) => option.optionText.trim())
    .filter(Boolean);
  const hasEnoughOptions = filledOptions.length >= MIN_VOTE_OPTIONS;

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
    setOptions((current) =>
      current.map((option, i) =>
        i === index ? { ...option, optionText: value } : option,
      ),
    );
  };

  const handleAddOption = () => {
    setOptions((current) => [...current, { id: null, optionText: "" }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions((current) => {
      const option = current[index];
      if (option?.id) {
        setRemovedOptionIds((ids) => [...ids, option.id as string]);
      }
      return current.filter((_, i) => i !== index);
    });
  };

  const handleUpdatePoll: SubmitHandler<EditPollFormInputs> = async (data) => {
    if (!hasEnoughOptions) {
      showAlertError("Informe ao menos duas opções de voto.");
      return;
    }

    const payload: UpdatePollDTO = {
      title: data.title.trim(),
      description: data.description.trim(),
      pollCoverUrl: data.pollCoverUrl,
      status: computePollStatus(data.startedAt, data.finishedAt),
      ...(data.startedAt ? { startedAt: new Date(data.startedAt) } : {}),
      ...(data.finishedAt ? { finishedAt: new Date(data.finishedAt) } : {}),
    };

    try {
      const updated = await updatePoll(poll.id, payload);

      // Ensure a vote exists to attach the options to.
      let currentVoteId = voteId;
      const validOptions = options.filter((option) => option.optionText.trim());
      if (!currentVoteId && validOptions.length > 0) {
        if (!user?.id) {
          throw new Error(
            "Não foi possível identificar o usuário autenticado.",
          );
        }
        const vote = await createVote({
          title: payload.title as string,
          description: payload.description as string,
          pollId: poll.id,
          userId: user.id,
        });
        currentVoteId = vote.id;
      }

      const tasks: Promise<unknown>[] = [];
      removedOptionIds.forEach((id) => tasks.push(deleteVoteOption(id)));
      options.forEach((option) => {
        const text = option.optionText.trim();
        if (!text) return;
        if (option.id) {
          if (originalById.get(option.id) !== text) {
            tasks.push(updateVoteOption(option.id, { optionText: text }));
          }
        } else if (currentVoteId) {
          tasks.push(
            createVoteOption({ optionText: text, voteId: currentVoteId }),
          );
        }
      });
      await Promise.all(tasks);

      onUpdated(updated);
      showAlertSuccess("Enquete atualizada com sucesso.");
      onClose();
    } catch (error) {
      showAlertError(
        getErrorMessage(error, "Não foi possível atualizar a enquete."),
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={() => !isSubmitting && onClose()}
    >
      <form
        noValidate
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit(handleUpdatePoll)}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] border border-border-card/70 bg-bg-card p-6 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.6)]"
      >
        <h2 className="text-xl font-black tracking-tight">Editar enquete</h2>
        <p className="mt-2 text-sm text-foreground/65">
          Atualize os dados da enquete e as opções de voto.
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
              labelDescription="Selecione uma nova imagem para substituir (máximo 5MB)."
              buttonTitle="Trocar imagem"
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
                  {coverFileName || "Imagem atual"}
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
                inputLabel="Início"
                type="date"
                min={TODAY}
                {...register("startedAt")}
              />
            </div>
            <div className="w-full">
              <TextInput
                inputLabel="Encerramento"
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
                disabled={isLoadingOptions}
                className="inline-flex items-center gap-1 rounded-sm border border-foreground/15 px-2.5 py-1.5 text-xs font-semibold text-foreground transition hover:bg-foreground/5 disabled:opacity-50"
              >
                <PlusIcon size={14} weight="bold" />
                Adicionar
              </button>
            </div>

            {isLoadingOptions ? (
              <p className="mt-3 text-sm text-foreground/65">
                Carregando opções...
              </p>
            ) : (
              <>
                <div className="mt-3 flex flex-col gap-2">
                  {options.map((option, index) => (
                    <div
                      key={option.id ?? `new-${index}`}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={option.optionText}
                        onChange={(event) =>
                          handleOptionChange(index, event.target.value)
                        }
                        placeholder={`Opção ${index + 1}`}
                        className="h-[40px] w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-secondary outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        title="Remover opção"
                        aria-label="Remover opção"
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-destructive-500/25 bg-destructive-500/10 text-destructive-600 transition hover:bg-destructive-500/15 dark:text-destructive-300"
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
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => !isSubmitting && onClose()}
            disabled={isSubmitting}
            className="rounded-sm border border-foreground/15 bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground/5 disabled:opacity-50"
          >
            Cancelar
          </button>
          <Button
            type="submit"
            title={isSubmitting ? "Salvando..." : "Salvar alterações"}
            className="sm:w-auto sm:px-6"
            disabled={
              !isValid || !hasEnoughOptions || isLoadingOptions || isSubmitting
            }
          />
        </div>
      </form>
    </div>
  );
}
