import type { Metadata } from "next";
import { SavingsPotArticle } from "@/components/landing/savings-pot-article/savings-pot-article";
import { instantAccessArticle } from "@/lib/content/instant-access-article";
import { siteOrigin } from "@/lib/seo/site";

const { title, description, path, modifiedDate, author, imagePath, imageAlt } = instantAccessArticle;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path,
    siteName: "Schedzo",
    type: "article",
    modifiedTime: modifiedDate,
    authors: [author.url],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: imagePath, alt: imageAlt }],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": new URL(`${path}#article`, siteOrigin).href,
  url: new URL(path, siteOrigin).href,
  headline: instantAccessArticle.headline,
  description,
  dateModified: modifiedDate,
  author: { "@type": "Person", name: author.name, url: author.url },
  image: new URL(imagePath, siteOrigin).href,
  inLanguage: "en-GB",
};

export default function SavingsPotWithdrawalsPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
    <SavingsPotArticle />
  </>;
}
