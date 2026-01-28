import "./globals.css";

export const metadata = {
  title: "Novastra - Skill Gap Analyzer",
  description: "Identify and bridge your skill gaps with Novastra.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-textPrimary antialiased">
        {children}
      </body>
    </html>
  );
}
