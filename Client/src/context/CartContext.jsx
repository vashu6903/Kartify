import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '../axiosCalls/axios';
import { useAuth } from './authContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { customer } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionIds, setActionIds] = useState({});

  const totalUnits = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + Number(item.product?.price || 0) * item.quantity;
    }, 0);
  }, [cartItems]);

  function setCartFromResponse(responseData) {
    setCartItems(responseData?.cart || []);
  }

  function setItemLoading(productId, value) {
    setActionIds((prev) => {
      const next = { ...prev };
      if (value) {
        next[productId] = true;
      } else {
        delete next[productId];
      }
      return next;
    });
  }

  function getCartItem(productId) {
    return cartItems.find((item) => item.product?._id === productId);
  }

  async function refreshCart() {
    if (!customer) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/cart');
      setCartFromResponse(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your cart.');
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(productId) {
    setItemLoading(productId, true);
    setError(null);
    try {
      const response = await axiosInstance.post(`/cart/${productId}`);
      setCartFromResponse(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add product to cart.');
      throw err;
    } finally {
      setItemLoading(productId, false);
    }
  }

  async function updateCartQuantity(productId, quantity) {
    setItemLoading(productId, true);
    setError(null);
    try {
      const response = await axiosInstance.patch(`/cart/${productId}`, { quantity });
      setCartFromResponse(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update cart quantity.');
      throw err;
    } finally {
      setItemLoading(productId, false);
    }
  }

  async function removeFromCart(productId) {
    setItemLoading(productId, true);
    setError(null);
    try {
      const response = await axiosInstance.delete(`/cart/${productId}`);
      setCartFromResponse(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to remove product from cart.');
      throw err;
    } finally {
      setItemLoading(productId, false);
    }
  }

  function clearCart() {
    setCartItems([]);
    setError(null);
    setActionIds({});
  }

  useEffect(() => {
    refreshCart();
  }, [customer]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        actionIds,
        totalUnits,
        subtotal,
        getCartItem,
        refreshCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
