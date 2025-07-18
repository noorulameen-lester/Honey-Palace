export function getCart() {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
}

export function addToCart(product: any, quantity: number = 1) {
  if (typeof window === 'undefined') return;
  const cart = getCart();
  const existingIndex = cart.findIndex((item: any) => item.id === product._id || item.id === product.id);
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: (Array.isArray(product.images) && product.images.length > 0) ? product.images[0] : product.image,
      quantity,
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
} 