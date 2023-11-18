import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const searchWord = useRef();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await makeRequest.get("/users/allUsers?userId=" + currentUser.id);
        // console.log(res.data)
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, [currentUser.id]);

  const handliClick = (() => {
    makeRequest.post("http://localhost:8800/api/auth/logout");
    window.location.reload(true);
    localStorage.clear();
  });


  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  const handelFiltered = async (e) => {

    const searchword = e.target.value;
    setWordEntered(searchword);
    const newFilter = data.filter((d) => {
      return d.username.toLowerCase().includes(searchword.toLowerCase());
    })
    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  }
  const handleRefresh = (() => {
    window.reload(true)
  })
  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Indisocial</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />

        <div>


          <div className="search">
            {filteredData.length === 0 ? (
              <SearchOutlinedIcon />
            ) : (
              <CloseIcon id="clearBtn" onClick={clearInput} />
            )}

            <input type="text"
              placeholder="Search..."
              className="searchInput"
              enterButton="Search"
              value={wordEntered}
              onChange={handelFiltered}
            />
            {
              filteredData.length !== 0 && (
                <div className="dataResult">
                  {filteredData.slice(0, 10).map((d, key) => {
                    return (
                      <Link to={"/profile/" + d.id}
                        style={{ textDecoration: "none", color: "inherit" }}
                        onClick={handleRefresh}>
                        <img
                          className="sidebarFriendImg"
                          src={
                            "/upload/" + d.profilePic
                              ? "/upload/" + d.profilePicture
                              : "/upload/noAvatar.png"
                          }
                          alt="" />
                        <span>{d.username}</span>
                      </Link>
                    );
                  })}
                </div>
              )
            }
          </div>

        </div>

      </div>
      <div className="right">
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <Link to={"/profile/" + currentUser.id}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="user">
            <img
              src={"/upload/" + currentUser.profilePic}
              alt=""
            />
            <span>{currentUser.name}</span>
          </div>
        </Link>
        <Link to="/login"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <LogoutIcon
            onClick={handliClick}
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
