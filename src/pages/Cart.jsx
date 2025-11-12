import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingCart as CartIcon } from "lucide-react";
import {
  pageVariants,
  staggerContainer,
  staggerItem,
  buttonHover,
} from "../utils/animations";

const Cart = () => {
  const { cartItems, updateQuantity, removeItem, cartCount } =
    useCart();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!cartItems.length) {
      return;
    }

    const [firstItem] = cartItems;

    if (firstItem?.id) {
      navigate(`/product/${firstItem.id}`, {
        state: { source: "cart-checkout" },
      });
    }
  };

  if (cartCount === 0) {
    return (
      <motion.div
        className="container mx-auto px-4 py-16 text-center"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <CartIcon className="mx-auto h-24 w-24 text-gray-300" />
        </motion.div>
        <motion.h2
          className="mt-6 text-2xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Your Cart is Empty
        </motion.h2>
        <motion.p
          className="mt-2 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Looks like you haven't added anything to your cart yet.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/"
            className="mt-6 inline-block bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-primary-dark transition-colors"
          >
            Start Shopping
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto max-w-4xl px-4 py-8 overflow-x-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        Your Shopping Cart ({cartCount} items)
      </motion.h1>

      <motion.div
        className="space-y-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence>
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              className="flex flex-wrap items-center gap-4 p-4 border rounded-lg bg-white"
              variants={staggerItem}
              layout
              exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-contain rounded-md flex-shrink-0"
              />
              <div className="flex-grow min-w-[180px]">
                <Link
                  to={`/product/${item.id}`}
                  className="font-semibold hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">
                  ₹{item.price.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 border rounded-md p-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="font-semibold w-24 text-right">
                ₹{(item.price * item.quantity).toLocaleString()}
              </p>
              <motion.button
                onClick={() => removeItem(item.id)}
                className="text-gray-500 hover:text-red-500"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 size={20} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="mt-8 flex justify-center sm:justify-end">
        <motion.button
          className="w-full sm:w-auto bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-primary-dark transition-colors"
          variants={buttonHover}
          whileHover="hover"
          whileTap="tap"
          type="button"
          onClick={handleProceedToCheckout}
        >
          Proceed to Checkout
        </motion.button>
      </div>
    </motion.div>
  );
}
;

export default Cart;
