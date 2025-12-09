import { ArrowRightIcon } from '@heroicons/react/24/outline';
import AppStoreImg from '../../assets/store/app-store.png';
import PlayStoreImg from '../../assets/store/play-store.png';
import MockupImg from '../../assets/mockup.png';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-(--color-primary) text-white pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-(--color-primary-container) blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-white blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Experience 24/7 <br />
              <span className="text-(--color-primary-container)">
                Automobile Services
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Fast, Secure, and Reliable solutions for car sales, rentals,
              upgrades, swaps, and mobile mechanics. All in one place.
            </p>

            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 max-w-lg mx-auto lg:mx-0">
              <h3 className="text-xl font-bold mb-4 text-center">
                Get the APP Now
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#"
                  className="transition-transform hover:scale-105 active:scale-95"
                >
                  <img
                    src={PlayStoreImg}
                    alt="Get it on Google Play"
                    className="h-12 w-auto mx-auto"
                  />
                </a>
                <a
                  href="#"
                  className="transition-transform hover:scale-105 active:scale-95"
                >
                  <img
                    src={AppStoreImg}
                    alt="Download on the App Store"
                    className="h-12 w-auto mx-auto"
                  />
                </a>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start gap-2 text-sm text-(--color-primary-container) font-medium cursor-pointer hover:text-white transition-colors">
              <span className="underline decoration-(--color-primary-container) underline-offset-4">
                Learn more about our services
              </span>
              <ArrowRightIcon className="h-4 w-4" />
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative z-10">
              <img
                src={MockupImg}
                alt="App Interface Mockup"
                className="mx-auto w-full max-w-[280px] lg:max-w-[320px] drop-shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 ease-out"
              />
            </div>
            {/* Decorative circles behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-white/20 rounded-full -z-10 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-white/10 rounded-full -z-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
