import styles from "../../styles/Product.module.css";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";


export const getStaticPaths = async () => {
  const res = await fetch('https://api-pizza.adaptable.app/products');
  const data = await res.json();

  // map data to an array of path objects with params (id)
  const paths = data.map(pizza => {
    return {
      params: { id: pizza._id.toString() }
    }
  })

  return {
    paths,
    fallback: false
  }
}
export const getStaticProps = async (context) => {
  const id = context.params.id;
  const res = await fetch(`https://api-pizza.adaptable.app/products/${id}`);
  const data = await res.json();

  return {
    props: { pizza: data }
  }
}


const Product = ({ pizza }) => {
  const [price, setPrice] = useState(pizza.product.prices[0]);
  const [size, setSize] = useState(0);
  const [extras, setExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  
  const changePrice = (number) => {
    setPrice(price + number);
  };
  
  const handleSize = (sizeIndex) => {
    const difference = pizza.product.prices[sizeIndex] - pizza.product.prices[size];
    setSize(sizeIndex);
    changePrice(difference);
  };
  
  const handleChange = (e, option) => {
    const checked = e.target.checked;

    if (checked) {
      changePrice(option.price);
      setExtras((prev) => [...prev, option]);
    } else {
      changePrice(-option.price);
      setExtras(extras.filter((extra) => extra._id !== option._id));
    }
  };
  const handleClick = () => {
    dispatch(addProduct({...pizza, extras, price, quantity}));
  };
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.imgContainer}>
          <Image src={pizza.product.img} objectFit="contain" layout="fill" alt="" />
        </div>
      </div>
      <div className={styles.right}>
        <h1 className={styles.title}>{pizza.product.title}</h1>
        <span className={styles.price}>{price}</span>
        <p className={styles.desc}>{pizza.product.desc}</p>
        <h3 className={styles.choose}>Выбери размер</h3>
        <div className={styles.sizes}>
          <div className={styles.size} onClick={() => handleSize(0)}>
            <img src="https://cdn-icons-png.flaticon.com/512/207/207391.png" width="30" height="30" />
            <span className={styles.number}>Маленькая</span>
          </div>
          <div className={styles.size} onClick={() => handleSize(1)}>
            <img src="https://cdn-icons-png.flaticon.com/512/207/207391.png" width="40" height="40" />
            <span className={styles.number}>Средняя</span>
          </div>
          <div className={styles.size} onClick={() => handleSize(2)}>
            <img src="https://cdn-icons-png.flaticon.com/512/207/207391.png" width="50" height="50"/>
            <span className={styles.number}>Гигантская</span>
          </div>
        </div>
        <h3 className={styles.choose}>Выбери доролнительные ингредиенты</h3>
        <div className={styles.ingredients}>
        {pizza.product.extraOptions.map((option) => (
            <div className={styles.option} key={option._id}>
              <input
                type="checkbox"
                id={option.text}
                name={option.text}
                className={styles.checkbox}
               onChange={(e) => handleChange(e, option)}
              />
              <label htmlFor="double">{option.text}</label>
            </div>
          ))}
        
        </div>
        <div className={styles.add}>
            <input
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            defaultValue={1}
            className={styles.quantity}
          />
            <button className={styles.button} onClick={handleClick}>Добавить в корзину</button>
        </div>
      </div>
    </div>
  );
};


export default Product;

