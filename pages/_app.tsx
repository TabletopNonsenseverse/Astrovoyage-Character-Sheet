import type { AppProps } from 'next/app'
import '../styles/globals.css'

const PLAYTEST_URL = 'https://tabletopnonsenseverse.myshopify.com/products/astrovoyage'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="playtest-banner">
        <span>Get the playtest version of Astrovoyage here.</span>
        <a
          href={PLAYTEST_URL}
          target="_blank"
          rel="noreferrer"
          className="playtest-button"
        >
          Get the Playtest
        </a>
      </div>
      <Component {...pageProps} />
    </>
  )
}
