import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFileStore } from "../store";
import { api, getFileFromDB, readFileContent } from "../lib";
import { PageLayout } from "./shared";
import { RichTextEditor, DownloadModal } from "../components";

export const DraftModification = () => {
    const { id: draftId } = useParams();
    const navigate = useNavigate();
    const files = useFileStore((state) => state.files);
    const note = useFileStore((state) => state.note);
    const sourceOrder = useFileStore((state) => state.sourceOrder);

    const [htmlContent, setHtmlContent] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [retryKey, setRetryKey] = useState(0);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const loadedIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!draftId) return;
        if (loadedIdRef.current === draftId) {
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        const loadDraft = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const { draft } = await api.getDraft(draftId);
                if (cancelled) return;
                setHtmlContent(draft.htmlContent);
                loadedIdRef.current = draftId;
                setIsLoading(false);
            } catch (err) {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : "Failed to load draft");
                setIsLoading(false);
            }
        };

        loadDraft();
        return () => {
            cancelled = true;
        };
    }, [draftId, retryKey]);

    useEffect(() => {
        if (draftId) return;

        const compileContent = async () => {
            try {
                const htmlParts: string[] = [];

                const orderedItems = sourceOrder.length > 0
                    ? sourceOrder.filter((item) => {
                        if (item.type === "note") return note.trim().length > 0;
                        return files.some((f) => f.name === item.name);
                    })
                    : [
                        ...files.map((f) => ({ type: "file" as const, name: f.name, size: f.size })),
                        ...(note.trim() ? [{ type: "note" as const }] : []),
                    ];

                for (const item of orderedItems) {
                    if (item.type === "note") {
                        htmlParts.push(`<h2>Additional Notes</h2>`);
                        const paragraphs = note
                            .split(/\n\n+/)
                            .map(p => p.trim())
                            .filter(p => p.length > 0)
                            .map(p => `<p>${p.replace(/\n/g, "<br />")}</p>`)
                            .join("");
                        htmlParts.push(paragraphs);
                    } else {
                        const fileObj = await getFileFromDB(item.name);
                        if (fileObj) {
                            const content = await readFileContent(fileObj);

                            htmlParts.push(`<h2>${content.fileName}</h2>`);

                            if (content.type === "image") {
                                htmlParts.push(`<p><img src="${content.content}" alt="${content.fileName}" style="max-width: 100%; height: auto;" /></p>`);
                            } else {
                                const paragraphs = content.content
                                    .split(/\n\n+/)
                                    .map(p => p.trim())
                                    .filter(p => p.length > 0)
                                    .map(p => `<p>${p.replace(/\n/g, "<br />")}</p>`)
                                    .join("");
                                htmlParts.push(paragraphs);
                            }
                        }
                    }
                }

                setHtmlContent(htmlParts.join(""));
                setIsLoading(false);
            } catch (err) {
                console.error("Error compiling content:", err);
                setError(err instanceof Error ? err.message : "Failed to compile content");
                setIsLoading(false);
            }
        };

        compileContent();
    }, [draftId, files, note, sourceOrder, retryKey]);

    const handleDownloadClick = () => {
        setIsDownloadModalOpen(true);
    };

    const handleSaveDraft = async () => {
        if (!htmlContent) return;
        setSaving(true);
        setSaveMessage(null);
        try {
            if (draftId) {
                await api.updateDraft(draftId, {
                    htmlContent,
                    note,
                    sourceOrder,
                });
                setSaveMessage("Draft saved");
            } else {
                const { draft } = await api.createDraft({
                    htmlContent,
                    note,
                    sourceOrder,
                });
                loadedIdRef.current = draft.id;
                setSaveMessage("Draft saved");
                navigate(`/draft/${draft.id}`, { replace: true });
            }
        } catch (err) {
            setSaveMessage(err instanceof Error ? err.message : "Could not save draft");
        } finally {
            setSaving(false);
        }
    };

    if (isLoading) {
        return (
            <PageLayout
                title="Generating Draft"
                subtitle={draftId ? "Loading your saved draft..." : "Compiling your sources..."}
                previousPage={draftId ? "/" : "/review"}
            >
                <div className="flex flex-col justify-center items-center py-20">
                    <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-text-muted text-sm">
                        {draftId ? "Opening your draft..." : "Weaving your documents together..."}
                    </p>
                </div>
            </PageLayout>
        );
    }

    if (error) {
        const handleRetry = () => {
            loadedIdRef.current = null;
            setError(null);
            setIsLoading(true);
            setRetryKey((k) => k + 1);
        };

        return (
            <PageLayout
                title="Error"
                subtitle="Something went wrong"
                buttonLabel="Try Again"
                onButtonClick={handleRetry}
                previousPage={draftId ? "/" : "/review"}
            >
                <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                    {error}
                </div>
            </PageLayout>
        );
    }

    return (
        <>
            <PageLayout
                title="Your Draft"
                subtitle="Review and edit your compiled document. Save a draft if you are not finished."
                buttonLabel={htmlContent ? "Download" : undefined}
                onButtonClick={handleDownloadClick}
                secondaryButtonLabel={htmlContent ? (saving ? "Saving..." : "Save draft") : undefined}
                onSecondaryButtonClick={handleSaveDraft}
                secondaryButtonDisabled={saving}
                previousPage={draftId ? "/" : "/review"}
            >
                {htmlContent ? (
                    <RichTextEditor
                        key={draftId ?? "new-draft"}
                        content={htmlContent}
                        onChange={(html) => setHtmlContent(html)}
                    />
                ) : (
                    <div className="text-center py-16 text-text-muted">
                        <p className="text-lg">No content to display</p>
                        <p className="text-sm mt-1">Please add some files or text to get started</p>
                    </div>
                )}
                {saveMessage && (
                    <p className="mt-4 text-sm text-text-secondary text-right">{saveMessage}</p>
                )}
            </PageLayout>

            <DownloadModal
                isOpen={isDownloadModalOpen}
                onClose={() => setIsDownloadModalOpen(false)}
                htmlContent={htmlContent}
            />
        </>
    );
};
