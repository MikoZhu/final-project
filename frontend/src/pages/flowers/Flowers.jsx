// Importing necessary dependencies from React and the application
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { cartStore } from '../../stores/cartStore';
import { userStore } from '../../stores/userStore';
import { Navbar } from '../../components/navbar/Navbar';
import { Footer } from '../../components/footer/Footer';
import { MoreInfo } from '../../components/more_info/MoreInfo';
import basicImage from "../../assets/images/basic.png";
import standardImage from "../../assets/images/standard.png";
import largeImage from "../../assets/images/large.png";

// Define the available flower types
const allFlowerTypes = ['basic', 'standard', 'large'];
const flowerImages = {
  'basic': basicImage,
  'standard': standardImage,
  'large': largeImage
};

// Define the Flowers component
export const Flowers = () => {
  const { t } = useTranslation();
  // Extract parameters and functions from React Router and stores
  const { type } = useParams();
  const navigate = useNavigate();
  const { addToCart, fetchFlowers } = cartStore();
  const { isLoggedIn, id } = userStore(state => ({ isLoggedIn: state.isLoggedIn, id: state.id }));
  // State to manage flower details, subscription options, and quantity
  const [flower, setFlower] = useState({});
  const [subscriptionOption, setSubscriptionOption] = useState('weekly');
  const [quantity, setQuantity] = useState(1);
  // State to manage if Add to Cart button is enabled
  const [isAddToCartEnabled, setIsAddToCartEnabled] = useState(false);

  // State to manage subscription options and quantities for each flower type
  const [flowerOptions, setFlowerOptions] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem('flowerSubscriptionOptions')) || {};
    return storedData;
  });

  // Filter out the current flower type to get the other types
  const otherFlowerTypes = allFlowerTypes.filter(t => t !== type);

  // Function to select images to display
  const image_selector = (type) => {
    const selectedImage = flowerImages[type];
    return selectedImage 
      ? <img src={selectedImage} alt={`Flower bouquet of size ${type}`} />
      : <p>{t("flowers.error")}</p>;
  };

  // UseEffect to fetch specific flower data based on the flower type
  useEffect(() => {
    // Reset the Add to Cart button to be disabled by default
    setIsAddToCartEnabled(false);
    let isMounted = true;
    const fetchSpecificFlower = async () => {
      // Check if the flowers data for the current type is already fetched
      const flowerData = cartStore.getState().flowers[type];
      if (!flowerData) {
        // If not fetched, then call the fetchFlowers function
        const newFlowerData = await fetchFlowers(type);
        if (isMounted && newFlowerData) {
          console.log('Fetched flower data:', newFlowerData);
          setFlower(newFlowerData);
        }
      } else {
        // If already fetched, use the existing data
        if (isMounted) {
          console.log('Using cached flower data:', flowerData);
          setFlower(flowerData);
        }
      }
    };
    fetchSpecificFlower();
    // Cleanup function to handle component unmounting
    return () => {
      isMounted = false;
    };
  }, [type]);

  useEffect(() => {
    console.log("Running useEffect for flowerSubscriptionOptions check");

    const storedFlowerOptions = JSON.parse(localStorage.getItem('flowerSubscriptionOptions')) || {};
    const flowerData = storedFlowerOptions[type];

    if (flowerData) {
      // Update the subscription option and quantity from local storage
      setSubscriptionOption(flowerData.subscriptionOption || 'weekly');
      setQuantity(flowerData.quantity || 1);
      setIsAddToCartEnabled(true); // Enable Add to Cart if options are available
    } else {
      console.log('No relevant flower data found in localStorage for type:', type);
      // Optionally, reset to default values
      setSubscriptionOption('weekly');
      setQuantity(1);
      setIsAddToCartEnabled(false);
    }
  }, [type]);


  // UseEffect to update subscription and quantity when the user logs in
  useEffect(() => {
    if (isLoggedIn) {
      const cart = cartStore.getState().cart;
      if (cart && cart.type === type) {
        setSubscriptionOption(cart.subscriptionOption || 'weekly');
        setQuantity(cart.quantity || 1);
        // Enable the Add to Cart button
        setIsAddToCartEnabled(true);
      }
    }
  }, [isLoggedIn, type]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('flowerSubscriptionOptions')) || {};
    const flowerData = storedData[type];

    // Update the subscription option and quantity from local storage or reset to default
    setSubscriptionOption(flowerData?.subscriptionOption || 'weekly');
    setQuantity(flowerData?.quantity || 1);

    console.log('[useEffect][type change] Setting option and quantity for type:', type);
  }, [type]);



  const handleOptionChange = (option) => {
    const newQuantity = option === 'weekly' ? 1 : option === 'monthly' ? 4 : 52;
    setSubscriptionOption(option);
    setQuantity(newQuantity);

    const newFlowerOptions = { ...flowerOptions, [type]: { subscriptionOption: option, quantity: newQuantity } };
    setFlowerOptions(newFlowerOptions);
    localStorage.setItem('flowerSubscriptionOptions', JSON.stringify(newFlowerOptions));
    // Enable the Add to Cart button when a valid option is selected
    setIsAddToCartEnabled(true);
    console.log('[handleOptionChange] Option changed:', option, 'Quantity:', newQuantity);
  };

  // Function to handle adding the current flower to the cart
  const handleAddToCart = () => {
    console.log('Add to Cart Clicked');

    if (!isLoggedIn) {
      console.log('User not logged in, redirecting to login page');
      // Save product details to local storage for later retrieval
      const productDetails = { type, subscriptionOption, quantity, price: flower.price };
      localStorage.setItem('tempCart', JSON.stringify(productDetails));
      // Redirect to the login page with the current flower type as a redirect parameter
      navigate(`/login?redirect=${encodeURIComponent(`/flowers/${type}`)}`);
    } else {
      console.log('User is logged in, adding to cart');
      if (subscriptionOption && quantity) {
        addToCart(type, subscriptionOption, quantity, flower.price, isLoggedIn, id);
        navigate(`/cart/${id}`);
      } else {
        console.error('Cannot add to cart: Missing subscriptionOption or quantity');
      }
    }
  };


  return (
    <>
      <Navbar />
      <section>
        {image_selector(type)}
        <div>
        <h1>{t("flowers.product")} {t(`flowers.${flower.type}`)}</h1>
          <p>{flower.price} {t("flowers.currency")}/{t("flowers.week")}</p>
          <div>
            <p>{t("flowers.options")}</p>
            <div>
              <button onClick={() => handleOptionChange('yearly')}>{t("flowers.yearly")}</button>
              <button onClick={() => handleOptionChange('monthly')}>{t("flowers.monthly")}</button>
              <button onClick={() => handleOptionChange('weekly')}>{t("flowers.weekly")}</button>
            </div>
          </div>
          <div>
            <p>{t("flowers.options")}
              <span>{quantity}</span>
              {t("flowers.bouquets")}
            </p>
          </div>
          <div>
            <p>{t("flowers.delivery")}</p>
            <span>{t("flowers.selfPickup")}</span> ({t("flowers.comingSoon")}: {t("flowers.delivery")})
          </div>
          <button onClick={handleAddToCart} disabled={!isAddToCartEnabled}>{t("flowers.addCart")}</button>
        </div>
      </section>
      <section>
        <MoreInfo />
      </section>
      <section>
        <h2>{t("flowers.otherItems")}</h2>
        {otherFlowerTypes.map((otherType) => (
          <div key={otherType}>
            {image_selector(otherType)}
            <Link to={`/flowers/${otherType}`}>{otherType}</Link>
          </div>
        ))}
      </section>
      <Footer />
    </>
  );
};
