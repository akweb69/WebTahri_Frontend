import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import useAllProducts from '../Hooks/useAllProducts';
import Loader from './Loader';
import SectionHeader from './SectionHeader';
import ProductGrid from './ProductsGrid';
import ProductDetailsPage from './Productdetailspage';

const Website = () => {
    const { products, isLoading } = useAllProducts();
    const filtered = products.filter((p) => p.category === "Website");
    const [selectedProduct, setSelectedProduct] = useState(null)

    // Show detail page
    if (selectedProduct) {
        return (
            <AnimatePresence>
                <div className="py-20">
                    <ProductDetailsPage
                        product={selectedProduct}
                        onBack={() => setSelectedProduct(null)}
                    />
                </div>
            </AnimatePresence>
        )
    }


    if (isLoading) {
        return <Loader />
    }
    return (
        <section className="py-20 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader

                    title="Our Websites"
                    subtitle="Handpicked digital products loved by thousands of developers & designers"
                />

                <ProductGrid
                    products={filtered}
                    isLoading={isLoading}
                    onCardClick={setSelectedProduct}
                />
            </div>
        </section>
    );
};

export default Website;