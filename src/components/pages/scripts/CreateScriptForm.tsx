"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  Target,
  Users,
  Volume2,
  FileText,
  Play,
  MessageSquare,
  Loader2,
  Layers,
} from "lucide-react";
import { generateScript } from "@/lib/api/scripts/scriptService";
import { ScriptFormData } from "@/types/script";

export default function CreateScriptForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    goal: "",
    audience: "",
    tone: "",
    duration: "",
    script_type: "portrait",
    section_durations: {
      intro: "",
      dev: "",
      conclusion: "",
    },
  });

  useEffect(() => {
    const { intro, dev, conclusion } = form.section_durations;
    const introSeconds = parseInt(intro) || 0;
    const devSeconds = parseInt(dev) || 0;
    const conclusionSeconds = parseInt(conclusion) || 0;

    const totalSeconds = introSeconds + devSeconds + conclusionSeconds;

    if (totalSeconds > 0) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      let durationText = "";
      if (minutes > 0) {
        durationText = `${minutes} ${t("minute")}${minutes > 1 ? "s" : ""}`;
        if (seconds > 0) {
          durationText += ` ${seconds} ${t("second")}${seconds > 1 ? "s" : ""}`;
        }
      } else if (seconds > 0) {
        durationText = `${seconds} ${t("second")}${seconds > 1 ? "s" : ""}`;
      }

      setForm((prev) => ({ ...prev, duration: durationText }));
    } else {
      setForm((prev) => ({ ...prev, duration: "" }));
    }
  }, [form.section_durations, t]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (["intro", "dev", "conclusion"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        section_durations: {
          ...prev.section_durations,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (status !== "authenticated" || !session) {
    alert(t("pleaseLoginToCreateScript") || "Please log in to create a script.");
    return;
  }

  setIsSubmitting(true);

  try {
    const formData: ScriptFormData = {
      title: form.title,
      goal: form.goal,
      audience: form.audience,
      tone: form.tone,
      duration: form.duration,
      script_type: form.script_type,
      section_durations: form.section_durations,
      user_id: session.user.id,
    };

    const response = await generateScript(session.accessToken, formData);
        console.log("API Response:", response); // Add this line

    // Make sure we have the script ID before redirecting
    if (!response?.id) {
      throw new Error("Script ID not returned from server");
    }

    // Redirect to the script details page
    router.push(`/scripts/${response.id}`);

  } catch (error) {
    console.error("Error:", error);
    alert(t("errorOccurredWhileCreatingScript") || "An error occurred while creating the script.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Info Card */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-blue-600" />
            {t("generalInformation")}
          </CardTitle>
          <CardDescription>
            {t("defineMainCharacteristics")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("title")}</Label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder={t("exProductXPresentation")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t("totalDuration")}
              </Label>
              <Input
                name="duration"
                value={form.duration}
                readOnly
                className="bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder={t("ex5Minutes")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="script_type" className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              {t("Script Type")}
            </Label>
            <select
              name="script_type"
              value={form.script_type}
              onChange={handleChange}
              required
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="portrait">👤 Portrait</option>
              <option value="capsule">🎬 Capsule vidéo</option>
              <option value="promotionnelle">📢 Vidéo promotionnelle</option>
              <option value="interview">🎤 Interview</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal" className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {t("goal")}
              </Label>
              <Input
                name="goal"
                value={form.goal}
                onChange={handleChange}
                required
                placeholder={t("exInform")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {t("audience")}
              </Label>
              <Input
                name="audience"
                value={form.audience}
                onChange={handleChange}
                required
                placeholder={t("exProfessionals")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone" className="flex items-center gap-1">
                <Volume2 className="h-4 w-4" />
                {t("tone")}
              </Label>
              <Input
                name="tone"
                value={form.tone}
                onChange={handleChange}
                required
                placeholder={t("exFormal")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Durations Card */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Play className="h-5 w-5 text-purple-600" />
            {t("sectionDurations")}
          </CardTitle>
          <CardDescription>{t("defineDurationPerSection")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intro">{t("introductionSeconds")}</Label>
              <Input
                type="number"
                name="intro"
                value={form.section_durations.intro}
                onChange={handleChange}
                placeholder={t("ex30")}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dev">{t("developmentSeconds")}</Label>
              <Input
                type="number"
                name="dev"
                value={form.section_durations.dev}
                onChange={handleChange}
                placeholder={t("ex180")}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conclusion">{t("conclusionSeconds")}</Label>
              <Input
                type="number"
                name="conclusion"
                value={form.section_durations.conclusion}
                onChange={handleChange}
                placeholder={t("ex30")}
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit / Loading */}
      {isSubmitting && (
        <div className="flex items-center gap-2 text-blue-600 mt-4">
          <Loader2 className="animate-spin h-5 w-5" />
          <span>{t("generatingScriptInProgress")}</span>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          onClick={() => router.back()}
          className="bg-[#A8A8A8] hover:bg-[#8B8B8B] text-white font-medium border border-[#8B8B8B] shadow-sm transition-all duration-200 hover:shadow-md"
        >
          {t("cancel")}
        </Button>
        <Button
          type="submit"
          className="px-6 py-2 bg-[#78c400] hover:bg-[#599400] text-white shadow-lg rounded-md transition-colors duration-200"
          disabled={isSubmitting}
        >
          {t("createScript")}
        </Button>
      </div>
    </form>
  );
}