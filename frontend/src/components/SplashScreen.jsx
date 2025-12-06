import { useEffect, useState } from 'react'

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => {
        setVisible(false)
        onFinish()
      }, 1000)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onFinish])

  if (!visible) return null

  return (
    <div
      className={`splash-container ${fadeOut ? 'fade-out' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 1s ease'
      }}
    >
      <video
        autoPlay
        muted
        playsInline
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <source src="/videos/intro.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>
    </div>
  )
}
