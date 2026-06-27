import { FileInput } from "@/components/inputs/FileInput";
import { HeaderNavigation } from "@/components/miscellaneous/HeaderNavigation";
import {
  UploadedFile,
  type IFile,
} from "@/components/miscellaneous/UploadedFile";
import {
  listSignaturesBySolicitation,
  type SolicitationSignatureResponseDTO,
} from "@/services/signatures";
import {
  approveSolicitation,
  getSolicitationById,
  solveSolicitation,
  unconsiderSolicitation,
} from "@/services/solicitations";
import {
  getErrorMessage,
  showAlertError,
  showAlertSuccess,
} from "@/utils/alerts";
import {
  BuildingsIcon,
  CheckCircleIcon,
  ProhibitIcon,
  ThumbsUpIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import {
  mapSolicitationDTOToRecord,
  type SolicitationRecord,
} from "../GeneralSolicitations/constants/solicitations";
import SignatureListCard from "./components/SignatureListCard";
import SolicitationDetailsCard from "./components/SolicitationDetailsCard";

export function ManageSolicitations() {
  const { id } = useParams<{ id: string }>();
  const [solicitation, setSolicitation] = useState<SolicitationRecord>();
  const [isLoading, setIsLoading] = useState(true);

  const [solveModalOpen, setSolveModalOpen] = useState(false);
  const [solvedPhotos, setSolvedPhotos] = useState<IFile[]>([]);
  const [solvedCommentary, setSolvedCommentary] = useState("");
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  const [unconsiderModalOpen, setUnconsiderModalOpen] = useState(false);
  const [unconsiderCommentary, setUnconsiderCommentary] = useState("");
  const [isUnconsidering, setIsUnconsidering] = useState(false);

  const [signatures, setSignatures] = useState<
    SolicitationSignatureResponseDTO[]
  >([]);
  const [signaturesModalOpen, setSignaturesModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    listSignaturesBySolicitation(id)
      .then((list) => {
        if (!cancelled) setSignatures(list);
      })
      .catch(() => {
        if (!cancelled) setSignatures([]);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const fetchSolicitation = useCallback(async () => {
    if (!id) {
      setSolicitation(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const dto = await getSolicitationById(id);
      setSolicitation(mapSolicitationDTOToRecord(dto));
    } catch (error) {
      setSolicitation(undefined);
      showAlertError(
        getErrorMessage(error, "Não foi possível carregar a solicitação."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSolicitation();
  }, [fetchSolicitation]);

  const handleApprove = async () => {
    if (!id) return;

    try {
      const dto = await approveSolicitation(id);
      setSolicitation(mapSolicitationDTOToRecord(dto));
      showAlertSuccess("Solicitação aprovada e movida para em andamento.");
    } catch (error) {
      showAlertError(
        getErrorMessage(error, "Não foi possível aprovar a solicitação."),
      );
    }
  };

  const readFileAsUploadedFile = (file: File): Promise<IFile> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          name: file.name,
          uri: String(reader.result),
          size: Math.max(1, Math.round(file.size / 1024)),
          type: file.type || "image/jpeg",
        });
      reader.onerror = () => reject(new Error("Falha ao carregar imagem."));
      reader.readAsDataURL(file);
    });

  const handleOpenSolveModal = () => {
    setSolvedPhotos([]);
    setSolvedCommentary("");
    setUploadKey((key) => key + 1);
    setSolveModalOpen(true);
  };

  const handleCloseSolveModal = () => {
    if (isSolving) return;
    setSolveModalOpen(false);
  };

  const handleUploadPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setIsUploadingPhotos(true);
    try {
      const previews = await Promise.all(files.map(readFileAsUploadedFile));
      setSolvedPhotos((prev) => [...prev, ...previews]);
    } catch (error) {
      showAlertError(getErrorMessage(error, "Falha ao carregar imagem."));
    } finally {
      setIsUploadingPhotos(false);
      setUploadKey((key) => key + 1);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setSolvedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const canConfirmSolve =
    solvedPhotos.length > 0 && !isUploadingPhotos && !isSolving;

  const handleConfirmSolve = async () => {
    if (!id || solvedPhotos.length === 0) return;

    const commentary = solvedCommentary.trim();
    setIsSolving(true);
    try {
      const dto = await solveSolicitation(id, {
        solvedImageUrls: solvedPhotos.map((photo) => photo.uri),
        ...(commentary ? { solvedCommentary: commentary } : {}),
      });
      setSolicitation(mapSolicitationDTOToRecord(dto));
      setSolveModalOpen(false);
      showAlertSuccess("Solicitação marcada como resolvida.");
    } catch (error) {
      showAlertError(
        getErrorMessage(error, "Não foi possível resolver a solicitação."),
      );
    } finally {
      setIsSolving(false);
    }
  };

  const handleOpenUnconsiderModal = () => {
    setUnconsiderCommentary("");
    setUnconsiderModalOpen(true);
  };

  const handleConfirmUnconsider = async () => {
    const commentary = unconsiderCommentary.trim();
    if (!id || commentary.length === 0) return;

    setIsUnconsidering(true);
    try {
      const dto = await unconsiderSolicitation(id, commentary);
      setSolicitation(mapSolicitationDTOToRecord(dto));
      setUnconsiderModalOpen(false);
      showAlertSuccess("Solicitação desconsiderada.");
    } catch (error) {
      showAlertError(
        getErrorMessage(error, "Não foi possível desconsiderar a solicitação."),
      );
    } finally {
      setIsUnconsidering(false);
    }
  };

  const canApprove = solicitation?.status === "waiting_approval";
  const canMarkSolved =
    solicitation?.status === "not_resolved" ||
    solicitation?.status === "in_progress";
  const canUnconsider =
    !!solicitation &&
    solicitation.status !== "unconsidered" &&
    solicitation.status !== "resolved";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <HeaderNavigation
          screenTitle={
            solicitation
              ? `Solicitação ${solicitation.protocolNumber}`
              : "Gerenciar solicitação"
          }
        />

        {isLoading ? (
          <section className="rounded-[2rem] border border-border-card/70 bg-bg-card p-8 text-center shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)]">
            <p className="text-sm text-foreground/65">
              Carregando detalhes da solicitação...
            </p>
          </section>
        ) : solicitation ? (
          <>
            <section className="flex flex-col gap-3 rounded-[2rem] border border-border-card/70 bg-white/80 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
                    <BuildingsIcon size={22} weight="fill" />
                    <span>Detalhes da solicitação</span>
                  </div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                    Solicitação {solicitation.protocolNumber}
                  </h1>
                  <p className="text-sm leading-6 text-foreground/70 sm:text-base">
                    Exibindo detalhes da solicitação{" "}
                    {solicitation.protocolNumber}.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
                  <button
                    type="button"
                    onClick={() => setSignaturesModalOpen(true)}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border border-foreground/15 bg-background px-5 py-3 text-sm font-medium text-foreground transition hover:bg-foreground/5"
                  >
                    <UsersThreeIcon size={18} weight="fill" />
                    Ver assinaturas ({signatures.length})
                  </button>

                  {canApprove && (
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm !bg-primary-500 px-5 py-3 text-sm font-medium !text-white transition hover:!bg-primary-600"
                    >
                      <ThumbsUpIcon size={18} weight="fill" />
                      Aprovar solicitação
                    </button>
                  )}

                  {canMarkSolved && (
                    <button
                      type="button"
                      onClick={handleOpenSolveModal}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-success-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-success-600"
                    >
                      <CheckCircleIcon size={18} weight="fill" />
                      Marcar como resolvida
                    </button>
                  )}

                  {canUnconsider && (
                    <button
                      type="button"
                      onClick={handleOpenUnconsiderModal}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border border-alert-500/30 bg-alert-500/10 px-5 py-3 text-sm font-medium text-alert-700 transition hover:bg-alert-500/15 dark:text-alert-100"
                    >
                      <ProhibitIcon size={18} weight="bold" />
                      Desconsiderar solicitação
                    </button>
                  )}
                </div>
              </div>
            </section>

            <SolicitationDetailsCard {...solicitation} />
          </>
        ) : (
          <section className="rounded-[2rem] border border-dashed border-border-card bg-bg-card p-10 text-center shadow-sm">
            <h3 className="text-lg font-bold">Solicitação não encontrada</h3>
            <p className="mt-2 text-sm text-foreground/65">
              O identificador informado não corresponde a nenhuma solicitação
              cadastrada.
            </p>
          </section>
        )}
      </div>

      {solveModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseSolveModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] border border-border-card/70 bg-bg-card p-6 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.6)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-xl font-black tracking-tight">
              Marcar como resolvida
            </h2>
            <p className="mt-2 text-sm text-foreground/65">
              Adicione ao menos uma imagem comprovando a resolução. O comentário
              é opcional.
            </p>

            <div className="mt-4 flex flex-col gap-4">
              <FileInput
                key={`solve-upload-${uploadKey}`}
                label="Imagens da resolução *"
                labelDescription="Anexe ao menos uma foto que comprove a resolução."
                buttonTitle={
                  isUploadingPhotos
                    ? "Carregando imagens..."
                    : "Selecionar imagens"
                }
                accept="image/*"
                multiple
                disabled={isUploadingPhotos}
                onUpload={handleUploadPhotos}
              />

              {solvedPhotos.length > 0 ? (
                <div className="flex flex-col gap-3 rounded-sm border border-border-card/60 bg-background/70 p-4 dark:bg-white/[0.02]">
                  {solvedPhotos.map((photo, index) => (
                    <UploadedFile
                      key={`${photo.uri}-${index}`}
                      file={photo}
                      onCancel={() => handleRemovePhoto(index)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-destructive-500">
                  Ao menos uma imagem é obrigatória para confirmar a resolução.
                </p>
              )}

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="solve-commentary"
                  className="text-sm font-medium text-foreground/80"
                >
                  Comentário de resolução{" "}
                  <span className="text-foreground/40">(opcional)</span>
                </label>
                <textarea
                  id="solve-commentary"
                  value={solvedCommentary}
                  onChange={(event) => setSolvedCommentary(event.target.value)}
                  placeholder="Descreva como a situação foi resolvida..."
                  rows={3}
                  className="w-full resize-none rounded-sm border border-border-card bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseSolveModal}
                disabled={isSolving}
                className="rounded-sm border border-foreground/15 bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground/5 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSolve}
                disabled={!canConfirmSolve}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-success-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-success-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircleIcon size={18} weight="fill" />
                {isSolving ? "Salvando..." : "Confirmar resolução"}
              </button>
            </div>
          </div>
        </div>
      )}

      {unconsiderModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => !isUnconsidering && setUnconsiderModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-[1.75rem] border border-border-card/70 bg-bg-card p-6 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.6)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-xl font-black tracking-tight">
              Desconsiderar solicitação
            </h2>
            <p className="mt-2 text-sm text-foreground/65">
              Informe o motivo pelo qual esta solicitação está sendo
              desconsiderada. O comentário é obrigatório e ficará registrado.
            </p>

            <div className="mt-4 flex flex-col gap-1.5">
              <label
                htmlFor="unconsider-commentary"
                className="text-sm font-medium text-foreground/80"
              >
                Comentário <span className="text-destructive-500">*</span>
              </label>
              <textarea
                id="unconsider-commentary"
                value={unconsiderCommentary}
                onChange={(event) =>
                  setUnconsiderCommentary(event.target.value)
                }
                placeholder="Descreva o motivo da desconsideração..."
                rows={4}
                autoFocus
                className="w-full resize-none rounded-sm border border-border-card bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
              />
              {unconsiderCommentary.trim().length === 0 && (
                <p className="text-xs text-destructive-500">
                  O comentário é obrigatório para desconsiderar a solicitação.
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setUnconsiderModalOpen(false)}
                disabled={isUnconsidering}
                className="rounded-sm border border-foreground/15 bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground/5 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmUnconsider}
                disabled={
                  isUnconsidering || unconsiderCommentary.trim().length === 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-alert-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-alert-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ProhibitIcon size={18} weight="bold" />
                {isUnconsidering
                  ? "Desconsiderando..."
                  : "Confirmar desconsideração"}
              </button>
            </div>
          </div>
        </div>
      )}

      {signaturesModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSignaturesModalOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] border border-border-card/70 bg-bg-card p-6 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.6)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-xl font-black tracking-tight">
              Assinaturas da solicitação
            </h2>
            <p className="mt-2 text-sm text-foreground/65">
              Pessoas que concordaram e assinaram esta solicitação.
            </p>

            <div className="mt-4">
              {signatures.length > 0 ? (
                <div className="flex max-h-[400px] flex-col gap-3 overflow-y-auto">
                  {signatures.map((signature) => (
                    <SignatureListCard
                      key={signature.id}
                      userName={signature.userName}
                      signatureImageUrl={signature.imageUrl}
                      signedAt={signature.createdAt}
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-sm border border-border-card/70 bg-background/70 px-4 py-6 text-center text-sm text-foreground/65 dark:bg-white/[0.02]">
                  Esta solicitação ainda não possui assinaturas.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSignaturesModalOpen(false)}
                className="rounded-sm border border-foreground/15 bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground/5"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
