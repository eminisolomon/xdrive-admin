import {
  WrenchScrewdriverIcon,
  TruckIcon,
  AcademicCapIcon,
  PuzzlePieceIcon,
  CurrencyDollarIcon,
  MapIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    title: 'Automobile Services',
    description:
      "Experience unparalleled 24/7 automobile services tailored to your needs. From purchasing your dream car and booking a convenient ride to swapping vehicles or accessing mobile mechanics - we've got you covered at every turn.",
    icon: WrenchScrewdriverIcon,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Emergency Assistance On-the-Go',
    description:
      "No matter the situation, our emergency services ensure you're never left stranded. Whether it's roadside assistance, vehicle breakdowns, or immediate repair needs, our responsive team is ready to help you anytime, anywhere.",
    icon: TruckIcon,
    color: 'bg-red-100 text-red-600',
  },
  {
    title: 'Ride Booking Made Easy',
    description:
      'Get from point A to point B effortlessly with our seamless ride-booking system. Choose from a variety of vehicles and enjoy a hassle-free travel experience at the tap of a button, whenever you need it.',
    icon: MapIcon,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Expert Driving School & Personalized Training',
    description:
      "Get the best of both worlds with personalized lessons and expert training. Our driving school helps you become a confident and safe driver, whether you're learning for the first time or brushing up on your skills.",
    icon: AcademicCapIcon,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    title: 'Interactive Online Games for Fun & Skill Building',
    description:
      'Stay entertained and sharpen your skills at the same time with our interactive online games. Designed to be fun and engaging, they offer you a chance to relax, compete with friends, and enhance your cognitive skills.',
    icon: PuzzlePieceIcon,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Seamless Car Buying & Selling Experience',
    description:
      'Buying or selling a car has never been easier. Our platform connects you with trusted buyers and sellers, ensuring a safe and smooth transaction every time. Enjoy peace of mind with our verified listings.',
    icon: CurrencyDollarIcon,
    color: 'bg-indigo-100 text-indigo-600',
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-(--color-primary) mb-4">
            Some of the Best Features
          </h2>
          <p className="text-xl text-gray-600">You Find in One Application</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}
              >
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
