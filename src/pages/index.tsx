import { getSession, signOut } from "next-auth/react";
import { GetServerSideProps } from "next";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ChartTest } from "@/components/ChartTest";
import { useTranslation } from 'react-i18next';

export default function Home({ user }: { user: any }) {
    const { t } = useTranslation();

  return (
    <ProtectedRoute>
    <div className="p-6">
      <h1 className="text-2xl">{t("welcome")}, {user.name}</h1>
      <p>Email: {user.email}</p>
      <button
        onClick={() => signOut()}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
    </ProtectedRoute>
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

  return {
    props: {
      user: session.user,
    },
  };
};
Home.getLayout = function getLayout(page: React.ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};