import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    FiUser, FiMail, FiGlobe, FiCpu, FiDollarSign,
    FiSend, FiFileText, FiClock, FiCheckCircle,
    FiAlertCircle, FiLayers, FiZap, FiShield
} from 'react-icons/fi';

const CustomBuildRequest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        projectType: 'E-commerce',
        websiteGoals: '',
        requiredFeatures: [],
        budgetRange: '',
        deadline: '',
        additionalNotes: ''
    });

    const base_url = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

    const featuresList = [
        "Payment Gateway", "User Auth", "Admin Panel",
        "SEO Ready", "Live Chat", "Multi-Lang"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureToggle = (feature) => {
        setFormData(prev => ({
            ...prev,
            requiredFeatures: prev.requiredFeatures.includes(feature)
                ? prev.requiredFeatures.filter(f => f !== feature)
                : [...prev.requiredFeatures, feature]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${base_url}/custom-order`, formData);
            if (response.data.insertedId) {
                toast.success('Project request submitted successfully!', {
                    icon: <FiCheckCircle className="text-green-500" />,
                });
                setFormData({
                    clientName: '', clientEmail: '', projectType: 'E-commerce',
                    websiteGoals: '', requiredFeatures: [], budgetRange: '',
                    deadline: '', additionalNotes: ''
                });
            }
        } catch (error) {
            toast.error('Submission failed. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-20 bg-background min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-5 gap-12 items-start">

                    {/* Left Side: Information & Branding */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div>

                            <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground mt-6 leading-tight">
                                Build Your <span className="text-primary">Vision</span> With Us.
                            </h1>
                            <p className="text-muted-foreground text-lg mt-6 leading-relaxed">
                                From scalable SaaS platforms to high-converting E-commerce stores, we transform your complex ideas into production-ready digital products.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: FiLayers, title: "Scalable Architecture", desc: "Built with the MERN stack for high performance." },
                                { icon: FiZap, title: "Fast Turnaround", desc: "Efficient development cycles to meet your deadlines." },
                                { icon: FiShield, title: "Secure & Reliable", desc: "Industry-standard security for all your data." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-card/50 border border-border">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <item.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side: Interactive Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-3"
                    >
                        <form onSubmit={handleSubmit} className="bg-card p-8 lg:p-10 rounded-[2.5rem] border border-border shadow-2xl space-y-6">
                            <h3 className="text-2xl font-bold text-foreground border-b border-border pb-4">Project Requirements</h3>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input required name="clientName" value={formData.clientName} onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="Your Name" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Email Address</label>
                                    <div className="relative">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input required type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="email@example.com" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Project Type</label>
                                    <div className="relative">
                                        <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <select name="projectType" value={formData.projectType} onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none">
                                            <option>E-commerce</option>
                                            <option>SaaS Platform</option>
                                            <option>Portfolio</option>
                                            <option>Custom Web App</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Budget Range</label>
                                    <div className="relative">
                                        <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input required name="budgetRange" value={formData.budgetRange} onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="e.g. $2000+" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-3 block">Required Features</label>
                                <div className="flex flex-wrap gap-2">
                                    {featuresList.map(feature => (
                                        <button key={feature} type="button" onClick={() => handleFeatureToggle(feature)}
                                            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${formData.requiredFeatures.includes(feature)
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                                                }`}>
                                            {feature}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="md:col-span-1">
                                    <label className="text-sm font-medium mb-2 block">Timeline / Deadline</label>
                                    <div className="relative">
                                        <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input type="date" name="deadline" value={formData.deadline} onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium mb-2 block">Tell us about your project</label>
                                    <div className="relative">
                                        <FiFileText className="absolute left-4 top-4 text-muted-foreground" />
                                        <textarea name="websiteGoals" value={formData.websiteGoals} onChange={handleChange} rows={3}
                                            className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
                                            placeholder="Describe your goals and vision..." />
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-50"
                            >
                                {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSend /> Send My Request</>}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CustomBuildRequest;