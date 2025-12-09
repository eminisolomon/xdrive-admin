import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainerFast } from '@/shared';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  browserTitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  browserTitle,
}) => {
  const pageTitle = browserTitle || title;

  return (
    <>
      <Helmet>
        <title>{pageTitle} | Xdrive Admin</title>
      </Helmet>

      <motion.div
        className="mb-6 pt-4 md:mb-10 md:pt-8"
        variants={staggerContainerFast}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-(--color-text) flex items-center gap-2 md:gap-4 mb-2 md:mb-3"
          variants={fadeInUp}
        >
          {icon && (
            <span className="text-(--color-primary) [&>svg]:w-8 [&>svg]:h-8 md:[&>svg]:w-12 md:[&>svg]:h-12">
              {icon}
            </span>
          )}
          {title}
        </motion.h1>
        {description && (
          <motion.p
            className="text-sm md:text-lg text-(--color-body)"
            variants={fadeInUp}
          >
            {description}
          </motion.p>
        )}
      </motion.div>
    </>
  );
};

export default PageHeader;
