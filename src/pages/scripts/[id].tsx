import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    };
}

export default function ScriptDetailPage({ script }: ScriptPageProps) {
    const router = useRouter();

    return (
        <PrivateLayout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-6">Script : {script.title}</h1>

                <Card className="mb-6">
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

                <Card>
                    <CardHeader>
                        <CardTitle>Contenu du Script</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="whitespace-pre-wrap text-gray-800">
                            {script.intro_text}
                            {script.dev_text}
                            {script.conclusion_text}

                        </pre>
                    </CardContent>
                </Card>
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
    const res = await fetch(`http://127.0.0.1:8000/api/scripts/${id}`, {
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
