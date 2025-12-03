import "./globals.css";
import NavbarUsr from "@/components/user/NavbarUsr";
import FooterUsr from "@/components/user/FooterUsr";

export const metadata = {
  title: "Bengkel App",
  description: "Website Bengkel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">

        <NavbarUsr />

        <main className="container mx-auto p-4 grow">
          {children}
        </main>

        <FooterUsr />

      </body>
    </html>
  );
}
