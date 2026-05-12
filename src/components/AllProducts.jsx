import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAllProducts from '../Hooks/useAllProducts';
import SectionHeader from './SectionHeader';
import ProductGrid from './ProductsGrid';
import ProductDetailsPage from './Productdetailspage';

// ─── Category Filter Bar ──────────────────────────────────────────────────────
function CategoryFilter({ categories, active, onChange }) {
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
    const buttonRefs = useRef({})
    const barRef = useRef(null)

    // Track the sliding indicator
    useEffect(() => {
        const el = buttonRefs.current[active]
        const bar = barRef.current
        if (!el || !bar) return
        const barRect = bar.getBoundingClientRect()
        const elRect = el.getBoundingClientRect()
        setIndicatorStyle({ left: elRect.left - barRect.left, width: elRect.width })
    }, [active, categories])

    // Icon map for known categories
    const icons = {
        All: '◈',
        'Landing Page': '⬡',
        'E-commerce': '◎',
        'Portfolio': '◇',
        'Dashboard': '▦',
        'Blog': '◻',
        'SaaS': '⬢',
    }

    return (
        <div className="relative mb-8">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
                .cat-bar { font-family: 'Outfit', sans-serif; }
                .cat-scroll::-webkit-scrollbar { display: none; }
                .cat-scroll { scrollbar-width: none; }
                .cat-count {
                    font-size: 10px; line-height: 1;
                    padding: 2px 6px;
                    border-radius: 999px;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                }
                @keyframes cat-shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .active-shimmer {
                    background: linear-gradient(90deg, #a78bfa, #60a5fa, #a78bfa);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: cat-shimmer 3s linear infinite;
                }
            `}</style>

            {/* Top label */}
            <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.25em] cat-bar">
                    Filter by Category
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-white/8 to-transparent" />
                <span className="text-[10px] text-gray-700 cat-bar">{categories.length - 1} categories</span>
            </div>

            {/* Scrollable pill bar */}
            <div
                ref={barRef}
                className="cat-scroll relative flex items-center gap-2 overflow-x-auto pb-1"
            >
                {/* Sliding background indicator */}
                <motion.div
                    className="absolute top-0 h-full rounded-xl pointer-events-none z-0"
                    animate={indicatorStyle}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(59,130,246,0.15))',
                        border: '1px solid rgba(167,139,250,0.3)',
                        boxShadow: '0 0 20px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                    }}
                />

                {categories.map((cat) => {
                    const isActive = active === cat
                    const icon = icons[cat] || '◆'

                    return (
                        <motion.button
                            key={cat}
                            ref={el => buttonRefs.current[cat] = el}
                            onClick={() => onChange(cat)}
                            className="relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl flex-shrink-0 transition-colors cat-bar"
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.95, y: 0 }}
                        >
                            {/* Icon */}
                            <span className={`text-sm transition-colors ${isActive ? 'text-[#a78bfa]' : 'text-gray-600'}`}>
                                {icon}
                            </span>

                            {/* Label */}
                            <span className={`text-sm font-semibold whitespace-nowrap transition-all ${isActive ? 'active-shimmer' : 'text-gray-400 hover:text-gray-200'}`}>
                                {cat}
                            </span>

                            {/* Active dot */}
                            {isActive && (
                                <motion.span
                                    layoutId="cat-dot"
                                    className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]"
                                    style={{ boxShadow: '0 0 6px #a78bfa' }}
                                />
                            )}
                        </motion.button>
                    )
                })}

                {/* Right fade mask */}
                <div className="sticky right-0 w-12 h-full flex-shrink-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to left, #080a10, transparent)' }}
                />
            </div>

            {/* Active category label */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={active}
                    className="mt-3 flex items-center gap-2"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="h-px w-4 bg-[#a78bfa]/50" />
                    <span className="text-[11px] text-gray-600 cat-bar">
                        Showing <span className="text-[#a78bfa] font-semibold">{active}</span>
                    </span>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const AllProducts = () => {
    const { products, isLoading } = useAllProducts();
    const [activeCategory, setActiveCategory] = useState('All');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [prevCategory, setPrevCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState(null)


    const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

    useEffect(() => {
        setPrevCategory(activeCategory);
        if (activeCategory === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === activeCategory));
        }
    }, [activeCategory, products]);


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
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
            <SectionHeader label="All Products" />

            <CategoryFilter
                categories={categories}
                active={activeCategory}
                onChange={setActiveCategory}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                    <ProductGrid products={filteredProducts} isLoading={isLoading} onCardClick={setSelectedProduct}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AllProducts;