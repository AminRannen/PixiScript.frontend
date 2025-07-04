import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import UserEditForm from "@/components/pages/users/UserEditForm";

export default function EditUserPage() {
  return (
    <PrivateLayout>
      <div className="h-[80vh] flex items-center justify-center bg-gray-100">
        <UserEditForm />
      </div>
    </PrivateLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale ?? "en", ["common"])),
    },
  };
};
