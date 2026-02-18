"use client"

export function AnimatedCheckIcon() {
  return (
    <div className="flex items-center justify-center p-4">
      <style>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes rotateSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes strokeDraw {
          0% {
            stroke-dashoffset: 40;
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        .animated-bg-circle {
          animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animated-loading-ring {
          animation: rotateSpin 2.5s linear forwards 0.4s;
          transform-origin: center;
        }

        .animated-inner-circle {
          animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards;
        }

        .animated-check-stroke {
          animation: strokeDraw 0.8s cubic-bezier(0.65, 0, 0.35, 1) 0.5s forwards;
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
        }
      `}</style>

      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background circle - animates in */}
        <circle className="animated-bg-circle" cx="50" cy="50" r="36.25" fill="#E3F8EC" />

        {/* Loading ring path - rotates continuously */}
        <path
          className="animated-loading-ring"
          d="M50 -2.18557e-06C40.1109 -1.7533e-06 30.4439 2.93245 22.2215 8.42652C13.999 13.9206 7.5904 21.7295 3.80602 30.8658C0.0216391 40.0021 -0.968527 50.0555 0.960734 59.7545C2.89 69.4536 7.65203 78.3627 14.6447 85.3553C21.6373 92.348 30.5464 97.11 40.2455 99.0393C49.9445 100.969 59.9979 99.9784 69.1342 96.194C78.2705 92.4096 86.0794 86.001 91.5735 77.7785C97.0675 69.556 100 59.8891 100 50L95.8298 50C95.8298 59.0643 93.1419 67.925 88.1061 75.4617C83.0702 82.9983 75.9126 88.8725 67.5383 92.3412C59.164 95.81 49.9492 96.7175 41.0591 94.9492C32.1689 93.1808 24.0029 88.816 17.5934 82.4066C11.184 75.9971 6.81917 67.8311 5.05081 58.9409C3.28246 50.0508 4.19004 40.836 7.65879 32.4617C11.1275 24.0874 17.0017 16.9298 24.5383 11.8939C32.075 6.85808 40.9357 4.17021 50 4.17021L50 -2.18557e-06Z"
          fill="#E3F8EC"
        />

        {/* Inner circle around checkmark - animates in with slight delay */}
        <circle
          className="animated-inner-circle"
          cx="50"
          cy="50"
          r="20.4164"
          fill="none"
          stroke="#1DC660"
          strokeWidth="3"
        />

        {/* Checkmark - draws on with animation */}
        <path
          className="animated-check-stroke"
          d="M41.827 49.9996L47.006 54.6607C47.8877 55.4542 49.2575 55.3327 49.9858 54.3964L58.1731 43.8698"
          stroke="#1DC660"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  )
}
