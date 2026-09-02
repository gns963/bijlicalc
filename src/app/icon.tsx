import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

/**
 * A meter/gauge glyph, not a generic icon — echoes the rolling-digit meter
 * that's already this site's visual signature (MeterDial), built purely
 * from the real brand tokens (ink-navy / brass / spark-teal).
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#02353c',
          borderRadius: 7,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke="#2eaf7d" strokeWidth="3.2" />
          <line
            x1="12"
            y1="12"
            x2="17.2"
            y2="7"
            stroke="#3fd0c9"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="2.1" fill="#3fd0c9" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
