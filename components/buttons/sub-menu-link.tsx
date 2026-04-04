'use client'

'use client'

import Link from "next/link";
import { buttonClass, textClass } from "./sub-menu-button";

export default function SubMenuLink({
  title,
  hrefString,
  onClick,
}: {
  title: string;
  hrefString: string;
  onClick: () => void;
}) {

    return (
        <Link href={hrefString} onClick={onClick} className={buttonClass}>
            <p className={textClass}>{title}</p>
        </Link>
    );
}