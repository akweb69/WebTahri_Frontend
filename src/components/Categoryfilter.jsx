import { motion } from 'framer-motion'

export default function CategoryFilter({ categories, activeCategory, onChange }) {
    if (categories.length <= 1) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-10"
        >
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onChange(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeCategory === cat
                            ? 'bg-[#6c7aff] text-white shadow-lg shadow-[#6c7aff]/30'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/8'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </motion.div>
    )
}