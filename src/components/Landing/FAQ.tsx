import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: 'Does XDrive Sell Cars?',
    answer:
      'XDrive does not sell cars directly but connects users to automobile dealers. We provide a platform for listing and discovering vehicles, ensuring a safe connection between buyers and sellers.',
  },
  {
    question: 'How do I become a vendor?',
    answer:
      'Becoming a vendor is easy! Simply download the app, navigate to the unified registration page, and sign up as a Workshop, Mechanic, or Car Dealer. Our team will verify your details.',
  },
  {
    question: 'Is the roadside assistance available 24/7?',
    answer:
      'Yes, our emergency roadside assistance network operates 24/7. You can request help directly through the app anytime, anywhere within our coverage areas.',
  },
  {
    question: 'Are the driving instructors certified?',
    answer:
      'Absolutely. All driving instructors on our platform undergo rigorous background checks and must provide valid certifications and licenses before they can offer their services.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-(--color-primary) mb-4">
            F.A.Q
          </h2>
          <p className="text-gray-600">Frequently Asked Questions</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="border border-gray-200 rounded-2xl bg-gray-50 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
