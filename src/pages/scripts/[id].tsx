import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

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

// ... (keep all imports and interface unchanged)

export default function ScriptDetailPage({ script }: ScriptPageProps) {
    const router = useRouter();
    const [selectedText, setSelectedText] = useState("");
    const [prompt, setPrompt] = useState("");
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

    const handleImproveScript = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/scripts/improve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify({
                    prompt,
                    full_script: selectedText || script.full_script,
                }),
            });

            const data = await response.json();
            alert(data.modified_script || "Script modifié !");
        } catch (error) {
            console.error("Erreur d'amélioration :", error);
            alert("Une erreur est survenue pendant l'amélioration du script.");
        }
    };

    return (
        <PrivateLayout>
            <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
                <h1 className="text-3xl font-bold">Script : {script.title}</h1>

                {/* Informations Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-gray-700">
                        <p><strong>🎯 Objectif:</strong> {script.goal}</p>
                        <p><strong>👥 Audience:</strong> {script.audience}</p>
                        <p><strong>🎤 Ton:</strong> {script.tone}</p>
                        <p><strong>⏱️ Durée totale:</strong> {script.duration}</p>
                        <p><strong>📊 Durées des sections:</strong></p>
                        <ul className="ml-4 list-disc">
                            <li>Intro: {script.section_durations.intro}s</li>
                            <li>Dév: {script.section_durations.dev}s</li>
                            <li>Conclusion: {script.section_durations.conclusion}s</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Script Content Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contenu du Script</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div
                            className="whitespace-pre-wrap text-gray-800 cursor-text border p-4 rounded-md bg-gray-50"
                            onMouseUp={() => {
                                const selection = window.getSelection();
                                if (selection && selection.toString().length > 0) {
                                    setSelectedText(selection.toString());
                                    alert(`Selected: ${selection.toString()}`);
                                }
                            }}
                        >
                            {script.full_script}
                        </div>

                        {/* Prompt input */}
                        <div className="space-y-2">
                            <label htmlFor="improvementPrompt" className="block text-sm font-medium text-gray-700">
                                🧠 Donnez une instruction pour améliorer le script :
                            </label>
                            <textarea
                                id="improvementPrompt"
                                name="improvementPrompt"
                                rows={3}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Exemple : Rends l’introduction plus chaleureuse"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            ></textarea>

                            <button
                                onClick={handleImproveScript}
                                className="px-6 py-2 bg-[#78c400] hover:bg-[#599400] text-white shadow-md rounded-md transition-colors duration-200"
                                disabled={!prompt}
                            >
                                ✨ Améliorer le script
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Share section */}
                <div className="border border-gray-200 rounded-md p-6 bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">🔗 Partager ce script</h2>
                    <button
                        onClick={() => router.push(`/scripts/${script.id}/share`)}
                        className="bg-[#00968F] hover:bg-[#00625D] text-white px-4 py-2 rounded-md"
                    >
                        Partager maintenant
                    </button>
                </div>
            </div>
        </PrivateLayout>
    );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

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
        },
    };
};
