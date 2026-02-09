import Antigravity from "./Antigravity";
import Uco from "../../assets/Uco icon.svg";

interface PublicHeroProps {
  onLogin: () => void;
  onRegister: () => void;
}

const PublicHero = ({ onLogin, onRegister }: PublicHeroProps) => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f1f2f9_45%,#eae7ff_100%)]">
      <div className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-[#7B6CFF] opacity-20 blur-[120px] float-slow" />
      <div className="absolute bottom-[-8rem] right-[-6rem] h-[30rem] w-[30rem] rounded-full bg-[#5B3FFF] opacity-20 blur-[140px] float-slower" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[120rem] items-center px-[2.4rem] py-[6rem]">
        <div className="grid w-full grid-cols-1 items-center gap-[4rem] lg:grid-cols-2">
          <div className="hero-enter">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[1.2rem] font-semibold text-[#4a3aff] shadow-[0_8px_30px_rgba(75,63,255,0.15)]">
              UCO Olimpiada 2026
              <span className="h-2 w-2 rounded-full bg-[#5B3FFF] pulse-dot" />
            </span>

            <h1 className="mt-[2.4rem] text-[3.6rem] font-semibold leading-[1.15] text-[#170f49] lg:text-[5.2rem]">
              Bilimlar maydoniga
              <span className="text-[#5B3FFF]"> birinchi bo‘lib</span> kiring
            </h1>

            <p className="mt-[1.6rem] max-w-[52rem] text-[1.7rem] leading-[1.6] text-[#6f6c8f]">
              UCO Olimpiadada qatnashish — bu o‘z kuchingizni zamonaviy formatda
              sinash, mentorlar bilan ishlash va real natijaga erishish
              imkoniyati. Hozir ro‘yxatdan o‘ting.
            </p>

            <div className="mt-[2.4rem] flex flex-wrap gap-[1.2rem]">
              <button
                type="button"
                onClick={onRegister}
                className="rounded-[1.6rem] bg-gradient-to-r from-[#7B6CFF] to-[#5B3FFF] px-[3.2rem] py-[1.4rem] text-[1.6rem] font-semibold text-white shadow-[0_18px_36px_-16px_rgba(75,63,255,0.65)] transition hover:translate-y-[-2px] hover:opacity-95"
              >
                Ro‘yxatdan o‘tish
              </button>
              <button
                type="button"
                onClick={onLogin}
                className="rounded-[1.6rem] border border-[#D9D7FF] bg-white/70 px-[3.2rem] py-[1.4rem] text-[1.6rem] font-semibold text-[#4a3aff] shadow-[0_10px_24px_rgba(17,24,39,0.08)] transition hover:-translate-y-0.5 hover:border-[#b9b2ff]"
              >
                Tizimga kirish
              </button>
            </div>

            <div className="mt-[3.2rem] flex flex-wrap items-center gap-[1.2rem] text-[1.3rem] text-[#6f6c8f]">
              <span className="rounded-full bg-white/60 px-4 py-2">
                4–11 sinflar
              </span>
              <span className="rounded-full bg-white/60 px-4 py-2">
                2 til: uz / ru
              </span>
              <span className="rounded-full bg-white/60 px-4 py-2">
                Onlayn saralash + final
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-77 inset-0 pointer-events-none opacity-100">
        <Antigravity
          count={500}
          magnetRadius={6}
          ringRadius={7}
          waveSpeed={0.5}
          waveAmplitude={2}
          particleSize={2}
          lerpSpeed={0.05}
          color="#5227FF"
          autoAnimate
          particleVariance={1}
          rotationSpeed={0}
          depthFactor={1}
          pulseSpeed={4}
          particleShape="capsule"
          fieldStrength={10}
        />
        <img
          src={Uco}
          alt="UCO Icon"
          className="absolute left-[34%] top-[35%] w-24 h-24"
        />
      </div>
    </section>
  );
};

export default PublicHero;
