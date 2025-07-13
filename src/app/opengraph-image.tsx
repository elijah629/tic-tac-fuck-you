import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Image metadata
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  // Font loading, process.cwd() is Next.js project directory
  const m6x11 = await readFile(
    join(process.cwd(), 'src/app/m6x11plus.ttf')
  );

  return new ImageResponse(
    (
      // ImageResponse JSX element
  <div style={{
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    color: "white",
    background: 'linear-gradient(136.53deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.2) 100%), linear-gradient(312.01deg, #7300ff 0%, rgba(115,0,255,0.75) 100%)',
    backgroundColor: '#7300ff'
}}>
        <img width={140} height={140} alt="" style={{
          marginTop: 20,
        }} src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/c02db78fb952ca94044988cebd4331967ed1cdda_icon-removebg-preview.png"/>
    <div style={{
      display: "flex",
      flexDirection: "column"
    }}>
      <span style={{
        fontSize: 128,
      }}>Tic Tac F<span style={{ color: "#ffa2a2" }} >*</span><span style={{ color: "#8ec5ff" }}>&deg;</span>k You</span>
      <span style={{
        fontSize: 48,
        marginLeft: 3,
      }}>Tic Tac Toe for the strong willed. Play today!</span>
    </div>
</div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: 'm6x11plus',
          data: m6x11,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
