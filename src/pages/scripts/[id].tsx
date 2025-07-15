import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { improveScript, downloadScriptPdf } from "@/lib/api/scripts/scriptService";
import { Loader2 } from "lucide-react";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface ScriptPageProps {
    script: {
        id: number;
        title: string;
        goal: string;
        audience: string;
        tone: string;
        duration: string;
        section_durations: {
            intro: string;
            dev: string;
            conclusion: string;
        };
        intro_text: string;
        dev_text: string;
        conclusion_text: string;
        full_script: string;
    };
}

export default function ScriptDetailPage({ script }: ScriptPageProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const { t } = useTranslation();
    const [selectedText, setSelectedText] = useState("");
    const [prompt, setPrompt] = useState("");
    const [isImproving, setIsImproving] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleImproveScript = async () => {
        if (!session?.accessToken) return alert(t('pleaseLoginToCreateScript'));
        setIsImproving(true);

        try {
            const modified = await improveScript(
                session.accessToken,
                script.id,
                prompt
            );
            alert(modified);
            window.location.reload();
        } catch (error) {
            console.error(t('errorOccurredWhileCreatingScript'), error);
            alert(t('scriptGenerationFailed'));
        } finally {
            setIsImproving(false);
        }
    };

    const handleDownloadPdf = async () => {
        if (!session?.accessToken) return alert(t('pleaseLoginToCreateScript'));
        setIsDownloading(true);

        try {
            await downloadScriptPdf(session.accessToken, script.id);
        } catch (error) {
            console.error(t('errorOccurredWhileCreatingScript'), error);
            alert(t('scriptSaveFailed'));
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <PrivateLayout>
            <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
                <h1 className="text-3xl font-bold">{t('script')} : {script.title}</h1>

                {/* Informations Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('generalInformation')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-gray-700">
                        <p><strong>🎯 {t('goal')}:</strong> {script.goal}</p>
                        <p><strong>👥 {t('audience')}:</strong> {script.audience}</p>
                        <p><strong>🎤 {t('tone')}:</strong> {script.tone}</p>
                        <p><strong>⏱️ {t('totalDuration')}:</strong> {script.duration}</p>
                        <p><strong>📊 {t('sectionDurations')}:</strong></p>
                        <ul className="ml-4 list-disc">
                            <li>{t('introductionSeconds')}: {script.section_durations.intro}s</li>
                            <li>{t('developmentSeconds')}: {script.section_durations.dev}s</li>
                            <li>{t('conclusionSeconds')}: {script.section_durations.conclusion}s</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Script Content Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('generatedScript')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div
                            className="whitespace-pre-wrap text-gray-800 cursor-text border p-4 rounded-md bg-gray-50"
                            onMouseUp={() => {
                                const selection = window.getSelection();
                                if (selection && selection.toString().length > 0) {
                                    setSelectedText(selection.toString());
                                    alert(`${t('selectedText')} : ${selection.toString()}`);
                                }
                            }}
                        >
                            {script.full_script}
                        </div>

                        {/* Prompt input */}
                        <div className="space-y-2">
                            <label htmlFor="improvementPrompt" className="block text-sm font-medium text-gray-700">
                                🧠 {t('Improve Script Prompt')} :
                            </label>
                            <textarea
                                id="improvementPrompt"
                                name="improvementPrompt"
                                rows={3}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={t('Improve Script Placeholder')}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            ></textarea>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleImproveScript}
                                    className="px-6 py-2 bg-[#78c400] hover:bg-[#599400] text-white shadow-md rounded-md transition-colors duration-200 "
                                    disabled={!prompt || isImproving}
                                >
                                    {isImproving ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="animate-spin h-4 w-4" />
                                            {t('inProgress')}...
                                        </div>
                                    ) : (
                                        `✨ ${t('Improve Script')}`
                                    )}
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Share section */}
                <div className="border border-gray-200 rounded-md p-6 bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">{t('actions')}</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push(`/scripts/${script.id}/share`)}
                            className="bg-[#00625D] hover:bg-[#00968F] text-white px-4 py-2 rounded-md"
                        >
                          ➦  {t('shareNow')}
                        </button>
                        <button
                            onClick={handleDownloadPdf}
                            disabled={isDownloading}
                            className="bg-[#3D473F] hover:bg-[#708573] text-white px-4 py-2 rounded-md"
                        >
                            {isDownloading ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    {t('downloading')}...
                                </>
                            ) : (
                                `💾 ${t('downloadPDF')}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </PrivateLayout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const { locale } = context;

    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    const { id } = context.params!;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

    const res = await fetch(`${API_BASE_URL}/scripts/${id}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    });

    if (!res.ok) {
        return {
            notFound: true,
        };
    }

    const data = await res.json();

    return {
        props: {
            script: data.data,
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};