import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionHeader from "../SectionHeader";
import { getAllProducts } from "../../utils/api";
import { staggerContainer, staggerItem } from "../../utils/animations";

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fallbackImage = "https://placehold.co/300x300/008ECC/FFFFFF.png?text=Category";

  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data } = await getAllProducts({ limit: 120 });
        if (!active) return;

        const categoryMap = new Map();
        data.forEach((product) => {
          const name = (product.category || "Other").trim();
          if (!name) return;
          if (!categoryMap.has(name)) {
            categoryMap.set(name, {
              name,
              image: product.image || product.gallery?.[0] || fallbackImage,
            });
          }
        });

        const topCategories = Array.from(categoryMap.values()).slice(0, 7);
        setCategories(topCategories);
        setError("");
      } catch (err) {
        console.error("Failed to load categories", err);
        if (active) {
          setError(err.message || "Unable to load categories.");
          setCategories([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      active = false;
    };
  }, []);

  return (
    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
    >
      <SectionHeader
        title={
          <>
            Shop From <span style={{ color: "#008ECC" }}>Top Categories</span>
          </>
        }
        linkTo="/categories"
      />

      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 text-center"
        variants={staggerContainer}
      >
        {loading && (
          <div className="col-span-full py-6 text-sm text-slate-500">
            Loading categories...
          </div>
        )}
        {error && !loading && (
          <div className="col-span-full py-6 text-sm text-red-500">{error}</div>
        )}
        {!loading && !error && categories.length === 0 && (
          <div className="col-span-full py-6 text-sm text-slate-500">
            No categories to display yet.
          </div>
        )}
        {categories.map((category) => (
          <motion.div key={category.name} variants={staggerItem}>
            <Link
              to={`/category/${category.name.toLowerCase()}`}
              className="group block"
            >
              <motion.div
                className="bg-medium-bg rounded-full w-28 h-28 mx-auto flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = fallbackImage;
                  }}
                />
              </motion.div>
              <p className="mt-2 font-semibold text-dark-text group-hover:text-primary">
                {category.name}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default CategoriesSection;
