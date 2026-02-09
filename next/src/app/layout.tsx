import CurrentUserFetch from "@/components/CurrentUserFetch";
import Header from "@/components/Header";
import ThemeRegistry from "./ThemeRegistry";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <ThemeRegistry>
          <CurrentUserFetch />
          <Header />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
