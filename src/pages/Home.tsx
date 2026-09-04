import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineDocumentText, HiOutlineTrash } from "react-icons/hi2";
import { FileUpload, PageLayout, TextArea } from "./shared";
import { useFileStore } from "../store";
import { useAuth } from "../context/AuthContext";
import { api, type DraftSummary } from "../lib/api";

export const Home = () => {
    const files = useFileStore((state) => state.files);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [drafts, setDrafts] = useState<DraftSummary[]>([]);
    const [draftsError, setDraftsError] = useState<string | null>(null);

    const loadDrafts = () => {
        api
            .listDrafts()
            .then((data) => {
                setDrafts(data.drafts);
                setDraftsError(null);
            })
            .catch((err) => {
                setDraftsError(err instanceof Error ? err.message : "Could not load drafts");
            });
    };

    useEffect(() => {
        loadDrafts();
    }, []);

    const handleDeleteDraft = async (id: string) => {
        try {
            await api.deleteDraft(id);
            setDrafts((prev) => prev.filter((d) => d.id !== id));
        } catch (err) {
            setDraftsError(err instanceof Error ? err.message : "Could not delete draft");
        }
    };

    return (
        <PageLayout
            title={`Welcome, ${user?.name ?? ""}`}
            subtitle="Upload files or paste text. We'll combine everything into one document"
            buttonLabel="Review sources"
            navigateTo="/review"
            buttonDisabled={files.length === 0}
        >
            {draftsError && (
                <p className="text-sm text-red-400 mb-4">{draftsError}</p>
            )}
            {drafts.length > 0 && (
                <section className="mb-12">
                    <h3 className="text-lg font-medium text-text-primary mb-4">Saved drafts</h3>
                    <div className="space-y-3">
                        {drafts.map((draft) => (
                            <div
                                key={draft.id}
                                className="flex items-center justify-between gap-3 p-4 rounded-xl bg-surface-elevated border border-border"
                            >
                                <button
                                    type="button"
                                    onClick={() => navigate(`/draft/${draft.id}`)}
                                    className="flex items-center gap-3 min-w-0 text-left cursor-pointer flex-1"
                                >
                                    <div className="p-2.5 rounded-lg bg-surface-glass shrink-0">
                                        <HiOutlineDocumentText className="text-xl text-accent" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-text-primary truncate">{draft.title}</p>
                                        <p className="text-sm text-text-muted">
                                            Last edited {new Date(draft.updatedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteDraft(draft.id)}
                                    className="p-2 rounded-lg text-red-500 hover:bg-red-400/10 cursor-pointer shrink-0"
                                    aria-label="Delete draft"
                                >
                                    <HiOutlineTrash className="text-lg" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <FileUpload />
            <TextArea
                label="Paste text (Optional)"
                placeholder="Notes, emails,copied sections, anything relevant"
                extraClassnames="mt-14"
            />
        </PageLayout>
    );
};
