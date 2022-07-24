import Jupiter from "../public/pictures/planet/name/Jupiter.png";
import Mars from "../public/pictures/planet/name/Mars.png";
import Mercury from "../public/pictures/planet/name/Mercury.png";
import Naptune from "../public/pictures/planet/name/Naptune.png";
import Pluto from "../public/pictures/planet/name/Pluto.png";
import Saturn from "../public/pictures/planet/name/Saturn.png";

const PlanetImageSwitch = (num) => {
  if (num === 0) {
    return Mercury;
  } else if (num === 1) {
    return Jupiter;
  } else if (num === 2) {
    return Mars;
  } else if (num === 3) {
    return Naptune;
  } else if (num === 4) {
    return Pluto;
  } else if (num === 5) {
    return Saturn;
  }
};

export default PlanetImageSwitch;
