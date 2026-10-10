// CSS
import "./index.css";

// Image
import Image from "../../assets/images/profile.png";

// Icons
import { BiSearch } from "react-icons/bi";

const Header = () => {
  return (
    <div className="header-container">
      <div className="header-search">
        <span>
          <BiSearch />
        </span>
        <input type="text" name="search" placeholder="Search" />
      </div>
      {/* <div className="header-participants">Hello</div> */}
      <div className="header-info">
        <p>Hi Saundarya</p>
        <img src={Image} alt="profile" />
      </div>
    </div>
  );
};

export default Header;
