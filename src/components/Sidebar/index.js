// CSS
import "./index.css";

// Icons
import { FaHome, FaChartBar, FaFolder, FaCalendarAlt } from "react-icons/fa";
import { RiChat3Fill, RiSettings4Fill, RiLogoutBoxRLine } from "react-icons/ri";

// Axios
import axios from "../../api/axios";

const Sidebar = (props) => {
  // const handleClick = () => {
  //   const token = localStorage.getItem("auth-token");

  //   axios
  //     .post(
  //       "logout",
  //       {},
  //       {
  //         headers: {
  //           Authorization: "Token " + token,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       // console.log(response.data.token);
  //       localStorage.removeItem("auth-token");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  return (
    <div className="sidebar">
      <h2>.taskez</h2>

      <div className="sidebar-contents">
        <div className="sidebar-contents-up">
          <p>
            <FaHome className="sidebar-icons" /> Overview
          </p>
          <p>
            <FaChartBar className="sidebar-icons" /> Stats
          </p>
          <p>
            <FaFolder className="sidebar-icons" /> Projects
          </p>
          <p>
            <RiChat3Fill className="sidebar-icons" /> Chat
          </p>
          <p>
            <FaCalendarAlt className="sidebar-icons" /> Calendar
          </p>
        </div>
        <div className="sidebar-contents-down">
          <p>
            <RiSettings4Fill className="sidebar-icons" /> Settings
          </p>
          <p>
            <RiLogoutBoxRLine className="sidebar-icons" /> Log Out
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
