import Navbar from "../Navbar"; // if you have one

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">{children}</main>
      <footer className="bg-gray-200 text-center py-4">© 2025 All rights reserved</footer>
    </div>
  );
}
