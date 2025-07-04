import PrivateLayout from "@/components/layouts/PrivateLayout";
import CreateScriptForm from "@/components/pages/scripts/CreateScriptForm";
export default function NewScriptPage() {
  return (
    <PrivateLayout>
      <div className="min-h-screen bg-white p-6 max-w-4xl mx-auto">
        <CreateScriptForm />
      </div>
    </PrivateLayout>
  );
}
