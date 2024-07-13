import "./SearchStyle.css";
import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import heart from "../../assets/heart.png";
import cart from "../../assets/cart.png";
import search from "../../assets/search.png";
import gt from "../../assets/gt.png";
import user from "../../assets/user.png";
import burger from "../../assets/burger.png";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import $ from "jquery";
import star from "../../assets/star.png";
import { debounce } from "lodash";

const Search = () => {
  const [activeCat, setActiveCat] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(null);
  const [video_duration, setVideoDuration] = useState(null);
  const [rating, setRating] = useState(null);
  const [language, setLanguage] = useState(null);
  const [level, setLevel] = useState(null);
  const [price, setPrice] = useState(null);
  const [course, setCourse] = useState(null);
  const [sort, setSort] = useState("high rated");
  const [searchValue, setSeatchValue] = useState("");
  const [searchCourses, setSearchCourses] = useState([]);
  const debouncedSetInputValue = debounce(setSeatchValue, 500);
  const [languages, setLanguages] = useState([]);
  const UserM = JSON.parse(localStorage.getItem("user"));
  const { topic } = useParams();

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

    const addInterest = async () => {
      await axios
        .put(
          "${process.env.REACT_APP_BACKEND_URL}/api/users/updateInterest",
          { topic },
          { withCredentials: true }
        )
        .then((response) => console.log(response.data.data))
        .catch((err) => console.log(err));
    };
    addInterest();
  }, []);

  const addInterest = async (item) => {
    await axios
      .put(
        "${process.env.REACT_APP_BACKEND_URL}/api/users/updateInterest",
        { item },
        { withCredentials: true }
      )
      .then((response) => console.log(response.data.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const fetching = async () => {
      console.log("fetching...");
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/courses/filterFetching/${JSON.stringify({
            topic,
            video_duration,
            level,
            rating,
            price,
            sort,
            language,
          })}`
        )
        .then((response) => {
          console.log(response.data.data);
          let b = []
          response.data.data.map((D) => {
            D.languages.map(L=>{
              if(b.includes(L) === false) {
                b.push(L)
              }
            })
          })
          setLanguages(b)
          setCourse(response.data.data);
        })
        .catch((err) => console.log(err));
    };
    fetching();
  }, [video_duration, level, rating, price, sort, language, topic]);

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

  const searchbarOpen = () => {
    $(".search_dropdown").addClass("active");
    $(".search_dropdown").removeClass("unactive");
  };
  const searchbarClose = () => {
    $(".search_dropdown").removeClass("active");
    $(".search_dropdown").addClass("unactive");
  };

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
              headers: { Authorization: "Bearer " + tokens1?.accessToken },
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
        headers: {
          Authorization: "Bearer " + tokens.accessToken,
        },
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

  const enter = (dropdownName) => {
    $(dropdownName).addClass("active");
    $(dropdownName).removeClass("unactive");
  };

  const out = (dropdownName) => {
    $(dropdownName).addClass("unactive");
    $(dropdownName).removeClass("active");
  };

  const toggleFilter = () => {
    console.log("toggle filter");
    if (!$(".leftFilter").hasClass("toggleUpFilter")) {
      // filter open
      $(".leftFilter").addClass("toggleUpFilter");
      $(".leftFilter").removeClass("toggleDownFilter");
      $(".rightContent").addClass("rightContentFull");
      $(".rightContent").removeClass("rightContentReal");
    } else {
      $(".leftFilter").removeClass("toggleUpFilter");
      $(".leftFilter").addClass("toggleDownFilter");
      $(".rightContent").removeClass("rightContentFull");
      $(".rightContent").addClass("rightContentReal");
    }
  };

  const resetFilter = () => {
    setLanguage(null);
    setLevel(null);
    setPrice(null);
    setRating(null);
    setSort(null);
    setVideoDuration(null);
  };
  console.log(sort, rating, language, video_duration, level, price);
  console.log(languages);

  return (
    <div className="search_container">
      <nav>
        <div
          onClick={() => navigate("/")}
          onMouseEnter={() => out(".dropdown")}
          className="logo"
        >
          <img src={logo} alt="logo" />
        </div>
        <h1 className="category" onMouseOver={() => enter(".dropdown")}>
          Category
        </h1>
        <div onMouseEnter={()=>{out(".dropdown"); out(".dropdown2")}} className="inputContainer">
          <form
            onSubmit={() => {
              navigate("/search/" + searchValue);
              setSeatchValue("");
            }}
          >
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
                <p
                  onClick={() => {
                    addInterest(item);
                    setTimeout(() => {
                      window.location.href = '/search/'+item
                    }, 100);
                  }}
                  key={index}
                >
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
        className="search_content"
      >
        <div className="search_heading">
          <h1>Search for "{topic}"</h1>
        </div>

        <div className="upperFilter">
          <div onClick={() => toggleFilter()} className="filterBtn">
            <p>Filter</p>
            <img src={burger} alt="" />
          </div>
          <div className="sortedDropdown">
            <select
              defaultValue={"high rated"}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="high rated">High rating</option>
              <option value="newest">Newest</option>
              <option value="price low to high">price low to high</option>
              <option value="price high to low">price high to low</option>
            </select>
          </div>
          <div onClick={() => resetFilter()} className="resetFilter">
            <p>Reset</p>
          </div>
        </div>

        <div className="coursesOFSearch">
          <div className="leftFilter">
            <div className="content1">
              <h1>Rating</h1>
              <div className="option1">
                <input
                  checked={rating === "4"}
                  onChange={(e) => setRating(e.target.value)}
                  value="4"
                  type="radio"
                  name="rating"
                />
                4 and above rating
              </div>
              <div className="option1">
                <input
                  checked={rating === "3"}
                  onChange={(e) => setRating(e.target.value)}
                  value="3"
                  type="radio"
                  name="rating"
                />
                3 and above rating
              </div>
              <div className="option1">
                <input
                  checked={rating === "2"}
                  onChange={(e) => setRating(e.target.value)}
                  value="2"
                  type="radio"
                  name="rating"
                />
                2 and above rating
              </div>
              <div className="option1">
                <input
                  checked={rating === "1"}
                  onChange={(e) => setRating(e.target.value)}
                  value="1"
                  type="radio"
                  name="rating"
                />
                1 and above rating
              </div>
            </div>

            <div className="content1">
              <h1>Language</h1>
              {
                languages?.map(L=>{
                  return  <div key={L} className="option1">
                            <input
                              checked={language === L}
                              value={L}
                              onChange={(e) => setLanguage(e.target.value)}
                              type="radio"
                              name="language"
                            />
                            {L}
                          </div>
                })
              }
              
            </div>

            <div className="content1">
              <h1>Video Duration</h1>
              <div className="option1">
                <input
                  checked={video_duration === "10"}
                  value="10"
                  onChange={(e) => setVideoDuration(e.target.value)}
                  type="radio"
                  name="duration"
                />
                above 10hrs
              </div>
              <div className="option1">
                <input
                  checked={video_duration === "7"}
                  value="7"
                  onChange={(e) => setVideoDuration(e.target.value)}
                  type="radio"
                  name="duration"
                />
                above 7hrs
              </div>
              <div className="option1">
                <input
                  checked={video_duration === "5"}
                  value="5"
                  onChange={(e) => setVideoDuration(e.target.value)}
                  type="radio"
                  name="duration"
                />
                above 5hrs
              </div>
              <div className="option1">
                <input
                  checked={video_duration === "3"}
                  value="3"
                  onChange={(e) => setVideoDuration(e.target.value)}
                  type="radio"
                  name="duration"
                />
                above 3hrs
              </div>
            </div>

            <div className="content1">
              <h1>Level</h1>
              <div className="option1">
                <input
                  checked={level === "Beginner"}
                  value="Beginner"
                  onChange={(e) => setLevel(e.target.value)}
                  type="radio"
                  name="level"
                />
                Begginner
              </div>
              <div className="option1">
                <input
                  checked={level === "Intermediate"}
                  value="Intermediate"
                  onChange={(e) => setLevel(e.target.value)}
                  type="radio"
                  name="level"
                />
                Intermidiate
              </div>
              <div className="option1">
                <input
                  checked={level === "Expert"}
                  value="Expert"
                  onChange={(e) => setLevel(e.target.value)}
                  type="radio"
                  name="level"
                />
                Expert
              </div>
            </div>

            <div className="content1">
              <h1>Price</h1>
              <div className="option1">
                <input
                  checked={price === "free"}
                  value="free"
                  onChange={(e) => setPrice(e.target.value)}
                  type="radio"
                  name="price"
                />
                Free
              </div>
              <div className="option1">
                <input
                  checked={price === "paid"}
                  value="paid"
                  onChange={(e) => setPrice(e.target.value)}
                  type="radio"
                  name="price"
                />
                Paid
              </div>
            </div>
          </div>

          <div className="rightContent rightContentReal">
            {course?.map((C) => {
              return (
                <div
                  key={C?._id}
                  onClick={() => window.location.href = "/course/" + C?._id}
                  className="cart_course_box"
                  style={{ width: 800, marginLeft: 20 }}
                >
                  <div className="cart_course_image">
                    <img src={C?.thumbnail_url} alt="" />
                  </div>
                  <div className="cart_course_content">
                    <h1>{C?.title}</h1>
                    <p className="cart_course_author">
                      Created by {C?.instructor_name}
                    </p>
                    <div
                      className="rating_container ccr"
                      style={{ width: 40 }}
                    >
                      <p className="rating">{C?.rating.toFixed(1) + " "} </p>
                      <img src={star} alt="star" />
                    </div>
                    <p className="cart_course_price">
                      ₹{C?.price} <del>₹{C?.discount + C?.price}</del>
                    </p>
                  </div>
                </div>
              );
            })}
            {course?.length == 0 && <p>No Course related this topic</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
