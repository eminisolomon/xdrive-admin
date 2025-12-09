import {
  WrenchScrewdriverIcon,
  TruckIcon,
  AcademicCapIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Buy & Sell Cars',
    description:
      'Seamlessly buy your dream car or sell your current vehicle. Our marketplace connects you with trusted buyers and sellers for effortless transactions.',
    icon: ShoppingBagIcon,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Workshop & Mechanic Appointments',
    description:
      'Book appointments with top-rated workshops and expert mechanics near you. Reliable repairs and maintenance are just a few clicks away.',
    icon: WrenchScrewdriverIcon,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    title: 'Emergency Assistance',
    description:
      "Stuck on the road? Our 24/7 emergency services ensure you're never stranded. From breakdowns to towing, help is always around the corner.",
    icon: TruckIcon,
    color: 'bg-red-100 text-red-600',
  },
  {
    title: 'Vehicle Swaps',
    description:
      'Upgrade or change your ride easily. Our platform facilitates secure and fair vehicle swaps, helping you drive what matches your lifestyle.',
    icon: ArrowPathIcon,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Expert Driving School',
    description:
      'Learn to drive with confidence. We offer personalized training from verified instructors to help you become a safe and skilled driver.',
    icon: AcademicCapIcon,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Car Inspection & Safety',
    description:
      'Ensure peace of mind with our comprehensive car inspection services. We verify vehicle conditions so you can trade with absolute confidence.',
    icon: ShieldCheckIcon,
    color: 'bg-indigo-100 text-indigo-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-(--color-primary) mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features designed for your automotive lifestyle.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
