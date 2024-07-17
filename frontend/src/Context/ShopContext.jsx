import React, { createContext, useEffect, useState } from "react";
// import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300+1; index++) {
    cart[index] = 0;
  }
  // console.log(cart);
  return cart;
};

const ShopContextProvider = (props) => {

  const [all_product,setAll_Product]  = useState([]);

  const [cartItems, setCartItems] = useState(getDefaultCart());
  // console.log(cartItems);

  useEffect(()=>{
    fetch('http://localhost:4000/allproducts')
    .then((response)=>response.json())
    .then((data)=>setAll_Product(data))

    if(localStorage.getItem('auth-token')){
      fetch('http://localhost:4000/getcart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:"",
      }).then((response)=>response.json())
        .then((data)=>setCartItems(data));
    }
  },[])

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    // console.log(cartItems);
    if(localStorage.getItem('auth-token')){
      fetch('http://localhost:4000/addtocart',{
        method:'POST', 
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:JSON.stringify({"itemId":itemId}),
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data));
    }
  };

 const removeFromCart = (itemId) => {
  setCartItems((prev) => {
    const updatedItems = { ...prev };
    if (updatedItems[itemId] > 1) {
      updatedItems[itemId] -= 1;
    } else {
      delete updatedItems[itemId];
    }
    return updatedItems;
  });

  if (localStorage.getItem('auth-token')) {
    fetch('http://localhost:4000/removefromcart', {
      method: 'POST',
      headers: {
        Accept: 'application/json',  // Correct the Accept header
        'auth-token': localStorage.getItem('auth-token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId: itemId }),
    })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));  // Add error handling
  }
};


  const getTotalCartAmount = () => {
    let totalAmount = 0;
  
    // Filter cartItems to get only those with quantity > 0
    const filteredItems = Object.entries(cartItems).filter(
      ([key, value]) => value > 0
    );
  
    // Iterate over the filtered items
    filteredItems.forEach(([item, quantity]) => {
      let itemInfo = all_product.find(
        (product) => product.id === Number(item)
      );
  
      if (itemInfo) {
        totalAmount += itemInfo.new_price * quantity;
      }
    });
  
    return totalAmount;
  };

  const getTotalCartItems = () =>{
    let totalItem = 0;
    for(const item in cartItems)
        {
            if(cartItems[item]>0)
                {
                    totalItem+= cartItems[item];
                }
        }
        return totalItem;
  }
  

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
