const stats = [
  { value: '18K+', label: 'Satisfied Customers Globally' },
  { value: '700K+', label: 'Trusted Vendors Worldwide' },
  { value: '245K+', label: 'Happy Users Enjoying Our Services' },
  { value: '24/7', label: 'Support Available' },
];

const Stats = () => {
  return (
    <section className="py-20 bg-(--color-primary) text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          {stats.map((stat, index) => (
            <div key={index} className="p-4">
              <div className="text-4xl lg:text-5xl font-bold mb-2 text-(--color-primary-container)">
                {stat.value}
              </div>
              <div className="text-gray-300 text-sm lg:text-base font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
