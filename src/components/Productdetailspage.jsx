import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import OrderModal from './Ordermodal'

// ─── Icons (inline SVGs to avoid fi import issues) ───────────────────────────
const IconArrow = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
)
const IconCart = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
)
const IconCheck = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)
const IconStar = ({ cls = '', filled = false }) => (
    <svg className={cls} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} fill={filled ? 'currentColor' : 'none'}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)
const IconZoom = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
    </svg>
)
const IconClose = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)
const IconChevron = ({ cls = '', dir = 'right' }) => (
    <svg className={cls} style={{ transform: dir === 'left' ? 'rotate(180deg)' : '' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
)
const IconPlus = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)
const IconMinus = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)
const IconTag = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
)
const IconPackage = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
)

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getSalePrice = (price, discount) => (price - (price * discount) / 100).toFixed(2)
const getBDT = (usd) => Math.round(usd * 110)

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose }) {
    const [current, setCurrent] = useState(index)
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [dragging, setDragging] = useState(false)
    const dragStart = useRef(null)

    const navigate = useCallback((dir) => {
        setZoom(1); setPan({ x: 0, y: 0 })
        setCurrent(c => (c + dir + images.length) % images.length)
    }, [images.length])

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowRight') navigate(1)
            if (e.key === 'ArrowLeft') navigate(-1)
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [navigate, onClose])

    const handleWheel = (e) => {
        e.preventDefault()
        setZoom(z => Math.min(4, Math.max(1, z - e.deltaY * 0.002)))
    }

    return (
        <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.96)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            {/* Close */}
            <button onClick={onClose} className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <IconClose cls="w-5 h-5 text-white" />
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
                {current + 1} / {images.length}
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur">
                <button onClick={() => setZoom(z => Math.max(1, z - 0.5))} className="text-white hover:text-[#a78bfa] transition-colors">
                    <IconMinus cls="w-4 h-4" />
                </button>
                <span className="text-white text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(4, z + 0.5))} className="text-white hover:text-[#a78bfa] transition-colors">
                    <IconPlus cls="w-4 h-4" />
                </button>
            </div>

            {/* Nav buttons */}
            {images.length > 1 && <>
                <button onClick={() => navigate(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110">
                    <IconChevron cls="w-6 h-6 text-white" dir="left" />
                </button>
                <button onClick={() => navigate(1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110">
                    <IconChevron cls="w-6 h-6 text-white" />
                </button>
            </>}

            {/* Image */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    className="relative w-full h-full flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    onWheel={handleWheel}
                    style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
                    onMouseDown={e => { if (zoom > 1) { setDragging(true); dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y } } }}
                    onMouseMove={e => { if (dragging && dragStart.current) setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y }) }}
                    onMouseUp={() => setDragging(false)}
                    onMouseLeave={() => setDragging(false)}
                >
                    <img
                        src={images[current]}
                        alt=""
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                        style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transition: dragging ? 'none' : 'transform 0.2s ease', userSelect: 'none', pointerEvents: 'none' }}
                        draggable={false}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Thumbnail strip */}
            {images.length > 1 && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((img, i) => (
                        <button key={i} onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); setCurrent(i) }}
                            className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === current ? 'border-[#a78bfa] scale-110' : 'border-white/20 opacity-50 hover:opacity-80'}`}>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </motion.div>
    )
}

// ─── Image Gallery ────────────────────────────────────────────────────────────
function ImageGallery({ thumbnail, images = [] }) {
    const allImages = [thumbnail, ...images].filter(Boolean)
    const [active, setActive] = useState(0)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)
    const [hovered, setHovered] = useState(false)

    const openLightbox = (i) => { setLightboxIndex(i); setLightboxOpen(true) }

    return (
        <>
            <AnimatePresence>
                {lightboxOpen && <Lightbox images={allImages} index={lightboxIndex} onClose={() => setLightboxOpen(false)} />}
            </AnimatePresence>

            <div className="flex flex-col gap-3">
                {/* Main image */}
                <div
                    className="relative rounded-2xl overflow-hidden aspect-[4/3] cursor-zoom-in group"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={() => openLightbox(active)}
                    style={{ background: 'linear-gradient(135deg,#1a1025,#0f1729)' }}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={active}
                            src={allImages[active]}
                            alt=""
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0, scale: 1.04 }}
                            animate={{ opacity: 1, scale: hovered ? 1.04 : 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                        />
                    </AnimatePresence>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                    {/* Zoom hint */}
                    <motion.div
                        className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm flex items-center gap-1.5 text-white/80 text-xs font-medium"
                        initial={{ opacity: 0 }} animate={{ opacity: hovered ? 1 : 0 }}
                    >
                        <IconZoom cls="w-3.5 h-3.5" />
                        Click to zoom
                    </motion.div>

                    {/* Image counter */}
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/70 text-xs">
                        {active + 1}/{allImages.length}
                    </div>

                    {/* Nav arrows for main */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={e => { e.stopPropagation(); setActive(a => (a - 1 + allImages.length) % allImages.length) }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-110"
                            >
                                <IconChevron cls="w-4 h-4 text-white" dir="left" />
                            </button>
                            <button
                                onClick={e => { e.stopPropagation(); setActive(a => (a + 1) % allImages.length) }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-110"
                            >
                                <IconChevron cls="w-4 h-4 text-white" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                        {allImages.map((img, i) => (
                            <motion.button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${i === active ? 'border-[#a78bfa] shadow-lg shadow-[#a78bfa]/30' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQItem({ faq, index }) {
    const [open, setOpen] = useState(false)
    return (
        <motion.div
            className="rounded-2xl overflow-hidden border border-white/8 bg-white/[0.03]"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
        >
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-semibold text-white text-sm leading-snug">{faq.question}</span>
                <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
                    <IconPlus cls="w-4 h-4 text-[#a78bfa]" />
                </motion.span>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <p className="px-4 pb-4 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-3">{faq.ans}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ label, icon }) => (
    <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-[#a78bfa]">{icon}</span>}
        <span className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-[0.2em]">{label}</span>
        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
    </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductDetailsPage({ product, onBack }) {
    const [orderOpen, setOrderOpen] = useState(false)
    const [added, setAdded] = useState(false)
    const headerRef = useRef(null)

    const saleUSD = getSalePrice(product.price, product.discount)
    const saleBDT = getBDT(saleUSD)
    const originalBDT = getBDT(product.price)

    const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean)

    const handleOrder = () => {

        setOrderOpen(true)
    }

    // Stagger delays
    const col1 = { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
    const col2 = { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] } }

    return (
        <div className="min-h-screen text-white" style={{
            // background: 'linear-gradient(135deg, #080a10 0%, #0d0f1e 50%, #080a10 100%)',
            fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif"
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');
        .font-display { font-family:  sans-serif; }
        .scrollbar-thin::-webkit-scrollbar { height: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.4); border-radius: 4px; }
        .glow-purple { box-shadow: 0 0 40px rgba(139,92,246,0.15), 0 0 80px rgba(139,92,246,0.08); }
        .glow-btn { box-shadow: 0 4px 24px rgba(139,92,246,0.4), 0 0 0 1px rgba(139,92,246,0.3); }
        .glow-btn:hover { box-shadow: 0 8px 32px rgba(139,92,246,0.6), 0 0 0 1px rgba(139,92,246,0.5); }
        .mesh-bg { background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(59,130,246,0.05) 0%, transparent 70%); }
        .shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent); background-size: 200% 100%; animation: shimmer 3s infinite; }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .badge-pulse { animation: badge-pulse 2s ease-in-out infinite; }
        @keyframes badge-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.4)} 50%{box-shadow:0 0 0 6px rgba(16,185,129,0)} }
      `}</style>

            {/* Ambient background */}
            <div className="fixed inset-0 mesh-bg pointer-events-none" />
            <div className="fixed top-0 left-1/3 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />


            {orderOpen && (
                <OrderModal product={product} onClose={() => setOrderOpen(false)} />
            )}

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">

                {/* Back button */}
                <motion.button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-all mb-8 group"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
                    whileHover={{ x: -3 }}
                >
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-[#a78bfa]/30 transition-all">
                        <IconArrow cls="w-3.5 h-3.5" />
                    </div>
                    <span>Back to Products</span>
                </motion.button>

                <div className="grid lg:grid-cols-12 gap-8 xl:gap-12">

                    {/* ── LEFT COLUMN ─────────────────────── */}
                    <motion.div className="lg:col-span-5 space-y-5" {...col1}>

                        {/* Image Gallery */}
                        <ImageGallery thumbnail={product.thumbnail} images={product.images} />

                        {/* Price Card */}
                        <motion.div
                            className="relative rounded-2xl overflow-hidden glow-purple border border-[#a78bfa]/20 p-5"
                            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(59,130,246,0.04) 100%)' }}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        >
                            <div className="shimmer absolute inset-0 rounded-2xl" />

                            {/* Badges row */}
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/30">
                                    {product.category}
                                </span>
                                {product.subcategory && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-gray-300 border border-white/10">
                                        {product.subcategory}
                                    </span>
                                )}
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold badge-pulse ${product.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                                    ● {product.status}
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="text-4xl sm:text-5xl font-display font-black text-white">${saleUSD}</span>
                                <div className="flex flex-col">
                                    <span className="text-base text-gray-600 line-through">${product.price}</span>
                                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{product.discount}% OFF</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-xl font-bold text-emerald-400">৳{saleBDT.toLocaleString()}</span>
                                <span className="text-sm text-gray-600 line-through">৳{originalBDT.toLocaleString()}</span>
                                <span className="text-xs text-gray-500">BDT</span>
                            </div>

                            {/* CTA */}
                            <motion.button
                                onClick={handleOrder}
                                className="mt-5 w-full py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5 glow-btn transition-all relative overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <AnimatePresence mode="wait">
                                    {added ? (
                                        <motion.span key="added" className="flex items-center gap-2" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                                            <IconCheck cls="w-5 h-5" /> Added to Order!
                                        </motion.span>
                                    ) : (
                                        <motion.span key="order" className="flex items-center gap-2" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                                            <IconCart cls="w-5 h-5" /> Order Now
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            {/* Meta grid */}
                            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                                {[
                                    ['📦', 'Stock', product.stock > 0 ? `${product.stock} available` : 'Out of stock'],
                                    ['🚚', 'Delivery', product.delivery],
                                    ['🛡️', 'Support', product.support],
                                    ['🏷️', 'Brand', product.brand],
                                ].filter(([, , v]) => v).map(([emoji, k, v]) => (
                                    <div key={k} className="flex flex-col gap-0.5">
                                        <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">{emoji} {k}</span>
                                        <span className="text-gray-300 font-semibold text-xs leading-snug capitalize">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Date info card */}
                        {(product.createdAt || product._id?.$oid) && (
                            <motion.div
                                className="rounded-2xl p-4 border border-white/8 bg-white/[0.02] text-sm"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            >
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2 font-bold">Product Info</p>
                                {product._id?.$oid && <div className="flex justify-between"><span className="text-gray-600">ID</span><span className="text-gray-400 font-mono text-xs">{product._id.$oid.slice(-8)}</span></div>}
                                {product.reviewCount !== undefined && <div className="flex justify-between mt-1"><span className="text-gray-600">Reviews</span><span className="text-gray-400">{product.reviewCount} total</span></div>}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* ── RIGHT COLUMN ─────────────────────── */}
                    <motion.div className="lg:col-span-7 space-y-8" {...col2}>

                        {/* Title block */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl font-black text-white leading-[1.1] mb-2">
                                {product.title}
                            </h1>
                            {product.subtitle && (
                                <p className="text-lg text-[#a78bfa] font-medium mb-3">{product.subtitle}</p>
                            )}

                            {/* Rating */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <IconStar key={i} filled={i < Math.round(product.rating)}
                                            cls={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-amber-400' : 'text-gray-700'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-white font-bold">{product.rating}</span>
                                <span className="text-gray-500 text-sm">({product.reviewCount} reviews)</span>
                                <span className="text-xs text-gray-600">•</span>
                                <span className="text-xs text-gray-500 capitalize">{product.status}</span>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <p className="mt-4 text-gray-400 leading-relaxed text-[15px]">{product.description}</p>
                            )}
                        </motion.div>

                        {/* Tags & Tech Stack */}
                        {(product.tags?.length > 0 || product.techStack?.length > 0) && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-4">
                                {product.tags?.length > 0 && (
                                    <div>
                                        <SectionHeader label="Tags" icon={<IconTag cls="w-3.5 h-3.5" />} />
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.map((t, i) => (
                                                <motion.span key={t} className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl hover:border-[#a78bfa]/30 hover:text-white transition-all cursor-default"
                                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                                                >#{t}</motion.span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {product.techStack?.length > 0 && (
                                    <div>
                                        <SectionHeader label="Tech Stack" icon={<IconPackage cls="w-3.5 h-3.5" />} />
                                        <div className="flex flex-wrap gap-2">
                                            {product.techStack.map((t, i) => (
                                                <motion.span key={t} className="px-3 py-1.5 bg-[#a78bfa]/10 border border-[#a78bfa]/25 text-[#a78bfa] text-sm rounded-xl font-medium hover:bg-[#a78bfa]/20 transition-all cursor-default"
                                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                                                >{t}</motion.span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Features */}
                        {product.features?.filter(f => f.title).length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <SectionHeader label="Features" />
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {product.features.filter(f => f.title).map((feat, i) => (
                                        <motion.div key={i}
                                            className="group flex gap-3 p-4 rounded-2xl border border-white/8 bg-white/[0.03] hover:border-[#a78bfa]/25 hover:bg-[#a78bfa]/5 transition-all"
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
                                            whileHover={{ y: -2 }}
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-[#a78bfa]/15 border border-[#a78bfa]/25 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#a78bfa]/25 transition-colors">
                                                <IconCheck cls="w-4 h-4 text-[#a78bfa]" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm leading-snug">{feat.title}</p>
                                                {feat.details && <p className="text-gray-500 text-xs mt-1 leading-relaxed">{feat.details}</p>}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* FAQs */}
                        {product.faqs?.filter(f => f.question).length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                                <SectionHeader label="FAQs" />
                                <div className="space-y-2">
                                    {product.faqs.filter(f => f.question).map((faq, i) => (
                                        <FAQItem key={i} faq={faq} index={i} />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Reviews */}
                        {product.reviews?.filter(r => r.name).length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <SectionHeader label="Customer Reviews" />
                                <div className="space-y-3">
                                    {product.reviews.filter(r => r.name).map((rev, i) => (
                                        <motion.div key={i}
                                            className="flex gap-4 p-4 rounded-2xl border border-white/8 bg-white/[0.03] hover:border-white/12 transition-all"
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
                                            whileHover={{ x: 3 }}
                                        >
                                            {rev.photo && !rev.photo.startsWith('Earum') ? (
                                                <img src={rev.photo} alt={rev.name}
                                                    className="w-11 h-11 rounded-full object-cover flex-shrink-0 ring-2 ring-[#a78bfa]/30" />
                                            ) : (
                                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm ring-2 ring-[#a78bfa]/30">
                                                    {rev.name?.[0]?.toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <p className="font-bold text-white text-sm">{rev.name}</p>
                                                    <div className="flex items-center gap-0.5">
                                                        {[...Array(5)].map((_, j) => (
                                                            <IconStar key={j} filled cls="w-3 h-3 text-amber-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                                {rev.review && <p className="text-gray-400 text-sm leading-relaxed">{rev.review}</p>}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Bottom CTA (mobile sticky) */}
                        <motion.div
                            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4"
                            style={{ background: 'linear-gradient(to top, #080a10 80%, transparent)' }}
                            initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center gap-3 max-w-lg mx-auto">
                                <div className="flex flex-col">
                                    <span className="text-white font-black text-lg">${saleUSD}</span>
                                    <span className="text-emerald-400 text-xs font-medium">৳{saleBDT.toLocaleString()} BDT</span>
                                </div>
                                <motion.button
                                    onClick={handleOrder}
                                    className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 glow-btn"
                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                >
                                    <IconCart cls="w-5 h-5" /> Order Now
                                </motion.button>
                            </div>
                        </motion.div>

                    </motion.div>
                </div>
            </div>
        </div>
    )
}