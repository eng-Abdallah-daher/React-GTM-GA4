import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  confirmRemove
} from '../slices/cartSlice';
import {
  addToWishlistAction,
  removeFromWishlistAction,
  clearWishlistAction
} from '../slices/wishlistSlice';
import {
  loginSuccess,
  logout
} from '../slices/userSlice';



export const gtmMiddleware = createListenerMiddleware();


gtmMiddleware.startListening({
  actionCreator: addToCart,
  effect: (action, listenerApi) => {
    const { item, quantity } = action.payload;


    window.dataLayer = window.dataLayer || [];


    const state = listenerApi.getState();
    const updatedCart = [...state.cart.items, { ...item, quantity }];

console.log(
  "aaa"
)
    window.dataLayer.push({
      event: 'add_to_cart',
      method: 'Buy Button',
      user_type: 'guest',
      cart_total: updatedCart.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0),
      cart_size: updatedCart.length,
      cart_items: updatedCart.map(cartItem => ({
        item_id: cartItem.productID || cartItem.id,
        item_name: cartItem.name,
        price: cartItem.price,
        quantity: cartItem.quantity,
        item_variant: cartItem.swatch || cartItem.variant || '',

      })),

      added_item: {
        item_id: item.productID || item.id,
        item_name: item.name,
        price: item.price,
        quantity: quantity,
        item_variant: item.swatch || item.variant || '',

      }
    });
  }
});

gtmMiddleware.startListening({
  actionCreator: removeFromCart,

  effect: (action, listenerApi) => {
    const state = listenerApi.getState();
    const item = action.payload;


    let removedItem;
    if (typeof item === 'number') {

      removedItem = state.cart.items[item];
    } else {

      removedItem = item;
    }

    if (removedItem) {

      window.dataLayer = window.dataLayer || [];


      window.dataLayer.push({
        event: 'remove_from_cart',
        method: 'Remove Button',
        user_type: 'guest',
        item_id: removedItem.productID || removedItem.id,
        item_name: removedItem.name,
        price: removedItem.price,
        quantity: removedItem.quantity,
        item_variant: removedItem.swatch || '',
        
      });
    }
  }
});

gtmMiddleware.startListening({
  actionCreator: updateQuantity,
  effect: (action, listenerApi) => {
    const { index, quantity } = action.payload;
    const state = listenerApi.getState();
    const item = state.cart.items[index];

    if (item) {
      const oldQuantity = item.quantity;
      const newQuantity = quantity;

      if (newQuantity > oldQuantity) {

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'add_to_cart',
          method: 'Quantity Update',
          user_type: 'guest',
          item_id: item.productID || item.id,
          item_name: item.name,
          price: item.price,
          quantity: newQuantity - oldQuantity,
          item_variant: item.swatch || '',
          
        });
      } else if (newQuantity < oldQuantity) {

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'remove_from_cart',
          method: 'Quantity Update',
          user_type: 'guest',
          item_id: item.productID || item.id,
          item_name: item.name,
          price: item.price,
          quantity: oldQuantity - newQuantity,
          item_variant: item.swatch || '',
         
        });
      }
    }
  }
});

gtmMiddleware.startListening({
  actionCreator: clearCart,
  
  effect: () => {
  
    window.dataLayer.push({
      event: 'clear_cart',
      method: 'Clear Cart',
      user_type: 'guest'
    });
  }
});


gtmMiddleware.startListening({
  actionCreator: addToWishlistAction,
  effect: (action, listenerApi) => {
    const productIndex = action.payload;
    const state = listenerApi.getState();

    try {
      const item = state.wishlist.items.find(item =>
        item.index === productIndex || item.originalIndex === productIndex
      );

      if (item) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'add_to_wishlist',
          method: 'Wishlist Button',
          user_type: 'guest',
          item_id: item.productID,
          item_name: item.productName,
          price: item.productPrice,
          quantity: 1,
        
        });
      }
    } catch (e) {
      console.error('Error tracking wishlist event:', e);
    }
  }
});


gtmMiddleware.startListening({
  actionCreator: loginSuccess,
  effect: (_, listenerApi) => {
    const state = listenerApi.getState();
    const { currentUser } = state.user;

    if (currentUser) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'login',
        method: 'Login Form',
        user_type: 'registered',
        user_id: currentUser.email,
        user_name: currentUser.name
      });
    }
  }
});

gtmMiddleware.startListening({
  actionCreator: logout,
  effect: () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'logout',
      method: 'Logout Button',
      user_type: 'guest'
    });
  }
});
