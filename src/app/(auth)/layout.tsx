import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sign In — CreatingHarmony' }

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        backgroundImage: 'url(/HARMONYBACKGROUND.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#050816',
      }}
    >
      {/* Right-side panel — sits over the dark right portion of the image */}
      <div
        style={{
          position: 'absolute',
          // Image is 1536×1024 (aspect 1.5). With background-size:contain centered on
          // wide viewports (aspect > 1.5), the blue divider at x=965 lands at:
          // offset_x = (100vw - 150vh)/2 = 50vw - 75vh
          // line = offset_x + (965/1536)*150vh = 50vw - 75vh + 94.24vh = 50vw + 19.24vh
          left: 'calc(50vw + 19.24vh)',
          right: 0,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 32px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          minWidth: 0,
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
