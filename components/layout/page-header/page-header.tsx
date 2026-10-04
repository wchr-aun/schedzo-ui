import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons/arrow-icon";
import styles from "./page-header.module.css";

type PageHeaderProps = {
  backHref: string;
  backLabel: string;
  eyebrow?: string;
  subtitle?: string;
  title: string;
  imageUrl?: string | null;
};

export function PageHeader({ backHref, backLabel, eyebrow, subtitle, title, imageUrl }: PageHeaderProps) {
  return (
    <>
      <Link className={styles.backLink} href={backHref}>
        <ArrowIcon direction="left" /> {backLabel}
      </Link>
      <header className={styles.header}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={imageUrl ? styles.title : undefined}>
          {imageUrl ? <img src={imageUrl} alt="" width={48} height={48} decoding="async" referrerPolicy="no-referrer" /> : null}
          {title}
        </h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
    </>
  );
}
