import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCheckCircle, FiAlertCircle, FiShoppingCart } from 'react-icons/fi'
import axios from 'axios'
import { getSalePrice, getBDT } from './utils'

export default function OrderModal({ product, onClose }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        notes: '',
        query_details: '',
    })
    const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
    const [errorMsg, setErrorMsg] = useState('')

    const saleUSD = getSalePrice(product.price, product.discount)
    const saleBDT = getBDT(saleUSD)
    const originalBDT = getBDT(product.price)

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.phone || !form.query_details) {
            setErrorMsg('Please fill in all required fields.')
            setStatus('error')
            return
        }
        setStatus('loading')
        try {
            await axios.post('/make_order', {
                ...form,
                product_id: product._id?.$oid || product._id,
                product_title: product.title,
                usd_amount: saleUSD,
                bdt_amount: saleBDT,
            })
            setStatus('success')
        } catch (err) {
            setErrorMsg(
                err?.response?.data?.message || 'Something went wrong. Please try again.'
            )
            setStatus('error')
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />

                {/* Modal Box */}
                <motion.div
                    className="relative z-10 bg-[#0f1117] border border-[#2a2d3a] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
                    initial={{ scale: 0.85, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.85, opacity: 0, y: 40 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    {/* Header */}
                    <div className="relative p-6 pb-4 border-b border-[#2a2d3a]">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <FiX className="w-4 h-4 text-white" />
                        </button>
                        <p className="text-xs text-[#6c7aff] font-semibold uppercase tracking-widest mb-1">
                            Place Order
                        </p>
                        <h2 className="text-xl font-bold text-white leading-tight pr-8">
                            {product.title}
                        </h2>
                        <div className="flex items-center flex-wrap gap-3 mt-2">
                            <span className="text-2xl font-black text-white">${saleUSD}</span>
                            <span className="text-sm text-gray-400 line-through">${product.price}</span>
                            <span className="text-sm text-emerald-400 font-semibold">
                                ৳{saleBDT.toLocaleString()} BDT
                            </span>
                            <span className="text-xs text-gray-500 line-through">
                                ৳{originalBDT.toLocaleString()}
                            </span>
                            <span className="px-2 py-0.5 bg-[#6c7aff]/20 text-[#6c7aff] text-xs font-bold rounded-full">
                                {product.discount}% OFF
                            </span>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 max-h-[65vh] overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div
                                    key="success"
                                    className="flex flex-col items-center py-8 text-center"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', damping: 20 }}
                                >
                                    <motion.div
                                        className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                                    >
                                        <FiCheckCircle className="w-10 h-10 text-emerald-400" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-white mb-2">Order Placed!</h3>
                                    <p className="text-gray-400 text-sm">
                                        We'll contact you shortly via WhatsApp or email.
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="mt-6 px-6 py-2.5 bg-[#6c7aff] text-white rounded-xl font-semibold text-sm hover:bg-[#5a68ff] transition-colors"
                                    >
                                        Close
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="form" className="space-y-4">
                                    {/* Error banner */}
                                    <AnimatePresence>
                                        {status === 'error' && (
                                            <motion.div
                                                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                            >
                                                <FiAlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                                <p className="text-red-400 text-sm">{errorMsg}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Text inputs */}
                                    {[
                                        { label: 'Your Name *', name: 'name', type: 'text', placeholder: 'Full name' },
                                        { label: 'Email Address *', name: 'email', type: 'email', placeholder: 'you@example.com' },
                                        { label: 'WhatsApp Number *', name: 'phone', type: 'tel', placeholder: '+880 1xxx-xxxxxx' },
                                    ].map((field) => (
                                        <div key={field.name}>
                                            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                                                {field.label}
                                            </label>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                placeholder={field.placeholder}
                                                value={form[field.name]}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#6c7aff]/60 focus:bg-white/[0.08] transition-all text-sm"
                                            />
                                        </div>
                                    ))}

                                    {/* Query Details */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                                            Query Details *
                                        </label>
                                        <textarea
                                            name="query_details"
                                            rows={4}
                                            placeholder="Describe your requirements in detail..."
                                            value={form.query_details}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#6c7aff]/60 transition-all text-sm resize-none"
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                                            Notes (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="notes"
                                            placeholder="Any additional notes..."
                                            value={form.notes}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#6c7aff]/60 transition-all text-sm"
                                        />
                                    </div>

                                    {/* Submit */}
                                    <motion.button
                                        onClick={handleSubmit}
                                        disabled={status === 'loading'}
                                        className="w-full py-3.5 bg-[#6c7aff] text-white font-bold rounded-xl hover:bg-[#5a68ff] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <FiShoppingCart className="w-4 h-4" />
                                                Confirm Order — ৳{saleBDT.toLocaleString()}
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}