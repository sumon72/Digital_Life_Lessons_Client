import Lottie from 'lottie-react'

export default function SuccessAnimation({ isVisible = false, onComplete = () => {} }) {
  // Simple success checkmark animation data
  const successAnimation = {
    v: '5.5.0',
    fr: 60,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: 'Success',
    ddd: false,
    assets: [],
    layers: [
      {
        ddd: false,
        ind: 1,
        ty: 4,
        nm: 'Shape Layer 1',
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [100, 100, 0], ix: 2 },
          a: { a: 0, k: [0, 0, 0], ix: 1 },
          s: { a: 0, k: [100, 100, 100], ix: 6 }
        },
        ao: 0,
        shapes: [
          {
            ty: 'gr',
            it: [
              {
                d: 1,
                ty: 'el',
                s: { a: 0, k: [200, 200], ix: 2 },
                p: { a: 0, k: [0, 0], ix: 3 },
                nm: 'Ellipse Path 1',
                mn: 'ADBE Vector Shape - Ellipse',
                hd: false
              },
              {
                ty: 'st',
                c: { a: 0, k: [0.22, 0.81, 0.42, 1], ix: 3 },
                o: { a: 0, k: 100, ix: 4 },
                w: { a: 0, k: 8, ix: 5 },
                lc: 1,
                lj: 1,
                ml: 4,
                bm: 0,
                nm: 'Stroke 1',
                mn: 'ADBE Vector Graphic - Stroke',
                hd: false
              },
              {
                ty: 'tr',
                p: { a: 0, k: [0, 0], ix: 2 },
                a: { a: 0, k: [0, 0], ix: 1 },
                s: { a: 0, k: [100, 100], ix: 3 },
                r: { a: 0, k: 0, ix: 6 },
                o: { a: 0, k: 100, ix: 7 },
                sk: { a: 0, k: 0, ix: 4 },
                sa: { a: 0, k: 0, ix: 5 },
                nm: 'Transform'
              }
            ],
            nm: 'Circle',
            np: 3,
            cix: 2,
            bm: 0,
            ix: 1,
            mn: 'ADBE Vector Group',
            hd: false
          },
          {
            ty: 'tm',
            s: { a: 1, k: [{ i: { x: [0.25], y: [1] }, o: { x: [0.75], y: [0] }, t: 0, s: [0] }, { t: 30, s: [100] }], ix: 1 },
            e: { a: 0, k: 100, ix: 2 },
            o: { a: 0, k: 0, ix: 3 },
            m: 1,
            ix: 2,
            nm: 'Trim Paths 1',
            mn: 'ADBE Vector Filter - Trim',
            hd: false
          }
        ],
        ip: 0,
        op: 30,
        st: 0,
        bm: 0
      }
    ],
    markers: []
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm">
        <div className="flex justify-center mb-4">
          <Lottie
            animationData={successAnimation}
            loop={false}
            autoplay={true}
            onComplete={onComplete}
            style={{ width: 120, height: 120 }}
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Success! 🎉</h2>
        <p className="text-gray-600">Your lesson has been created successfully!</p>
      </div>
    </div>
  )
}
