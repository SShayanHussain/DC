import { useState } from "react";
import "../Style/home.css";

interface Props {
  name: string;
  price: number;
  imgsrc: string;
  category: string;
}

const Card = ({ name, price, imgsrc, category }: Props) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="item">
      {imgsrc && !imgFailed ? (
        <img src={imgsrc} alt={name} onError={() => setImgFailed(true)} />
      ) : (
        <div className="no-image">NO IMAGE AVAILABLE</div>
      )}
      <h4>{name}</h4>
      <p>{category}</p>
      <ul>
        <li>
          <i className="fa fa-dollar-sign">{price}</i>
        </li>
      </ul>
    </div>
  );
};

export default Card;
