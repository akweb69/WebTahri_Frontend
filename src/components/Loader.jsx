/* src/components/Loader.jsx */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiWebex } from "react-icons/si";
import "./Loader.css";

/**
 * Props
 * -------------------------------------------------
 * isLoading      : boolean   – show / hide the loader (default: true)
 * size           : number    – pixel size of the central icon (default: 80)
 * color          : string    – colour of the central icon (default: "#61DBFB")
 * icon           : component – any React‑Icon component (default: FaReact)
 * brand          : string    – text to display (default: "WebTahri")
 * brandColor     : string    – colour of the brand text (default: "#fff")
 * brandSize      : string    – CSS font‑size (default: "1.5rem")
 * duration       : number    – base rotation duration in seconds (default: 2)
 * overlayColor   : string    – colour of the dark overlay (default: "rgba(0,0,0,0.5)")
 * blur           : string    – amount of backdrop blur (default: "12px")
 */
const Loader = ({
    isLoading = true,
    size = 80,
    color = "#61DBFB",
    icon: Icon = SiWebex,
    brand = "WebTahri",
    brandColor = "#fff",
    brandSize = "1.5rem",
    duration = 2,
    overlayColor = "rgba(0,0,0,0.5)",
    blur = "12px",
}) => {
    /* -------------------------------------------------
     *  Animation variants
     * ------------------------------------------------- */
    const ringVariants = (direction = 1, speedFactor = 1) => ({
        animate: { rotate: direction * 360 },
        transition: {
            repeat: Infinity,
            duration: duration * speedFactor,
            ease: "linear",
        },
    });

    const iconVariants = {
        animate: { scale: [1, 1.2, 1] },
        transition: {
            repeat: Infinity,
            duration: duration * 2,
            ease: "easeInOut",
        },
    };

    const brandVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: 0.5, // start after the rings have begun rotating
            },
        },
    };

    /* -------------------------------------------------
     *  Render
     * ------------------------------------------------- */
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="loader-overlay"
                    style={{
                        backgroundColor: overlayColor,
                        backdropFilter: `blur(${blur})`,
                    }}
                    // Fade in / out of the whole overlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="loader-center">
                        {/* ----- rotating rings ----- */}
                        <motion.div
                            className="loader-ring ring-1"
                            variants={ringVariants(1, 1)}
                        />
                        <motion.div
                            className="loader-ring ring-2"
                            variants={ringVariants(-1, 1.5)}
                        />
                        <motion.div
                            className="loader-ring ring-3"
                            variants={ringVariants(1, 0.75)}
                        />

                        {/* ----- central icon (pulses) ----- */}
                        <motion.div className="loader-icon" variants={iconVariants}>
                            <Icon size={size} color={color} />
                        </motion.div>

                        {/* ----- brand name ----- */}
                        <motion.div
                            className="loader-brand"
                            variants={brandVariants}
                            initial="hidden"
                            animate="visible"
                            style={{ color: brandColor, fontSize: brandSize }}
                        >
                            {brand}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Loader;
