import React, {useState, useEffect} from 'react'
import './CreateCourseStyle.css'
import logo from "../../assets/logo.png";
import heart from "../../assets/heart.png";
import cart from "../../assets/cart.png";
import search from "../../assets/search.png";
import gt from "../../assets/gt.png";
import user from "../../assets/user.png";
import axios from "axios";
import 'atropos/css';
import {useNavigate, useParams} from 'react-router';
import $ from 'jquery';
import {debounce} from 'lodash'
import CourseLandingPage from './subPart/CourseLandingPage';
import Pricing from './subPart/Pricing';
import IntendLearner from './subPart/IntendLearner';
import Curriculum from './subPart/Curriculum';

const CreateCourse = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const {courseDraftId} = useParams()
  const navigate = useNavigate();
  const UserM = JSON.parse(localStorage.getItem('user'))
  const [activeCat, setActiveCat] = useState(0);
  const [tokens, setTokens] = useState(null)
  const [searchValue, setSeatchValue] = useState('')
  const [searchCourses, setSearchCourses] = useState([])
  const [courseDraft, setCourseDraft] = useState(null)
  const debouncedSetInputValue = debounce(setSeatchValue, 500);
  const options = ["Plan Your Course", "Intended learners", "Create Your Course", "Curriculum", "Publish Your Course", "Course Landing Page", "Pricing"]
  const [indexOfOption, setIndexOfOption] = useState(0)
  const [updateCourse, setUpdateCourse] = useState(false)
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
      "App development"
    ],
  ];

  const redirect = (path) => {
    navigate(path);
  }


  useEffect(() => {
    $('.leftPartDashboard p:first-child').addClass('active')

    

    const fetchCourseDraft = async()=> {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/coursedrafts/fetchByCourseDraftId`,{ courseDraftId }, { withCredentials: true })
       .then((response) => {
          console.log(response.data.data);
          setCourseDraft(response.data.data.courseDraft)
          setUpdateCourse(response.data.data.update)
        })
       .catch((error) => {
          console.log(error);
        })
    }
    fetchCourseDraft()

    setTimeout(()=>{
      TokenValidation()
    }, 200)

    
  }, []);

  const fetchCourseDraftAgain = async()=> {
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/coursedrafts/fetchByCourseDraftId`,{ courseDraftId }, { withCredentials: true })
     .then((response) => {
        console.log(response.data.data);
        setCourseDraft(response.data.data.courseDraft)
        setUpdateCourse(response.data.data.update)
      })
     .catch((error) => {
        console.log(error);
      })
  }

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

  const logout = async () => {
    console.log("logout "+ tokens.accessToken);
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/logout`,null,  {

      withCredentials: true
    })
    .then((response) => {
      console.log(response.data.data);
      setLoggedIn(false)
      localStorage.removeItem('user')
      window.location.reload()
    })
    .catch((err) => console.log(err))
  }

  const active = (i) => {
    setIndexOfOption(i)
    const $a = $('.tickalso');
    $a[i].classList.add('active1');
    $a.not($a[i]).removeClass('active1');
  }

  const enter = (dropdownName) => {
    $(dropdownName).addClass("active");
    $(dropdownName).removeClass("unactive");
  };

  const out = (dropdownName) => {
      $(dropdownName).addClass("unactive");
      $(dropdownName).removeClass("active");
  };

  const searchbarOpen = () => {
    $('.search_dropdown').addClass('active');
    $('.search_dropdown').removeClass('unactive');
  }
  const searchbarClose = () => {
    $('.search_dropdown').removeClass('active');
    $('.search_dropdown').addClass('unactive');
  }

  useEffect(()=>{
    if(searchValue === '') {
      searchbarClose()
    }
    
    const searchCourses = async()=> {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/courses/${searchValue}/searchCourse`)
      .then(response=>{setSearchCourses(response.data.data);
        if(response.data.data.length > 0) {
          searchbarOpen()
        } else if(response.data.data.length === 0){
          searchbarClose()
        }
      })
      .catch(error=>console.log(error))
    }
    if(searchValue !== '') {
      searchCourses()
    }
  }, [searchValue])

  const setRadio1 = (i) => {
    console.log("chekced true");
    $('.tick'+i).prop('checked',true)
  }
  const unsetRadio1 = (i) => {
    console.log("chekced false");
    $('.tick'+i).prop('checked',false)
  }

  const updateCourseDraft = async(data)=>{
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/coursedrafts/updateTextData`, {courseDraftId, ...data}, {withCredentials:true})
    .then(response =>{console.log(response.data.data); setCourseDraft(response.data.data)})
    .catch(err =>console.log(err))
  }

  useEffect(()=>{
    if(courseDraft?.price >= 0 ) {
      setRadio1(3)
    }
    if(courseDraft?.title.length >= 0 && courseDraft?.thumbnail_url.length > 0 && courseDraft?.category?.length > 1) {
      setRadio1(2)
    }

  },[courseDraft])

  const CreateCourse = async () => {
    fetchCourseDraftAgain()
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/courses/createCourseByDraft`, {
      _id: courseDraft._id,
      owner: courseDraft.owner,
      title: courseDraft.title,
      languages: courseDraft.languages,
      thumbnail_url: courseDraft.thumbnail_url,
      price: courseDraft.price,
      discount: courseDraft.discount,
      certificate: courseDraft.certificate,
      about_course: courseDraft.about_course,
      course_includes: courseDraft.course_includes,
      instructor_name: UserM?.username,
      instructor_profession: UserM?.profession,
      about_instructor: UserM?.aboutUser,
      instructor_image_url: courseDraft.instructor_image_url,
      category: courseDraft.category,
      level: courseDraft.level,
      tags: courseDraft.tags,
      requirements: courseDraft.requirements,
      learning: courseDraft.learning,
      courseFor: courseDraft.courseFor,
      description: courseDraft.description,
    },
    {
      withCredentials: true
    })
    .then(response=>console.log(response))
    .catch(err=>console.log(err))
  }

  const updateCourseFn = async () => {
    fetchCourseDraftAgain()
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/courses/${courseDraft?._id}/updatecourse`, {
      title: courseDraft.title,
      languages: courseDraft.languages,
      thumbnail_url: courseDraft.thumbnail_url,
      price: courseDraft.price,
      discount: courseDraft.discount,
      certificate: courseDraft.certificate,
      about_course: courseDraft.about_course,
      course_includes: courseDraft.course_includes,
      instructor_name: UserM?.username,
      instructor_profession: UserM?.profession,
      about_instructor: UserM?.aboutUser,
      instructor_image_url: courseDraft.instructor_image_url,
      category: courseDraft.category,
      level: courseDraft.level,
      tags: courseDraft.tags,
      requirements: courseDraft.requirements,
      learning: courseDraft.learning,
      courseFor: courseDraft.courseFor,
      description: courseDraft.description,
    },
    {
      withCredentials: true
    })
    .then(response=>console.log(response))
    .catch(err=>console.log(err))
  }

  console.log(courseDraft);


  return (
    <div>
      {/* nav bar code  */}
      <nav>
        <div onClick={()=>redirect('/')} onMouseEnter={()=>out(".dropdown")} className="logo">
          <img src={logo} alt="logo" />
        </div>
        <h1 className="category" onMouseOver={()=>enter(".dropdown")}>
          Category
        </h1>
        <div onMouseEnter={()=>{out(".dropdown"); out(".dropdown2")}} className="inputContainer">
          <form onSubmit={(e)=>navigate('/search/'+searchValue)}>
            <input
              type="text"
              name="search"
              placeholder="Search for anything..."
              onChange={(e)=>debouncedSetInputValue(e.target.value)}
            />
          </form>
          <div onMouseEnter={()=>out(".dropdown1")} className="searchBtn">
            <img src={search} alt="" />
          </div>
        </div>

        <div onClick={()=>redirect('/wishlist')} onMouseEnter={()=>{out(".dropdown1");out(".dropdown2")}} className="icon">
          <img src={heart} alt="logo" />
        </div>
        <div onClick={()=>redirect('/cart')} onMouseEnter={()=>{
            console.log("chalna suru");
            out(".dropdown2");
            out(".dropdown1");
            console.log("chalna band");
          }} className="icon">
          <img src={cart} alt="logo" />
        </div>
        {
          loggedIn && 
          <div onMouseOver={()=>enter(".dropdown2")} className="circle">
            <img src={user} alt="" />
          </div>
        }

        {
          !loggedIn && 
          <div onMouseOver={()=>enter(".dropdown1")} className="circle">
            <img src={user} alt="" />
          </div>
        }

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
              return <p onClick={()=>navigate('/search/'+item)} key={index}>{item}</p>;
            })}
          </div>
        </div>

        {/* sign up and login dropdown menu */}
        <div className="dropdown1 unactive">
          <p onClick={()=>redirect('/signup')}>Sign Up</p>
          <p onClick={()=>redirect('/signin')}>Sign In</p>
        </div>

        {/* user Related dropdown  */} 
        <div className="dropdown2 unactive">
          <p onClick={()=>navigate('/dashboard')}>Dashboard</p>
          <p onClick={()=>logout()}>Logout</p>
        </div>

        {/* search dropdown */}
        <div className="search_dropdown unactive">
          {
            searchCourses?.map( C => {
              return <p key={C?._id} onClick={()=>redirect('/search/'+searchValue)}>{"search->"} {C?.title}</p>
            })
          }
        </div>

      </nav>

      <div onMouseEnter={()=>{out(".dropdown1"); out(".dropdown2"); out('.dropdown')}} className="dashboard_container">
        <div className="leftPartCreateCourse">
          {
            options.map((o, index)=> {
              if([1,3,5,6].includes(index))
                return <div key={index} onClick={()=>active([[1,3,5,6].indexOf(index)][0])} className="tickalso">
                  <input onClick={(e)=>e.preventDefault()} type="radio" className={"tick"+[[1,3,5,6].indexOf(index)][0]}/>
                  <p  key={o}>{o}</p>
                </div>
              else {
                return <h1 key={o}>{o}</h1>
              }
            })
          }
          {updateCourse && <p className='CBtn' onClick={()=>updateCourseFn()}>Update</p>}
          {!updateCourse && <p className='CBtn' onClick={()=>CreateCourse()}>Create</p>}
        </div>
        <div className="rightPartCreateCourse">
          {
            courseDraft && indexOfOption === 0 && <IntendLearner updateCourse={updateCourseDraft} courseData={courseDraft} unsetRadio1={unsetRadio1} setRadio1={setRadio1}></IntendLearner>
          }
          {
            courseDraft && indexOfOption === 1 && <Curriculum di={courseDraftId} updateCourse={updateCourseDraft} courseData={courseDraft} unsetRadio1={unsetRadio1} setRadio1={setRadio1}></Curriculum>
          }
          {
            courseDraft && indexOfOption === 2 && <CourseLandingPage di={courseDraftId} updateCourse={updateCourseDraft} courseData={courseDraft} unsetRadio1={unsetRadio1} setRadio1={setRadio1}></CourseLandingPage>
          }
          {
            courseDraft && indexOfOption === 3 && <Pricing updateCourse={updateCourseDraft} courseData={courseDraft} unsetRadio1={unsetRadio1} setRadio1={setRadio1}></Pricing>
          }
        </div>
        
      </div>

    </div>
  )
}

export default CreateCourse