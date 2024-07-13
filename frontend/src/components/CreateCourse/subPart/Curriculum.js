import React, { useEffect, useState } from "react";
import deletePng from "../../../assets/deletePng.png";
import pencil from "../../../assets/pencil.png";
import save from "../../../assets/save.png";
import axios from "axios";
import { cloneDeep } from "lodash";

const Curriculum = (props) => {
  const [videoData, setVideoData] = useState(null);
  const [SIndex, setSIndex] = useState([null]);
  const [SLIndex, setSLIndex] = useState([null, null]);
  const [lectureToBeDeleted, setLectureToBeDeleted] = useState([]);
  const [again, setAgain] = useState(false);
  const [vidoeBtn, setVidoeBtn] = useState(null);
  const [savedBtn, setSavedBtn] = useState("Saved");
  const [data, setData] = useState([
    {
      section_no: 0,
      section_title: "Introduction",
      lecture: [
        {
          lecture_no: 1,
          lecture_title: "New Lecture",
          file: null,
          description: "",
          _id: null,
        },
      ],
    },
  ]);

  function hasNullUndefinedEmptyString(obj) {
    if (obj === null || obj === undefined || obj === "") {
      return true;
    }
    if (typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key) && hasNullUndefinedEmptyString(obj[key])) {
          return true;
        }
      }
    }
    return false;
  }

  const transformData = (data1) => {
    const sectionsMap = {};

    data1.forEach((item) => {
      const {
        _id,
        section,
        section_title,
        lecture,
        lecture_title,
        description,
        video_url,
      } = item;
      if (!sectionsMap[section]) {
        sectionsMap[section] = {
          section_no: section,
          section_title: section_title,
          lecture: [],
        };
      }

      sectionsMap[section].lecture.push({
        lecture_no: lecture,
        lecture_title: lecture_title,
        file: video_url,
        description: description,
        _id,
        loading: 100,
      });
    });

    // Convert sections map to array and sort by section number
    const sectionsArray = Object.values(sectionsMap).sort(
      (a, b) => a.section_no - b.section_no
    );

    // Sort lectures within each section by lecture number
    sectionsArray.forEach((section) => {
      section.lecture.sort((a, b) => a.lecture_no - b.lecture_no);
    });

    const check = hasNullUndefinedEmptyString(sectionsArray);
    if (!check) {
      props.setRadio1(1);
    } else {
      props.unsetRadio1(1);
    }

    return sectionsArray;
  };

  useEffect(() => {
    const fetchvideoData = async () => {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/videos/${props.di}/logout`)
        .then((response) => {
          setVideoData(response.data.data);
          if (response.data.data.length > 0) {
            setData(transformData(response.data.data));
          }
          setSavedBtn("Saved");
        })
        .catch((error) => console.log(error));
    };
    fetchvideoData();
  }, [again]);

  useEffect(() => {
    let check = hasNullUndefinedEmptyString(data);
    if (check) {
      setSavedBtn("unsaved");
      props.unsetRadio1(1);
    }
  }, [data]);

  const editSection = (ind) => {
    setSIndex([ind]);
  };
  const saveSection = () => {
    setSIndex([null]);
  };
  const editLecture0 = (ind, index) => {
    setSLIndex([ind, index]);
  };
  const saveLecture0 = () => {
    setSLIndex([null, null]);
  };

  const updateSectionTitle = (e, index, id) => {
    let a = data;
    a[index].section_title = e.target.value;
    setData(a);
  };

  const deleteSection = (index) => {
    if (data.length === 1) {
      return;
    }
    let a = cloneDeep(data);
    setLectureToBeDeleted((prev) => {
      let g = [...prev];
      data[index].lecture.map((item) => {
        if(item._id !== null && item._id !== undefined) {
          g.push(item._id);
        }
      })
      return g;
    })
    a.splice(index, 1);
    a.map((item, i) => (item.section_no = i));

    setData(a);
  };

  const updateLectureTitle = (e, ind, index) => {
    let a = data;
    a[ind].lecture[index].lecture_title = e.target.value;
    setData(a);
  };

  const deleteLecture = async (ind, index, id) => {
    let b = cloneDeep(data);
    if (b[ind].lecture.length === 1) return;
    if (id !== undefined && id !== null && id !== "") {
      setLectureToBeDeleted((prev) => [...prev, id]);
    }
    console.log(ind, index);
    b[ind].lecture.splice(index, 1);
    b[ind].lecture.map((item, i) => (item.lecture_no = i + 1));
    setData(b);
  };

  const updateLectureDescription = (e, ind, index) => {
    let a = data;
    a[ind].lecture[index].description = e.target.value;
    setData(a);
  };

  const uploadVideo = (e, ind, index) => {
    let b = cloneDeep(data);

    let time = "0";
    if (e.target.files[0]) {
      function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
      }

      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        time = duration.toFixed(2); // Display duration with 2 decimal places
        b[ind].lecture[index].file = e.target.files[0];
        b[ind].lecture[index].file.time = formatTime(time);
        setData(b);
      };

      video.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  const deleteVideo = (ind, index) => {
    let b = cloneDeep(data);
    b[ind].lecture[index].file = null;
    setData(b);
  };

  const addLectureBox = (ind, index) => {
    console.log(data, "Before addLectureBox");
    let b = cloneDeep(data);
    console.log(ind, index + 1);

    b[ind].lecture.splice(index + 1, 0, {
      lecture_no: 1000,
      lecture_title: "New Lecture",
      file: null,
      description: "Enter Description",
      _id: null,
      loading: 100,
    });
    b[ind].lecture.map((ite, ins) => (ite.lecture_no = ins + 1));

    console.log(b, "after addLectureBox");

    setData(b);
  };

  const addSection = (ind) => {
    let b = cloneDeep(data);
    b.splice(ind + 1, 0, {
      section_no: 1000,
      section_title: "new section",
      lecture: [
        {
          _id: null,
          lecture_no: 1,
          lecture_title: "Introductio 1",
          file: null,
          description: "Enter Description",
          loading: 100,
        },
      ],
    });
    b.map((ite, ins) => (ite.section_no = ins));
    setData(b);
  };

  const revertData = (newData) => {
    let V = [];

    newData.forEach((section) => {
      section.lecture.forEach((lecture) => {
        V.push({
          _id: lecture._id,
          video: lecture.file,
          video_length: lecture.file?.time,
          lecture_title: lecture.lecture_title,
          lecture: lecture.lecture_no,
          description: lecture.description,
          section: section.section_no,
          section_title: section.section_title,
          courseId: props.di,
          loading: lecture.loading,
        });
      });
    });

    return V;
  };

  const saveVideoData = async () => {
    const D = revertData(data);
    setVidoeBtn(true);
    let a = 0;
    console.log(D);

    D?.map(async (doc) => {
      if (doc.video === null && doc._id === null) {
        console.log(doc, "in updateForVideoNullIdNull");
        await axios
          .put(
            `${process.env.REACT_APP_BACKEND_URL}/api/videos/updateForVideoNullIdNull`,
            {
              lecture: doc.lecture,
              section: doc.section,
              section_title: doc.section_title,
              lecture_title: doc.lecture_title,
              description: doc.description,
              courseId: doc.courseId,
            },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log(response);
            if (a < D.length) {
              a += 1;
            }
            if (a === D.length) {
              setAgain((prev) => !prev);
              setVidoeBtn(false);
            }
          })
          .catch((error) => console.log(error));
      } else if (doc.video === null && doc._id !== null) {
        console.log(doc, "in updateForVideoNullIdNotNull");
        await axios
          .put(
            `${process.env.REACT_APP_BACKEND_URL}/api/videos/${doc._id}/updateForVideoNullIdNotNull`,
            {
              lecture: doc.lecture,
              section: doc.section,
              section_title: doc.section_title,
              lecture_title: doc.lecture_title,
              description: doc.description,
              courseId: doc.courseId,
            },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log(response);
            if (a < D.length) {
              a += 1;
            }
            if (a === D.length) {
              setAgain((prev) => !prev);
              setVidoeBtn(false);
            }
          })
          .catch((error) => console.log(error));
      } else if (doc.video !== null && doc._id === null) {
        console.log(doc, "in updateForVideoNotNullIdNull");
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/videos/updateForVideoNotNullIdNull`,
            {
              lecture :doc.lecture,
              section :doc.section,
              section_title :doc.section_title,
              lecture_title :doc.lecture_title,
              description :doc.description,
              courseId :doc.courseId,
              video :doc.video,
              video_length: doc.video_length
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log(response);
            if (a < D.length) {
              a += 1;
            }
            if (a === D.length) {
              setAgain((prev) => !prev);
              setVidoeBtn(false);
            }
          })
          .catch((error) => console.log(error));
      } else {
        console.log(doc, "in updateVideoBothNotNull");
        await axios
          .put(
            `${process.env.REACT_APP_BACKEND_URL}/api/videos/${doc._id}/updateVideoBothNotNull`,
            {
              lecture: doc.lecture,
              section: doc.section,
              section_title: doc.section_title,
              lecture_title: doc.lecture_title,
              description: doc.description,
              courseId: doc.courseId,
              video: doc.video,
              video_length: doc.video_length,
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log(response);
            if (a < D.length) {
              a += 1;
            }
            if (a === D.length) {
              setAgain((prev) => !prev);
              setVidoeBtn(false);
            }
          })
          .catch((error) => console.log(error));
      }
    });

    lectureToBeDeleted.map(async (id) => {
      await axios
        .delete(`${process.env.REACT_APP_BACKEND_URL}/api/videos/${id}/deleteById`, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    });

    setLectureToBeDeleted([]);
  };

  const aTagClicked = (e, len) => {
    if (len > 0) {
      e.preventDefault();
    }
  };

  console.log(data, videoData);
  console.log(lectureToBeDeleted);
  // https://res.cloudinary.com/ddljwrgki/video/upload/v1716109001/lozclyp744ibfffwmvw3.mp4

  return (
    <div className="Curriculum_container">
      <div className="Intend_heading">
        <h1 style={{ fontSize: 25, fontWeight: 500, marginLeft: 50 }}>
          Curriculum
        </h1>
        <p
          onClick={() => saveVideoData()}
          style={{
            cursor: "pointer",
            backgroundColor: "blueviolet",
            marginLeft: 20,
            textAlign: "center",
            width: 100,
            fontSize: 20,
            color: "white",
          }}
        >
          {savedBtn}
        </p>
      </div>

      <p className="pp">
        {" "}
        Start putting together your course by creating sections, lectures. Start
        putting together your course by creating <br /> sections, lectures. Use
        your course outline to structure your content and label your sections
        and lectures clearly.
      </p>

      {/* yaha se suru hai section  */}

      {data?.map((section, ind) => {
        return (
          <>
            <div key={ind} className="section0">
              <div className="section_heading_box">
                <p>
                  <strong>Section {ind + 1}: </strong>
                </p>
                {SIndex[0] === ind && (
                  <>
                    <input
                      className="sectionInput"
                      type="text"
                      onChange={(e) => updateSectionTitle(e, ind)}
                      defaultValue={section.section_title}
                      name=""
                      id=""
                    />
                    <img onClick={() => saveSection()} src={save} alt="pic" />
                  </>
                )}
                {SIndex[0] !== ind && (
                  <>
                    <p>{section.section_title}</p>
                    <img
                      onClick={() => editSection(ind)}
                      style={{ marginRight: -5 }}
                      src={pencil}
                      alt="pic"
                    />
                    <img
                      src={deletePng}
                      onClick={() => deleteSection(ind)}
                      alt="pic"
                    />
                  </>
                )}
              </div>

              {section?.lecture?.map((lecture, index) => {
                return (
                  <>
                    <div key={lecture._id} className="lectureBox">
                      <div className="lectureHeading">
                        <p style={{ marginLeft: 20 }}>
                          <strong>Lecture {index + 1}</strong>
                        </p>
                        {(SLIndex[0] !== ind || SLIndex[1] !== index) && (
                          <>
                            <p>{lecture.lecture_title}</p>
                            <img
                              onClick={() => editLecture0(ind, index)}
                              style={{ marginRight: -5 }}
                              src={pencil}
                              alt=""
                            />
                            <img
                              src={deletePng}
                              onClick={() =>
                                deleteLecture(ind, index, lecture._id)
                              }
                              alt=""
                            />
                          </>
                        )}
                        {SLIndex[0] === ind && SLIndex[1] === index && (
                          <>
                            <input
                              className="sectionInput"
                              type="text"
                              defaultValue={lecture.lecture_title}
                              onChange={(e) =>
                                updateLectureTitle(e, ind, index)
                              }
                            />
                            <img
                              onClick={() => saveLecture0()}
                              style={{ marginRight: -5 }}
                              src={save}
                              alt=""
                            />
                          </>
                        )}
                      </div>

                      <div className="addVideo">
                        {vidoeBtn && (
                          <>
                            <p>uploading...</p>
                          </>
                        )}
                        {!vidoeBtn && lecture.file === null && (
                          <>
                            <p>
                              Add Video
                              <span>
                                <input
                                  onChange={(e) => uploadVideo(e, ind, index)}
                                  type="file"
                                  name=""
                                  id=""
                                />
                              </span>
                            </p>
                          </>
                        )}
                        {!vidoeBtn && lecture.file !== null && (
                          <>
                            <a
                              onClick={(e) =>
                                aTagClicked(e, lecture?.file?.name?.length)
                              }
                              href={lecture?.file}
                              target="_blank"
                            >
                              <p>
                                {lecture?.file?.name?.length > 0
                                  ? lecture?.file?.name
                                  : "See video"}
                              </p>
                            </a>
                            <img
                              onClick={() => deleteVideo(ind, index)}
                              src={deletePng}
                              alt=""
                              style={{ marginLeft: 20 }}
                              height={40}
                              width={40}
                            />
                          </>
                        )}
                      </div>

                      <div className="LectureDiscription">
                        <p>
                          <strong>Lecture Discription</strong>
                        </p>
                        <textarea
                          defaultValue={lecture.description}
                          onChange={(e) =>
                            updateLectureDescription(e, ind, index)
                          }
                          className="txtara"
                          placeholder="Insert Lecture discription..."
                          name=""
                          rows={5}
                        ></textarea>
                      </div>
                    </div>

                    <div className="addLectureBtn">
                      <p
                        style={{ marginLeft: 400 }}
                        onClick={() => addLectureBox(ind, index)}
                      >
                        + Insert Lecture
                      </p>
                    </div>
                  </>
                );
              })}
            </div>

            <div className="addLectureBtn">
              <p onClick={() => addSection(ind)}>+ Insert Section</p>
            </div>
          </>
        );
      })}

      {/* yaha section khatam hai  */}
    </div>
  );
};

export default Curriculum;
