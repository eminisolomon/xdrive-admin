import { motion } from 'framer-motion';
import AppStoreImg from '@/assets/store/app-store.png';
import PlayStoreImg from '@/assets/store/play-store.png';

const CallToAction = () => {
  return (
    <section id="download" className="py-20 bg-(--color-primary-container)/20">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-(--color-primary) mb-8">
            Get the APP Now
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="#"
              className="transition-transform hover:scale-105 active:scale-95 shadow-lg rounded-xl overflow-hidden"
            >
              <img
                src={PlayStoreImg}
                alt="Get it on Google Play"
                className="h-16 w-auto"
              />
            </a>
            <a
              href="#"
              className="transition-transform hover:scale-105 active:scale-95 shadow-lg rounded-xl overflow-hidden"
            >
              <img
                src={AppStoreImg}
                alt="Download on the App Store"
                className="h-16 w-auto"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
