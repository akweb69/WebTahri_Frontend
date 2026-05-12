import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import SectionHeader from './SectionHeader'
import CategoryFilter from './Categoryfilter'
import ProductGrid from './ProductsGrid'
import ProductDetailsPage from './Productdetailspage'
import useAllProducts from '../Hooks/useAllProducts'

export default function TrendingProducts() {
  const { products, isLoading } = useAllProducts()
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Derive unique categories from actual data
  const categories = [
    'All',
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ]

  // Filter + cap at 12
  const filtered = products.filter((p) => p.category === "Landing Page").slice(0, 12)

  // Show detail page
  if (selectedProduct) {
    return (
      <AnimatePresence>
        <ProductDetailsPage
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
        />
      </AnimatePresence>
    )
  }

  return (
    <section className="py-10 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Trending Now"
          title="Popular Products"
          subtitle="Handpicked digital products loved by thousands of developers & designers"
        />

        <ProductGrid
          products={filtered}
          isLoading={isLoading}
          onCardClick={setSelectedProduct}
        />
      </div>
    </section>
  )
}