import authReference from "../assets/Login Page.png";

const AuthLayout = ({
  children,
  heroDescription,
  heroTitle,
  subtitle,
  title
}) => (
  <main className="relative min-h-[calc(100svh-60px)] overflow-hidden bg-[#faf4ec] text-[#15171b]">
    <img
      src={authReference}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden h-[calc(100svh-60px)] w-full select-none object-fill lg:block"
    />

    <div className="relative z-10 mx-auto grid min-h-[calc(100svh-60px)] w-full grid-cols-1 lg:grid-cols-2">
      <aside className="relative hidden min-h-[calc(100svh-60px)] lg:block">
        <div
          className="absolute inset-x-0 top-0 h-[39%] px-[4.8vw] pt-[15.5vh]"
          style={{ background: "linear-gradient(180deg, #faf4ec 0%, #faf4ec 89%, rgba(250,244,236,0) 100%)" }}
        >
          <h1 className="max-w-[40vw] text-[clamp(2.8rem,5vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#111317]">
            {heroTitle}
          </h1>
          <p className="max-w-[32vw] text-[clamp(1rem,1.55vw,1.5rem)] leading-[1.4] text-[#34383d]">
            {heroDescription}
          </p>
        </div>
      </aside>

      <section className="flex min-h-[calc(100svh-60px)] items-center justify-center px-5 py-8 sm:px-8 lg:justify-start lg:px-0 lg:py-0">
        <div className="w-full mt-3 max-w-[460px] rounded-[22px] border border-black/[0.025] bg-white px-7 py-8 shadow-[0_20px_70px_rgba(54,42,28,0.08)] sm:px-10 lg:min-h-[calc(74.3vh-44.6px)] lg:w-[69%] lg:max-w-none lg:px-[2.75vw] lg:py-[4.4vh]">
          <div className="flex h-full flex-col justify-center">
            <h2 className="text-[30px] font-extrabold tracking-[-0.045em] text-[#111317] sm:text-[30px] mt-3">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#363a40] sm:text-base">
              {subtitle}
            </p>
            {children}
          </div>
        </div>
      </section>
    </div>
  </main>
);

export default AuthLayout;
