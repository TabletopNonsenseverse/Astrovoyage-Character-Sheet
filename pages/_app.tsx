import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import '../styles/globals.css'

const PLAYTEST_URL =
  'https://tabletopnonsenseverse.myshopify.com/products/astrovoyage'

export default function App({ Component, pageProps }: AppProps) {
  const [showPlaytestPopup, setShowPlaytestPopup] = useState(false)

  useEffect(() => {
    // Only show the promotion once per browser session.
    const alreadySeen = sessionStorage.getItem('astrovoyage-playtest-popup-seen')

    if (!alreadySeen) {
      const timer = window.setTimeout(() => {
        setShowPlaytestPopup(true)
      }, 900)

      return () => window.clearTimeout(timer)
    }
  }, [])

  const closePopup = () => {
    sessionStorage.setItem('astrovoyage-playtest-popup-seen', 'true')
    setShowPlaytestPopup(false)
  }

  return (
    <>
      {/* Prominent playtest banner */}
      <div className="playtest-banner">
        <div className="playtest-banner-content">
          <div className="playtest-banner-text">
            <span className="playtest-banner-label">
              ASTROVOYAGE PLAYTEST
            </span>

            <span className="playtest-banner-message">
              Get the playtest version of Astrovoyage here.
            </span>
          </div>

          <a
            href={PLAYTEST_URL}
            target="_blank"
            rel="noreferrer"
            className="playtest-button"
          >
            Get the Playtest
          </a>
        </div>
      </div>

      {/* Main application */}
      <Component {...pageProps} />

      {/* Playtest promotion popup */}
      {showPlaytestPopup && (
        <div
          className="playtest-modal-backdrop"
          onClick={closePopup}
          role="presentation"
        >
          <div
            className="playtest-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="playtest-modal-title"
          >
            <button
              type="button"
              className="playtest-modal-close"
              onClick={closePopup}
              aria-label="Close"
            >
              ×
            </button>

            <div className="playtest-modal-scanline" />

            <div className="playtest-modal-eyebrow">
              ASTROVOYAGE // PLAYTEST ACCESS
            </div>

            <h2 id="playtest-modal-title">
              PLAY THE FULL
              <br />
              ASTROVOYAGE
              <br />
              PLAYTEST
            </h2>

            <div className="playtest-modal-divider" />

            <p>
              Like what you're seeing?
            </p>

            <p className="playtest-modal-description">
              Get the full playtest version of Astrovoyage and help us shape
              the game.
            </p>

            <a
              href={PLAYTEST_URL}
              target="_blank"
              rel="noreferrer"
              className="playtest-modal-button"
              onClick={closePopup}
            >
              GET THE PLAYTEST
            </a>

            <button
              type="button"
              className="playtest-later-button"
              onClick={closePopup}
            >
              Maybe later
            </button>

            <div className="playtest-modal-footer">
              ASTROVOYAGE // PERSONNEL DOSSIER // ONLINE
            </div>
          </div>
        </div>
      )}
    </>
  )
}
