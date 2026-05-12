import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

export default function ProductGrid({ products, isLoading, onCardClick }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/5 animate-pulse aspect-[3/4]" />
        ))}
      </div>
    )
  }

  if (products?.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">No products found.</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {products?.map((product) => (
        <ProductCard
          key={product._id?.$oid || product._id}
          product={product}
          onClick={() => onCardClick(product)}
        />
      ))}
    </motion.div>
  )
}