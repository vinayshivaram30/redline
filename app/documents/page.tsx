import LogoutButton from "@/components/LogoutButton";

export default function DocumentsPage() {
  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Documents</h1>
        <LogoutButton />
      </div>
      <p className="mt-2 text-gray-600">Upload and library land here in Task 4 and Task 14.</p>
    </main>
  );
}
