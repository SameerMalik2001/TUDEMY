import React, { useEffect, useState } from "react";
import "./CartStyle.css";
import logo from "../../assets/logo.png";
import heart from "../../assets/heart.png";
import carts from "../../assets/cart.png";
import search from "../../assets/search.png";
import gt from "../../assets/gt.png";
import user from "../../assets/user.png";
import "atropos/css";
import $ from "jquery";
import star from "../../assets/star.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { debounce } from "lodash";

const Cart = () => {
  const [activeCat, setActiveCat] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(null);
  const [cart, setCart] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const UserM = JSON.parse(localStorage.getItem("user"));
  const [searchValue, setSeatchValue] = useState("");
  const [searchCourses, setSearchCourses] = useState([]);
  const debouncedSetInputValue = debounce(setSeatchValue, 500);
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

  const enter = (dropdownName) => {
    $(dropdownName).addClass("active");
    $(dropdownName).removeClass("unactive");
  };

  const out = (dropdownName) => {
    $(dropdownName).addClass("unactive");
    $(dropdownName).removeClass("active");
  };

  useEffect(() => {
    if (UserM?._id === undefined) {
      return navigate("/signin");
    }
    setCourseLoading(true);
    const fetchCart = async () => {
      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/api/carts/${UserM?._id}/fetchingCart`,
          null,
          { withCredentials: true }
        )
        .then((response) => {
          setCart(response.data.data);
          setCourseLoading(false);
        })
        .catch((err) => console.log(err));
    };
    fetchCart();
  }, []);

  const again = async () => {
    setCourseLoading(true);
    const fetchCart = async () => {
      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/api/carts/${UserM?._id}/fetchingCart`,
          null,
          { withCredentials: true }
        )
        .then((response) => {
          setCart(response.data.data);
          setCourseLoading(false);
        })
        .catch((err) => console.log(err));
    };
    fetchCart();
  };

  useEffect(() => {
    if (UserM?._id === undefined) {
      return navigate("/signin");
    }

    setTimeout(() => {
      if (!tokens) {
        const fetchCookies = async () => {
          await axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/api/users/getCookies`, {
              withCredentials: true,
            })
            .then((response) => {
              TokenValidation(response.data.data);
            })
            .catch((err) => {
              console.log(err);
            });
        };
        fetchCookies();
      }
    }, 200);

    setTimeout(()=>{
      TokenValidation()
    }, 200)

  }, []);

  const TokenValidation = () => {
    if (loggedIn === false) {
      const checkForTokenValidation = async () => {
        await axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/tokenValidation`,
            {
              withCredentials: true
            }
          )
          .then((response) => {
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
  };

  const payment = async (money) => {
    if (UserM?._id === undefined || UserM?._id === null || UserM?._id === "") {
      return navigate("/signin");
    }
    let C = {
      title: "Cart courses",
      price: money,
    };
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);
    const body = {
      C,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(
      "${process.env.REACT_APP_BACKEND_URL}/api/payments/paymentDone",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  };

  const addToWishlist = async (e, courseId) => {
    e.stopPropagation();
    if (loggedIn === false) {
      return redirect("/signin");
    }
    await axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/wishlists/${UserM?._id}/${courseId}/createwishlist`,
        null,
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        setCart((prev) => [prev, 0]);
        again();
      })
      .catch((err) => console.log(err));
  };

  const deleteToCart = async (e, courseId) => {
    if (loggedIn === false) {
      return redirect("/signin");
    }
    e.stopPropagation();
    await axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/carts/${UserM?._id}/${courseId}/delete`,
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data.data);
        setCart((prev) => [prev, 0]);
        again();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (searchValue === "") {
      searchbarClose();
    }

    const searchCourses = async () => {
      await axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/courses/${searchValue}/searchCourse`
        )
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

  console.log(cart, courseLoading);

  return (
    <div className="cart_container">
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
        <div
          onMouseEnter={() => {
            out(".dropdown");
            out(".dropdown2");
          }}
          className="inputContainer"
        >
          <form onSubmit={(e) => navigate("/search/" + searchValue)}>
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
          <img src={carts} alt="logo" />
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
        className="main_cart_container"
      >
        <div className="cart_heading">
          <h1>Shopping Cart</h1>
        </div>
        <div className="other_container">
          <div className="cart_course">
            {!courseLoading &&
              cart?.carts.map((C) => {
                return (
                  <div
                    onClick={() =>
                      (window.location.href = "/course/" + C?.course[0]?._id)
                    }
                    className="cart_course_box"
                  >
                    <div className="cart_course_image">
                      <img src={C?.course[0]?.thumbnail_url} alt="" />
                    </div>
                    <div className="cart_course_content">
                      <h1>{C?.course[0]?.title}</h1>
                      <p className="cart_course_author">
                        Created by {C?.course[0]?.instructor_name}
                      </p>
                      <div
                        className="rating_container ccr"
                        style={{ width: 40 }}
                      >
                        <p className="rating">
                          {C?.course[0]?.rating.toFixed(1) + " "}{" "}
                        </p>
                        <img src={star} alt="star" />
                      </div>
                      <p className="cart_course_price">
                        ₹{C?.course[0]?.price}{" "}
                        <del>
                          ₹{C?.course[0]?.price + C?.course[0]?.discount}
                        </del>
                      </p>
                    </div>

                    <div className="other_buttons">
                      <button
                        onClick={(e) => deleteToCart(e, C?.courseId)}
                        className="remove_cart_button"
                      >
                        Remove
                      </button>
                      <button
                        onClick={(e) => addToWishlist(e, C?.courseId)}
                        className="add_cart_button"
                      >
                        Add to Wishlist
                      </button>
                    </div>
                  </div>
                );
              })}
            {courseLoading && <p>Course is Loading...</p>}
            {!courseLoading && cart?.carts.length === 0 && (
              <p>Cart is empty...</p>
            )}
          </div>
          <div className="purchased_box">
            <h1>Total:</h1>
            <p>₹{cart?.real_price}</p>
            <del>₹{cart?.real_discount}</del>
            <div
              onClick={() => payment(cart?.real_price)}
              className="checkout_btn"
            >
              <p>Checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
