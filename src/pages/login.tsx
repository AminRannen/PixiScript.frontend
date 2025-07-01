"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCsrfToken, getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import PublicLayout from "@/components/layouts/PublicLayout";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useState } from "react";
import type { ReactElement } from "react";
import { Input } from "@/components/ui/input";
import LanguageSwitcher from "@/components/LanguageSwitcher"; // ✅ import it
import { useTranslation } from 'react-i18next';
// 💡 1. Définir le schéma de validation Zod
const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

// 💡 2. Déduire le type à partir de Zod
type LoginFormData = z.infer<typeof loginSchema>;

export default function Login({ csrfToken }: { csrfToken: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setLoginError("Identifiants invalides");
    }
  };

  return (
    <PublicLayout>
      <div className="h-[80vh] flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full flex justify-end px-8">
          <LanguageSwitcher /> {/* ✅ Language toggle here */}
        </div>        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-xl shadow-md w-[400px] space-y-4"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">{t('login')}</h1>

          <div>
            <Input
              type="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          {loginError && <p className="text-sm text-red-600 text-center">{loginError}</p>}

          <PrimaryButton type="submit">{t('signIn')}</PrimaryButton>

          <SecondaryButton onClick={() => router.push("/register")}>
            {t('signUp')}
          </SecondaryButton>
        </form>
      </div>
    </PublicLayout>
  );
}

// 📌 Redirection si déjà connecté
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};
