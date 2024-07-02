import React, { useState, useEffect } from "react";
import $ from "jquery";
import deletePng from "../../../assets/deletePng.png";

const IntendLearner = (props) => {
  const [courseData, setCourseData] = useState(props.courseData)
  const [form1Data, setForm1Data] = useState([]);
  const [form2Data, setForm2Data] = useState([]);
  const [form3Data, setForm3Data] = useState([{ id: Math.random(), value: "" }]);
  const [form4Data, setForm4Data] = useState([{ id: Math.random(), value: "" }]);
  const [language, setLanguage] = useState("");
  const [tag, setTag] = useState("");
  const [saveLanguage, setSaveLanguage] = useState([]);
  const [saveTags, setSaveTags] = useState(["ok"]);
  const [level, setLevel] = useState("Beginner");
  const languageList = [
    "Mandarin Chinese",
    "Spanish",
    "English",
    "Hindi",
    "Arabic",
    "Portuguese",
    "Bengali",
    "Russian",
    "Japanese",
    "Javanese",
    "German",
    "French",
    "Bhojpuri",
    "Punjabi",
    "Wu Chinese",
    "Korean",
    "Telugu",
    "Marathi",
    "Tamil",
    "Thai",
    "Vietnamese",
    "Sundanese",
    "Gujarati",
    "Turkish",
    "Polish",
    "Urdu",
    "Ukrainian",
    "Italian",
    "Malaysian",
    "Hausa",
    "Persian",
    "Sindhi",
    "Kannada",
  ];

  useEffect(()=>{
    if(courseData?.learning?.length > 3) {
      let a = []
      courseData?.learning?.map(i=>a.push({id:Math.random(), value: i}))
      setForm1Data(a);
    } else {
      setForm1Data([
        { id: Math.random(), value: "" },
        { id: Math.random(), value: "" },
        { id: Math.random(), value: "" },
        { id: Math.random(), value: "" },
      ]);
    }

      if(courseData?.requirements?.length > 0) {
        let a = []
        courseData?.requirements?.map(i=>a.push({id:Math.random(), value: i}))
        setForm2Data(a);
      } else {
        setForm2Data([
          { id: Math.random(), value: "" }
        ]);
      }

      if(courseData?.courseFor?.length > 0) {
        let a = []
        courseData?.courseFor?.map(i=>a.push({id:Math.random(), value: i}))
        setForm3Data(a);
      } else {
        setForm3Data([
          { id: Math.random(), value: "" }
        ]);
      }

      if(courseData?.course_includes?.length > 0) {
        let a = []
        courseData?.course_includes?.map(i=>a.push({id:Math.random(), value: i}))
        setForm4Data(a);
      } else {
        setForm4Data([
          { id: Math.random(), value: "" }
        ]);
      }

      setLevel(courseData?.level);

      setSaveLanguage(courseData?.languages)

      setSaveTags(courseData?.tags)

  }, [courseData])

  useEffect(() => {
    console.log(isFormValid(), isForm2Valid(), isForm3Valid(), isForm4Valid(), level.length > 0, saveLanguage.length > 0);
    if (isFormValid() && isForm2Valid() && isForm3Valid() && isForm4Valid() && level.length > 0 && saveLanguage.length > 0) {
      props.setRadio1(0);
      let form_1 = []
      let form_2 = []
      let form_3 = []
      let form_4 = []
      form1Data.map(i=> form_1.push(i.value))
      form2Data.map(i=> form_2.push(i.value))
      form3Data.map(i=> form_3.push(i.value))
      form4Data.map(i=> form_4.push(i.value))
      props.updateCourse({learning:form_1, requirements:form_2, courseFor:form_3, course_includes:form_4, languages:saveLanguage, level, tags: saveTags})
    } else {
      props.unsetRadio1(0);
    }
  }, [form1Data, form2Data, form3Data, form4Data, saveLanguage, level, saveTags]);

  

  // form 1 input
  const addFeildForm = () => {
    if (isFormValid() === true)
      setForm1Data((prevData) => [
        ...prevData,
        { id: Math.random(), value: "" },
      ]);
  };

  const handleInputChange = (index, value) => {
    setForm1Data((prevData) =>
      prevData.map((item, i) => (i === index ? { ...item, value } : item))
    );
  };

  const isFormValid = () => {
    return form1Data.every((item) => item.value !== "");
  };

  const removeField = (index) => {
    setForm1Data((prevData) => prevData.filter((item, i) => i !== index));
  };

  // form data 2

  const addFeildForm2 = () => {
    if (isForm2Valid() === true)
      setForm2Data((prevData) => [
        ...prevData,
        { id: Math.random(), value: "" },
      ]);
  };

  const handle2InputChange = (index, value) => {
    setForm2Data((prevData) =>
      prevData.map((item, i) => (i === index ? { ...item, value } : item))
    );
  };

  const isForm2Valid = () => {
    return form2Data.every((item) => item.value !== "");
  };

  const remove2Field = (index) => {
    setForm2Data((prevData) => prevData.filter((item, i) => i !== index));
  };

  // form data 3

  const addFeildForm3 = () => {
    if (isForm3Valid() === true)
      setForm3Data((prevData) => [
        ...prevData,
        { id: Math.random(), value: "" },
      ]);
  };

  const handle3InputChange = (index, value) => {
    setForm3Data((prevData) =>
      prevData.map((item, i) => (i === index ? { ...item, value } : item))
    );
  };

  const isForm3Valid = () => {
    return form3Data.every((item) => item.value !== "");
  };

  const remove3Field = (index) => {
    setForm3Data((prevData) => prevData.filter((item, i) => i !== index));
  };

  // form data 4
  const add4FeildForm = () => {
    if (isForm4Valid() === true)
      setForm4Data((prevData) => [
        ...prevData,
        { id: Math.random(), value: "" },
      ]);
  };

  const handle4InputChange = (index, value) => {
    setForm4Data((prevData) =>
      prevData.map((item, i) => (i === index ? { ...item, value } : item))
    );
  };

  const isForm4Valid = () => {
    return form4Data.every((item) => item.value !== "");
  };

  const remove4Field = (index) => {
    setForm4Data((prevData) => prevData.filter((item, i) => i !== index));
  };

  // languag in save 

  const addLanguagueInSave = (e) => {
    e.preventDefault();
    setSaveLanguage(prev=> {
      if(saveLanguage.includes(language) === false && languageList.includes(language) === true) {
        return [...prev, language];
      } else return prev;
    }
    )
    setLanguage("");
  }

  const deleteLang = (item) => {
    setSaveLanguage(prev => {
      return prev.filter(item1 => item1!== item)
    })
  }

  const deleteTag = (item) => {
    setSaveTags(prev => {
      return prev.filter(item1 => item1!== item)
    })
  }

  const addTagInSave = (e) => {
    e.preventDefault();
    setSaveTags(prev=> {
      if(saveTags.includes(tag) === false) {
        return [...prev, tag];
      } else return prev;
    }
    )
  }

  console.log(form1Data, form2Data, form3Data, form4Data);
  console.log(language, saveLanguage);

  return (
    <div className="Intend_container">
      <div className="Intend_heading">
        <h1>Intended Learners</h1>
      </div>

      <p>
        The following descriptions will be publicly visible on your Course
        Landing Page and will have a direct impact on <br />
        your course performance. These descriptions will help learners decide if
        your course is right for them.
      </p>
      <p>
        <strong>What will students learn in your course?</strong>
        <br />
        You must enter at least 4 learning objectives or outcomes that learners
        can expect to achieve after completing <br />
        your course.
      </p>

      {/* form 1 */}

      <div className="inputOfIntended">
        <form className="Form1">
          {form1Data.map((doc, i) => {
            return (
              <div key={doc.id} className="boxOfInput">
                <input
                  defaultValue={doc.value}
                  type="text"
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  name={"input" + i}
                />
                {form1Data.length > 4 && (
                  <img onClick={() => removeField(i)} src={deletePng} alt="" />
                )}
              </div>
            );
          })}
        </form>
        <button onClick={() => addFeildForm()} className="addInput">
          + Add more to your response
        </button>
      </div>

      <p>
        <strong>
          What are the requirements or prerequisites for taking your course?
        </strong>{" "}
      </p>
      <p>
        List the required skills, experience, tools or equipment learners should
        have prior to taking your course. <br />
        If there are no requirements, use this space as an opportunity to lower
        the barrier for beginners.
      </p>

      {/* form 2 */}

      <div className="inputOfIntended">
        <form className="Form1">
          {form2Data.map((doc, i) => {
            return (
              <div key={doc.id} className="boxOfInput">
                <input
                  defaultValue={doc.value}
                  type="text"
                  onChange={(e) => handle2InputChange(i, e.target.value)}
                  name={"input" + i}
                />
                {form2Data.length > 1 && (
                  <img onClick={() => remove2Field(i)} src={deletePng} alt="" />
                )}
              </div>
            );
          })}
        </form>
        <button onClick={() => addFeildForm2()} className="addInput">
          + Add more to your response
        </button>
      </div>

      <p>
        <strong>Who is this course for?</strong>
      </p>
      <p>
        Write a clear description of the intended learners for your course who
        will find your course content valuable. <br />
        This will help you attract the right learners to your course.
      </p>

      {/* form 3 */}

      <div className="inputOfIntended">
        <form className="Form1">
          {form3Data.map((item, i) => {
            return (
              <div key={item.id} className="boxOfInput">
                <input
                  defaultValue={item.value}
                  type="text"
                  onChange={(e) => handle3InputChange(i, e.target.value)}
                  name={`Input ${i + 1}`}
                />
                {form3Data.length > 1 && (
                  <img onClick={() => remove3Field(i)} src={deletePng} alt="" />
                )}
              </div>
            );
          })}
        </form>
        <button onClick={() => addFeildForm3()} className="addInput">
          + Add more to your response
        </button>
      </div>

      <p>
        <strong>What will this Course inclues ?</strong>
      </p>
      <p>
        Write a clear course includes points of the intended learners for your
        course who will find your course <br /> content valuable. This will help
        you attract the right learners to your course.
      </p>

      {/* form 4 */}

      <div className="inputOfIntended">
        <form className="Form1">
          {form4Data.map((item, i) => {
            return (
              <div key={item.id} className="boxOfInput">
                <input
                  defaultValue={item.value}
                  type="text"
                  onChange={(e) => handle4InputChange(i, e.target.value)}
                  name={`Input ${i + 1}`}
                />
                {form4Data.length > 1 && (
                  <img onClick={() => remove4Field(i)} src={deletePng} alt="" />
                )}
              </div>
            );
          })}
        </form>
        <button onClick={() => add4FeildForm()} className="addInput">
          + Add more to your response
        </button>
      </div>

      <p>
        <strong>
          What will be the languages in which the Course will be teach ?
        </strong>
      </p>
      <p>
        Fills the languages of the intended learners for your course who will
        find your course content valuable.
        <br /> This will help you attract the right learners to your course.
      </p>

      {/* form 5 langs*/}

      <div className="inputOfIntendedLanguage">
        <div className="languageBox">
          <div className="languageTagBox">
            {
              saveLanguage.map(item=>{
                return  <div className="langTag">
                          <p>{item}</p>
                          <p onClick={()=>deleteLang(item)}>X</p>
                        </div>
              })
            }
          </div>

          <form onSubmit={(e)=>addLanguagueInSave(e)}>
            <input onChange={(e)=>{setLanguage(e.target.value)}} list="lists" name="lang" id="lang" />
            <datalist id="lists">
              {
                languageList.map(lang => <option key={lang} value={lang} />)
              }
            </datalist>
            <input type="submit" id="langBtn" />
          </form>

        </div>
      </div>

      {/* form 6 tags*/}

      <p>
        <strong>
          What will be the tags in which the Course by which they shown in search results(cover all possiblities) ?
        </strong>
      </p>
      <p>
        select the tags of the intended learners for your course who will
        find your course content valuable.
        <br /> This will help you attract the right learners to your course.
      </p>


      <div className="inputOfIntendedLanguage">
        <div className="languageBox">
          <div className="languageTagBox">
            {
              saveTags.map(item=>{
                return  <div className="langTag">
                          <p>{item}</p>
                          <p onClick={()=>deleteTag(item)}>X</p>
                        </div>
              })
            }
          </div>

          <form onSubmit={(e)=>addTagInSave(e)}>
            <input onChange={(e)=>setTag(e.target.value)}  name="lang" id="lang" />
            
            <input type="submit" id="langBtn" />
          </form>

        </div>
      </div>



      <p>
        <strong>
          What will be the level of the Course ?
        </strong>
      </p>
      <p>
        Fills the level of course of the intended learners for your course who will
        find your course content valuable.
        <br /> This will help you attract the right learners to your course.
      </p>

      <select onChange={(e)=>setLevel(e.target.value)} id="level">
        <option selected={level === "Beginner"} value="Beginner">Beginner</option>
        <option selected={level === "Intermediate"} value="Intermediate">Intermediate</option>
        <option selected={level === "Expert"} value="Expert">Expert</option>
      </select>

    </div>
  );
};

export default IntendLearner;
