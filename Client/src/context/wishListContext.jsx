import {createContext, useContext, useState} from 'react';

const WishListContext = createContext();

export const WishListProvider = ({children}) =>{
    // This context is ready for shared wishlist state if the app grows later.
    const [wishlistItems, setWishlistItems] = useState([]);

    return (
        <WishListContext.Provider value={{wishlistItems, setWishlistItems}}>
            {children}
        </WishListContext.Provider>
    )
}

export const useWishList = () => useContext(WishListContext);
