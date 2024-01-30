import React, { useReducer } from "react";
import { nanoid } from "nanoid";
import Products from "./Products";
import Cart from "./Cart";

const Main = () => {
  // Reducer function to handle state updates
  const reducer = (initState, action) => {
    switch (action.type) {
      case "Incr":
        // Increment the count of a product in the productsData array
        return {
          ...initState,
          productsData: initState.productsData.map((item) => {
            if (item.id === action.payload) {
              return { ...item, count: item.count + 1 };
            }
            return item;
          }),
        };
      case "AddToCart":
        // Add a product to the cartData array
        // If the product is already in the cart, increment its count; otherwise, add it to the cart
        const selectedItem = initState.productsData.find(
          (item) => item.id === action.payload
        );
        if (selectedItem) {
          const updatedCart = [...initState.cartData];
          const existingItemIndex = updatedCart.findIndex(
            (item) => item.id === action.payload
          );
          if (existingItemIndex !== -1) {
            updatedCart[existingItemIndex].count += 1;
          } else {
            updatedCart.push({ ...selectedItem, count: 1 });
          }
          return {
            ...initState,
            cartData: updatedCart,
          };
        }
      case "Decr":
        // Decrement the count of a product in the productsData array
        return {
          ...initState,
          productsData: initState.productsData.map((item) => {
            if (item.id === action.payload && item.count > 0) {
              return { ...item, count: item.count - 1 };
            }
            return item;
          }),
        };
      case "DecrFromCart":
        // Decrement the count of a product in the cartData array
        // Remove the product from the cart if its count becomes zero
        const updatedCart = initState.cartData.map((item) => {
          if (item.id === action.payload && item.count > 0) {
            return { ...item, count: item.count - 1 };
          }
          return item;
        });
        return {
          ...initState,
          cartData: updatedCart.filter((item) => item.count > 0),
        };
      case "addItem":
        // Prompt the user for a new product name and price
        // Add the new product to the productsData array
        let prodName = window.prompt("Product Name");
        while (prodName.length === 0) {
          alert("Please enter a valid Product name");
          prodName = window.prompt("Product Name");
        }
        let price = window.prompt("Price (Only Numbers)");
        while (/[^0-9.]/g.test(price) || price < 1) {
          alert("Please enter a valid number for the price");
          price = window.prompt("Price (Only Numbers)");
        }
        return {
          ...initState,
          productsData: [
            ...initState.productsData,
            { id: nanoid(), name: prodName, price: price, count: 0 },
          ],
        };
      case "deleteProduct":
        // Delete a product from the productsData array
        return {
          ...initState,
          productsData: initState.productsData.filter(
            (product) => product.id !== action.payload
          ),
        };
      default:
        // Return the current state if the action type is not recognized
        return initState;
    }
  };

  // useReducer hook to manage state
  const [state, dispatch] = useReducer(reducer, {
    productsData: [
      { id: 1, name: "Lipstic", price: "650", count: 0 },
      { id: 2, name: "EyeShadow", price: "450", count: 0 },
      { id: 3, name: "EyeLiner", price: "800", count: 0 },
    ],
    cartData: [],
  });

  // Render the main component
  return (
    <main>
      <div className="products">
        <h2>Beauty</h2>
        {/* Button to add a new product */}
        <div className="add-item">
          <button onClick={() => dispatch({ type: "addItem" })}>
            Add Product
          </button>
        </div>
        {/* Render Products component for each product in the productsData array */}
        {state.productsData.map((item) => {
          return (
            <Products
              key={nanoid()}
              item={item}
              onDecr={() => {
                // Dispatch actions for decrementing count in both product list and cart
                dispatch({ type: "Decr", payload: item.id });
                dispatch({ type: "DecrFromCart", payload: item.id });
              }}
              onIncr={() => {
                // Dispatch actions for incrementing count in both product list and cart
                dispatch({ type: "Incr", payload: item.id });
                dispatch({ type: "AddToCart", payload: item.id });
              }}
              onDelete={() =>
                // Dispatch action to delete a product
                dispatch({ type: "deleteProduct", payload: item.id })
              }
            />
          );
        })}
      </div>
      <div className="cart">
        <h2>Cart</h2>
        <div className="cart-content">
          {state.cartData.length === 0 ? (
            // Display a message if the cart is empty
            <p id="noEle">
              No Product added to the cart <br />
              <span>!</span>
            </p>
          ) : (
            // Render the Cart component if there are items in the cart
            <Cart cartData={state.cartData} />
          )}
        </div>
      </div>
    </main>
  );
};

export default Main;
