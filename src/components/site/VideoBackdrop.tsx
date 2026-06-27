import type { ReactNode } from "react";

type VideoBackdropProps = {
  src?: string;
  poster?: string;
  className?: string;
  overlayClassName?: string;
  children?: ReactNode;
};

export function VideoBackdrop({
  src,
  poster,
  className = "",
  overlayClassName = "",
  children,
}: VideoBackdropProps) {
  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 15%, rgba(255,255,255,0.16), transparent 32%), radial-gradient(circle at 18% 28%, rgba(110,120,255,0.10), transparent 25%), linear-gradient(180deg, #08080b 0%, #020204 62%, #000 100%)",
        }}
      />

      {src ? (
        <video
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : null}

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
          backgroundSize: "78px 78px",
        }}
      />

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.52) 45%, rgba(0,0,0,0.18) 100%), linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      <div aria-hidden className={`absolute inset-0 ${overlayClassName}`} />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
