"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { fetchScriptById, updateScript } from "@/lib/api/scripts/scriptService";
import { Script } from "@/types/script";

interface ScriptFormData {
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
}

export default function ScriptEditForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const scriptId = Number(id);
  const { data: session, status } = useSession();

  const [form, setForm] = useState<ScriptFormData>({
    title: "",
    goal: "",
    audience: "",
    tone: "",
    duration: "",
    section_durations: {
      intro: "",
      dev: "",
      conclusion: "",
    },
    intro_text: "",
    dev_text: "",
    conclusion_text: "",
    full_script: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scriptId || status !== "authenticated") return;

    fetchScriptById(session.accessToken!, scriptId)
      .then((script: Script) => {
        setForm({
          title: script.title || "",
          goal: script.goal || "",
          audience: script.audience || "",
          tone: script.tone || "",
          duration: script.duration || "",
          section_durations: {
            intro: script.section_durations?.intro || "",
            dev: script.section_durations?.dev || "",
            conclusion: script.section_durations?.conclusion || "",
          },
          intro_text: script.intro_text || "",
          dev_text: script.dev_text || "",
          conclusion_text: script.conclusion_text || "",
          full_script: script.full_script || "",
        });
      })
      .catch(() => setError(t("updateError")))
      .finally(() => setLoading(false));
  }, [scriptId, status, session?.accessToken, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('section_durations.')) {
      const field = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        section_durations: {
          ...prev.section_durations,
          [field]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      await updateScript(session.accessToken, scriptId, form);
      router.push("/scripts");
    } catch (err: any) {
      setError(err.message || t("updateError"));
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-tertiary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">{t("loading")}...</p>
        </div>
      </div>
    );
  }

  if (!form.title && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-tertiary-50 flex items-center justify-center">
        <p className="text-red-500 text-lg">{t("scriptNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-tertiary-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t("Edit Script")}
            </h1>
            <p className="text-gray-600">
              {t("updateScriptDetails")}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("title")}
                </label>
                <Input
                  name="title"
                  type="text"
                  placeholder={t("title")}
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("audience")}
                </label>
                <Input
                  name="audience"
                  type="text"
                  placeholder={t("audience")}
                  value={form.audience}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("tone")}
                </label>
                <Input
                  name="tone"
                  type="text"
                  placeholder={t("tone")}
                  value={form.tone}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("duration")}
                </label>
                <Input
                  name="duration"
                  type="text"
                  placeholder={t("duration")}
                  value={form.duration}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("goal")}
              </label>
              <textarea
                name="goal"
                placeholder={t("goal")}
                value={form.goal}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Section Durations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t("sectionDurations")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("intro")}
                  </label>
                  <Input
                    name="section_durations.intro"
                    type="text"
                    placeholder={t("introDuration")}
                    value={form.section_durations.intro}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("development")}
                  </label>
                  <Input
                    name="section_durations.dev"
                    type="text"
                    placeholder={t("devDuration")}
                    value={form.section_durations.dev}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("conclusion")}
                  </label>
                  <Input
                    name="section_durations.conclusion"
                    type="text"
                    placeholder={t("conclusionDuration")}
                    value={form.section_durations.conclusion}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Script Sections */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {t("Script Sections")}
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("Intro Text")}
                </label>
                <textarea
                  name="intro_text"
                  placeholder={t("Intro Text")}
                  value={form.intro_text}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("Dev Text")}
                </label>
                <textarea
                  name="dev_text"
                  placeholder={t("Dev Text")}
                  value={form.dev_text}
                  onChange={handleChange}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("Conclusion Text")}
                </label>
                <textarea
                  name="conclusion_text"
                  placeholder={t("Conclusion Text")}
                  value={form.conclusion_text}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("Full Script")}
                </label>
                <textarea
                  name="full_script"
                  placeholder={t("fullScript")}
                  value={form.full_script}
                  onChange={handleChange}
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
          className="flex-1 bg-[#78c400] hover:bg-[#599400] text-white font-semibold border border-[#5a9e00] shadow-sm"
                disabled={loading}
              >
                {loading ? `${t("updating")}...` : t("Update Script")}
              </Button>
              <Button
                type="button"
          className="flex-1 bg-[#EAEEEB] hover:bg-[#DCE0DC] text-gray-700"
                onClick={() => router.push("/scripts")}
              >
                {t("cancel")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}