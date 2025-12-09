import { motion } from 'framer-motion';

const FounderStory = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-6xl mx-auto">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 order-2 lg:order-1"
          >
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-100 rounded-full -z-10"></div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0A2647] mb-6 relative z-10">
                Founder’s Story
              </h2>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Our founder has over 25 years of experience in the automobile
              industry and has dedicated their life to making automobile
              services accessible, affordable, and trustworthy.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Driven by a passion for innovation and a deep understanding of
              driver needs, XDrive was built to bridge the gap between vehicle
              owners and quality service providers, ensuring peace of mind on
              every journey.
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 order-1 lg:order-2"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-4/3 bg-gray-200">
                {/* Since we don't have the exact image asset, using a relevant placeholder style */}
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80"
                  alt="Founder and Team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-[rgba(10,38,71,0.6)] to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white font-medium">
                Building trust, one ride at a time.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderStory;
