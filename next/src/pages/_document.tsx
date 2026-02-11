import {
  DocumentHeadTags,
  DocumentHeadTagsProps,
  documentGetInitialProps,
} from "@mui/material-nextjs/v16-pagesRouter";
import { Html, Head, Main, NextScript } from "next/document";
import type { DocumentContext } from "next/document";

export default function MyDocument(props: DocumentHeadTagsProps) {
  return (
    <Html lang="ja">
      <Head>
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};
