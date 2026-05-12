import { motion } from 'framer-motion'
import { FiStar, FiArrowRight, FiEye } from 'react-icons/fi'
import { getSalePrice, getBDT } from './utils'

export const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
}

export default function ProductCard({ product, onClick }) {
    const saleUSD = getSalePrice(product.price, product.discount)
    const saleBDT = getBDT(saleUSD)

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={onClick}
            className="group relative cursor-pointer rounded-2xl overflow-hidden border border-white/8 bg-[#0f1117] hover:border-[#6c7aff]/50 hover:shadow-2xl hover:shadow-[#6c7aff]/10 transition-all duration-300"
        >
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-[#6c7aff] text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                        {product.category}
                    </span>
                </div>
                <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full">
                        {product.discount}% OFF
                    </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#6c7aff]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 text-[#6c7aff] font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 translate-y-2 group-hover:translate-y-0 transition-transform">
                        <FiEye className="w-3.5 h-3.5" /> View Details
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="text-[10px] text-[#6c7aff] font-bold uppercase tracking-widest mb-1">
                    {product.subcategory || product.category}
                </p>
                <h3 className="font-bold text-white text-sm leading-snug mb-2 group-hover:text-[#6c7aff] transition-colors line-clamp-2">
                    {product.title}
                </h3>

                {/* Tags */}
                {product.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {product.tags.slice(0, 3).map((t) => (
                            <span
                                key={t}
                                className="px-2 py-0.5 bg-white/5 text-gray-400 text-[10px] rounded"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <FiStar className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-white">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-black text-white">${saleUSD}</span>
                            <span className="text-xs text-gray-600 line-through">${product.price}</span>
                        </div>
                        <p className="text-emerald-400 text-xs font-semibold">
                            ৳{saleBDT.toLocaleString()} BDT
                        </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#6c7aff]/10 border border-[#6c7aff]/30 flex items-center justify-center group-hover:bg-[#6c7aff] transition-colors">
                        <FiArrowRight className="w-3.5 h-3.5 text-[#6c7aff] group-hover:text-white" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}