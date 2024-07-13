import React, { useState, useEffect } from "react";
import "./DashboardStyle.css";
import logo from "../../assets/logo.png";
import heart from "../../assets/heart.png";
import cart from "../../assets/cart.png";
import search from "../../assets/search.png";
import gt from "../../assets/gt.png";
import user from "../../assets/user.png";
import axios from "axios";
import "atropos/css";
import { useNavigate } from "react-router";
import $ from "jquery";
import { debounce } from "lodash";
import CreateCourseTab from "./subPart/CreateCourse.js";
import ChangePassword from "./subPart/ChangePassword.js";
import DeleteAccount from "./subPart/DeleteAccount.js";
import Logout from "./subPart/Logout.js";
import ShoppingCart from "./subPart/ShoppingCart.js";
import UserSetting from "./subPart/UserSetting.js";
import YourCourse from "./subPart/YourCourse.js";
import Wishlist from "./subPart/Wishlist.js";
import ProfessionalSetting from "./subPart/ProfessionalSetting.js";

const Dashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState(0);
  const [tokens, setTokens] = useState(null);
  const [searchValue, setSeatchValue] = useState("");
  const [searchCourses, setSearchCourses] = useState([]);
  const debouncedSetInputValue = debounce(setSeatchValue, 500);
  const options = [
    "Your Course",
    "Wishlist",
    "Shopping Cart",
    "User Setting",
    "Professional Setting",
    "Create Course",
    "Change Password",
    "Delete Account",
    "Logout",
  ];
  const [indexOfOption, setIndexOfOption] = useState(0);
  const CatList0 = [
    "Web development",
    "Data science",
    "Mobile development",
    "Programming language",
    "Game development",
    "Database desing and development",
    "Software testing",
    "Software engineering",
    "Software dev tool",
    "NO coding dev",
  ];
  const CatList = [
    [
      "Javascript",
      "ReactJs",
      "AngularJS",
      "NextJS",
      "CSS",
      "HTML",
      "ASP.net core",
      "Node.js",
    ],
    [
      "Machine Learning",
      "Python",
      "Deep Learning",
      "Artificial Intelligence",
      "NLP",
      "LangChain",
      "Data Analysis",
      "R",
    ],
    [
      "Google Flutter",
      "Android Development",
      "IOS",
      "React Native",
      "Dart",
      "Swift",
      "Kotlin",
      "Mobile Development",
      "SwiftUI",
    ],
    [
      "Python",
      "JavaScript",
      "ReactJS",
      "C++",
      "C#",
      "C",
      "GO",
      "Java",
      "Spring Framework",
    ],
    [
      "Unreal Engine",
      "UnityEngine",
      "Game Development Fundamentals",
      "Godot Foundation",
      "C#",
      "C++",
      "3D Game Development",
      "2D Game Development",
      "Unreal Engine Blueprint",
    ],
    [
      "SQLS",
      "SQL Server",
      "MySQL Server",
      "NoSQL Server",
      "DBMS",
      "PostgreSQL",
      "Apache Kafka",
      "MongoDB",
      "Oracle SQL",
      "DB Programming",
    ],
    [
      "Selenium webdriver",
      "Automation testing",
      "Java",
      "Postman",
      "selenium testing framework",
      "API testing",
    ],
    [
      "Data Structures",
      "Algorithms",
      "Coding Interviews",
      "Microservices",
      "Backend development",
      "Python",
    ],
    [
      "Docker",
      "Git",
      "Kubernates",
      "Jira",
      "Prompt Engineering",
      "GitHub",
      "DevOps",
    ],
    [
      "Generative AI",
      "WordPress",
      "Web testing",
      "Web Design",
      "App development",
    ],
  ];

  const redirect = (path) => {
    navigate(path);
  };

  useEffect(() => {
    $(".leftPartDashboard p:first-child").addClass("active");

    setTimeout(() => {
      if (!tokens) {
        const fetchCookies = async () => {
          await axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/api/users/getCookies`, {
              withCredentials: true,
            })
            .then((response) => {
              setTokens(response.data.data);
              TokenValidation(response.data.data);
            })
            .catch((err) => console.log(err));
        };
        fetchCookies();
      }
    }, 200);
  }, []);

  const TokenValidation = (tokens1) => {
    console.log(tokens1);
    if (loggedIn === false) {
      if (
        tokens1?.accessToken === undefined ||
        tokens1?.accessToken === null ||
        tokens1?.accessToken === ""
      ) {
        setLoggedIn(false);
        console.log("chala false ho gaya", tokens1?.accessToken);
      } else {
        const checkForTokenValidation = async () => {
          await axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/api/users/tokenValidation`, {
              withCredentials: true,
            })
            .then((response) => {
              console.log(tokens1);
              console.log(response.data.data);
              if (response.data.data !== undefined) setLoggedIn(true);
            })
            .catch((error) => {
              console.log(error);
              setLoggedIn(false);
            });
        };
        checkForTokenValidation();
      }
    }
  };

  const logout = async () => {
    console.log("logout " + tokens.accessToken);
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/users/logout`, null, {

        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data.data);
        setLoggedIn(false);
        localStorage.removeItem("user");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const active = (i) => {
    setIndexOfOption(i);
    const $a = $(".leftPartDashboard p");
    $a[i].classList.add("active1");
    $a.not($a[i]).removeClass("active1");
  };

  const enter = (dropdownName) => {
    $(dropdownName).addClass("active");
    $(dropdownName).removeClass("unactive");
  };

  const out = (dropdownName) => {
    $(dropdownName).addClass("unactive");
    $(dropdownName).removeClass("active");
  };

  const searchbarOpen = () => {
    $(".search_dropdown").addClass("active");
    $(".search_dropdown").removeClass("unactive");
  };
  const searchbarClose = () => {
    $(".search_dropdown").removeClass("active");
    $(".search_dropdown").addClass("unactive");
  };

  useEffect(() => {
    if (searchValue === "") {
      searchbarClose();
    }

    const searchCourses = async () => {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/courses/${searchValue}/searchCourse`)
        .then((response) => {
          setSearchCourses(response.data.data);
          if (response.data.data.length > 0) {
            searchbarOpen();
          } else if (response.data.data.length === 0) {
            searchbarClose();
          }
        })
        .catch((error) => console.log(error));
    };
    if (searchValue !== "") {
      searchCourses();
    }
  }, [searchValue]);

  const changeTab = (Id) =>{
    setIndexOfOption(Id)
    active(Id)
  }

  return (
    <div>
      {/* nav bar code  */}
      <nav>
        <div
          onClick={() => redirect("/")}
          onMouseEnter={() => out(".dropdown")}
          className="logo"
        >
          <img src={logo} alt="logo" />
        </div>
        <h1 className="category" onMouseOver={() => enter(".dropdown")}>
          Category
        </h1>
        <div onMouseEnter={()=>{out(".dropdown"); out(".dropdown2")}} className="inputContainer">
          <form onSubmit={() => navigate("/search/" + searchValue)}>
            <input
              type="text"
              name="search"
              placeholder="Search for anything..."
              onChange={(e) => debouncedSetInputValue(e.target.value)}
            />
          </form>
          <div onMouseEnter={() => out(".dropdown1")} className="searchBtn">
            <img src={search} alt="" />
          </div>
        </div>

        <div
          onClick={() => redirect("/wishlist")}
          onMouseEnter={() => {
            out(".dropdown1");
            out(".dropdown2");
          }}
          className="icon"
        >
          <img src={heart} alt="logo" />
        </div>
        <div
          onClick={() => redirect("/cart")}
          onMouseEnter={() => {
            console.log("chalna suru");
            out(".dropdown2");
            out(".dropdown1");
            console.log("chalna band");
          }}
          className="icon"
        >
          <img src={cart} alt="logo" />
        </div>
        {loggedIn && (
          <div onMouseOver={() => enter(".dropdown2")} className="circle">
            <img src={user} alt="" />
          </div>
        )}

        {!loggedIn && (
          <div onMouseOver={() => enter(".dropdown1")} className="circle">
            <img src={user} alt="" />
          </div>
        )}

        {/* dropdown */}
        <div className="dropdown unactive">
          <div className="part1">
            {CatList0.map((item, index) => {
              return (
                <div key={index} className="Cat_lists">
                  <p onMouseOver={() => setActiveCat(index)}>{item}</p>
                  <img src={gt} alt="" />
                </div>
              );
            })}
          </div>
          <div className="part2">
            <p>Popular Topics</p>
            {CatList[activeCat]?.map((item, index) => {
              return (
                <p onClick={() => navigate("/search/" + item)} key={index}>
                  {item}
                </p>
              );
            })}
          </div>
        </div>

        {/* sign up and login dropdown menu */}
        <div className="dropdown1 unactive">
          <p onClick={() => redirect("/signup")}>Sign Up</p>
          <p onClick={() => redirect("/signin")}>Sign In</p>
        </div>

        {/* user Related dropdown  */}
        <div className="dropdown2 unactive">
          <p onClick={() => navigate("/dashboard")}>Dashboard</p>
          <p onClick={() => logout()}>Logout</p>
        </div>

        {/* search dropdown */}
        <div className="search_dropdown unactive">
          {searchCourses?.map((C) => {
            return (
              <p
                key={C?._id}
                onClick={() => redirect("/search/" + searchValue)}
              >
                {"search->"} {C?.title}
              </p>
            );
          })}
        </div>
      </nav>

      <div
        onMouseEnter={() => {
          out(".dropdown1");
          out(".dropdown2");
          out(".dropdown");
        }}
        className="dashboard_container"
      >
        <div className="leftPartDashboard">
          {options.map((o, index) => {
            return (
              <p onClick={() => active(index)} key={o}>
                {o}
              </p>
            );
          })}
        </div>
        <div className="rightPartDashboard">
          {indexOfOption === 0 && <YourCourse></YourCourse>}
          {indexOfOption === 2 - 1 && <Wishlist></Wishlist>}
          {indexOfOption === 3 - 1 && <ShoppingCart></ShoppingCart>}
          {indexOfOption === 4 - 1 && <UserSetting></UserSetting>}
          {indexOfOption === 5 - 1 && (
            <ProfessionalSetting></ProfessionalSetting>
          )}
          {indexOfOption === 6 - 1 && (
            <CreateCourseTab changeTab={changeTab}></CreateCourseTab>
          )}
          {indexOfOption === 7 - 1 && <ChangePassword></ChangePassword>}
          {indexOfOption === 8 - 1 && <DeleteAccount></DeleteAccount>}
          {indexOfOption === 9 - 1 && <Logout myFn={setLoggedIn}></Logout>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
