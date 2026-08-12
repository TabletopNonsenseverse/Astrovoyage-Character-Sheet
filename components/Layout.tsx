import Link from 'next/link'; import type {ReactNode} from 'react';
export default function Layout({children}:{children:ReactNode}){return <main className="terminal"><header className="top"><Link href="/" className="brand">ASTROVOYAGE</Link><div className="status">● LOCAL STATE ENABLED</div></header><div className="content">{children}</div></main>}
