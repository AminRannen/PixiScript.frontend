"use client";

import PrivateLayout from "@/components/layouts/PrivateLayout";
import UserForm from "@/components/pages/users/UserForm";

export default function CreateUserPage() {
  return (
    <PrivateLayout>
      <div className="h-[80vh] flex items-center justify-center bg-gray-100">
        <UserForm />
      </div>
    </PrivateLayout>
  );
}
