import Mars from "../../public/pictures/planet/raw/Mars.png";
import Pluto from "../../public/pictures/planet/raw/Pluto.png";
import Jupiter from "../../public/pictures/planet/raw/Jupiter.png";
import Neptune from "../../public/pictures/planet/raw/Naptune.png";
import Saturn from "../../public/pictures/planet/raw/Saturn.png";
import Mercury from "../../public/pictures/planet/raw/Mercury.png";
import Star from "../../public/pictures/Star.png";
import Image from "next/image";
const Planet = () => {
  const stars = [
    { key: 1, alt: "Star1", className: "star-1" },
    { key: 2, alt: "Star2", className: "star-2" },
    { key: 3, alt: "Star3", className: "star-3" },
    { key: 4, alt: "Star4", className: "star-4" },
    { key: 5, alt: "Star5", className: "star-5" },
    { key: 6, alt: "Star6", className: "star-6" },
    { key: 7, alt: "Star7", className: "star-7" },
    { key: 8, alt: "Star8", className: "star-8" },
    { key: 9, alt: "Star9", className: "star-9" },
    { key: 10, alt: "Star10", className: "star-10" },
  ];
  return (
    <div className="home-planet">
      <div className="saturns">
        <Image src={Saturn} alt="Saturn" />
      </div>
      <div className="mercury">
        <Image src={Mercury} alt="Mercury" />
      </div>
      <div className="jupiter">
        <Image src={Jupiter} alt="Jupiter" />
      </div>
      <div className="mars">
        <Image src={Mars} alt="Mars" />
      </div>
      <div className="pluto">
        <Image src={Pluto} alt="Pluto" />
      </div>
      <div className="neptune">
        <Image src={Neptune} alt="Neptune" />
      </div>
      {stars.map((star) => {
        return (
          <div key={star.key} className={`stars ${star.className}`}>
            <Image key={star.key} className="star" src={Star} alt={star.alt} />
          </div>
        );
      })}
    </div>
  );
};

export default Planet;
