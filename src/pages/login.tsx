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
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from 'react-i18next';

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login({ csrfToken }: { csrfToken: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const getRedirectPath = (role: string) => {
    switch (role) {
      case "admin":
        return "/dashboard";
      case "marketer":
        return "/scripts"; // or "/profile" based on your preference
      default:
        return "/scripts"; // default fallback
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError("");

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.ok) {
        // Get the updated session to access user role
        const session = await getSession();
        const userRole = session?.user?.roles?.[0] || session?.user?.primary_role;
        
        if (userRole) {
          const redirectPath = getRedirectPath(userRole);
          router.push(redirectPath);
        } else {
          // Fallback if no role is found
          router.push("/scripts");
        }
      } else {
        setLoginError("Identifiants invalides");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="h-[80vh] flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full flex justify-end px-8">
          <LanguageSwitcher />
        </div>

        <form
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
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          {loginError && <p className="text-sm text-red-600 text-center">{loginError}</p>}

          <PrimaryButton 
            className="px-6 py-2 bg-[#78c400] hover:bg-[#5B9200] text-[#F7F7F7] duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? t('signIn') || 'Signing in...' : t('signIn')}
          </PrimaryButton>
        </form>
      </div>
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    // Role-based redirect on server side as well
    const userRole = session?.user?.roles?.[0] || session?.user?.primary_role;
    let destination = "/scripts"; // default

    if (userRole === "admin") {
      destination = "/dashboard";
    } else if (userRole === "marketer") {
      destination = "/";
    }

    return {
      redirect: {
        destination,
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