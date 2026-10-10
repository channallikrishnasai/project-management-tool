// Components
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import DragNDrop from "../../components/Projects/DragNDrop";

// CSS
import "./index.css";

const Projects = () => {
  return (
    <div className="main">
      <div className="sidebar-container">
        <Sidebar />
      </div>

      <div className="main-container">
        <Header />
        <div className="projects-container">
          <h2>Projects</h2>

          <div className="projects-board">
            <DragNDrop />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
