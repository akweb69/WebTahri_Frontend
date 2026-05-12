import { motion } from 'framer-motion'

export default function SectionHeader({ badge, title, subtitle }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
        >
            {badge && (
                <span className="inline-block px-4 py-1.5 rounded-full border border-[#6c7aff]/30 bg-[#6c7aff]/10 text-[#6c7aff] text-xs font-bold uppercase tracking-widest mb-4">
                    {badge}
                </span>
            )}
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="text-gray-500 text-lg max-w-xl mx-auto">{subtitle}</p>
            )}
        </motion.div>
    )
}