import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { getProductsByCategory } from "../utils/api";
import {
  pageVariants,
  staggerContainer,
  staggerItem,
} from "../utils/animations";

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const categoryName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  useEffect(() => {
    let active = true;

    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const { data } = await getProductsByCategory(slug, { limit: 60 });
        if (active) {
          setProducts(data);
          setError("");
        }
      } catch (err) {
        console.error("Failed to load category products", err);
        if (active) {
          setError(
            err.message || "Unable to load products for this category."
          );
          setProducts([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchCategoryProducts();

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.h1
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Category: {categoryName}
      </motion.h1>
      {loading && (
        <div className="py-6 text-center text-sm text-slate-500">
          Loading category products...
        </div>
      )}
      {error && !loading && (
        <div className="py-6 text-center text-sm text-red-500">{error}</div>
      )}
      {!loading && !error && products.length === 0 && (
        <div className="py-6 text-center text-sm text-slate-500">
          No products found in this category yet.
        </div>
      )}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={staggerItem}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default CategoryPage;
