import { useEffect, useState } from "preact/hooks";
import { Navbar } from "../../components/Navbar/Navbar";
import "./course.css";
import * as fcl from "@onflow/fcl";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CourseUpload() {
  const [currinputtype, setcurrentinputtype] = useState(null);
  const [currentsectionname, setcurrentsectionname] = useState(null);
  const [currenturl, setcurrenturl] = useState(null);
  const [arrayofsec, setarrayofsection] = useState([]);
  const [processcourse, setprocesscourse] = useState(false);
  const [coursename, setcoursename] = useState("");
  const [description, setdescription] = useState("");
  const [user, setuser] = useState(null);
  const [file, setFile] = useState(null);
  const [imageurl, setImageUrl] = useState(null);
  const [courseprice, setcourseprice] = useState(null);
  const navigate = useNavigate();
  const addnewsection = () => {
    if (currenturl) {
      if (currentsectionname) {
        if (currinputtype) {
          setarrayofsection([
            ...arrayofsec,
            {
              doctype: currinputtype,
              url: currenturl,
              sectionname: currentsectionname,
            },
          ]);
          setcurrentinputtype(null);
          setcurrentsectionname(null);
          setcurrenturl(null);
        }
      }
    }
  };

  const getBase64 = (fileoo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileoo);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlesumbit = async () => {
    const base64Data = await getBase64(file);
    const resp = await axios.post(
      "http://localhost:7000/uploadcourse",
      {
        user: user.addr,
        sections: arrayofsec,
        name: coursename,
        img: base64Data,
        description: description,
        price: courseprice,
      },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    console.log(resp)

    if (resp.status == 200) {
      navigate("/");
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    fcl.currentUser.subscribe(setuser);
  }, []);

  return (
    <div>
      <Navbar />
      {processcourse ? (
        <div className="h-screen  overflow-y-scroll ">
          <div className="w-screen flex justify-center mt-1">
            <input
              type="text"
              placeholder="Section Name"
              onChange={(e) => {
                setcurrentsectionname(e.target.value);
              }}
              className="input input-bordered input-primary w-full max-w-xs mx-auto"
            />
          </div>

          <div className="w-screen flex justify-center  flex-col">
            <select
              className="select w-full max-w-xs mx-auto mt-5 "
              onChange={(e) => {
                setcurrentinputtype(e.target.value);
              }}
            >
              <option disabled selected>
                data type
              </option>
              <option>document</option>
              <option>video</option>
            </select>
            <div className="w-screen flex justify-center my-2">
              <input
                type="text"
                placeholder="data url"
                onChange={(e) => {
                  setcurrenturl(e.target.value);
                }}
                className="input input-bordered input-primary w-full max-w-xs "
              />
              {/* <button className="btn">add</button> */}
            </div>
            <button
              className="btn w-48 mx-auto mt-2"
              onClick={() => {
                addnewsection();
              }}
            >
              add new Section
            </button>
            {arrayofsec.length > 0 && (
              <button
                className="btn w-48 mx-auto mt-2 mb-10"
                onClick={() => {
                  handlesumbit();
                }}
              >
                Upload Course
              </button>
            )}
          </div>

          <div class=" w-1/2 mx-auto mt-2 h-screen  overflow-y-scroll ">
            {arrayofsec.map &&
              arrayofsec.map((sec, index) => {
                return (
                  <div className="collapse collapse-arrow bg-base-200">
                    <input type="radio" name="my-accordion-2" defaultChecked />
                    <div className="collapse-title text-xl font-medium">
                      {`Section ${index + 1}: ${sec.sectionname}`}
                    </div>
                    <div className="collapse-content">
                      <p>{`${sec.doctype} url : ${sec.url}`}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="w-screen flex justify-center flex-col mt-10">
          <input
            type="text"
            placeholder="Course Name"
            className="input input-bordered w-full max-w-xs mx-auto"
            onChange={(e) => {
              setcoursename(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="price"
            className="input input-bordered w-full max-w-xs mx-auto"
            onChange={(e) => {
              setcourseprice(e.target.value);
            }}
          />
          <div className="flex justify-center  w-screen mt-5">
            <textarea
              className="textarea textarea-bordered w-56 h-42"
              placeholder="Description"
              onChange={(e) => {
                setdescription(e.target.value);
              }}
            ></textarea>
          </div>
          <div className="flex flex-col justify-center w-screen mt-10">
            <div
              className="btn"
              onClick={() => {
                setprocesscourse(true);
              }}
            >
              start uploading
            </div>
            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setImageUrl(URL.createObjectURL(e.target.files[0]));
              }}
              value={file}
              className="file-input w-full max-w-xs mx-auto my-3"
            />
          </div>

          {imageurl != null && (
            <div className="w-full">
              <>
                <img
                  src={imageurl}
                  className="w-48 mx-auto"
                  alt="Selected File"
                />
              </>
              <div className="mx-auto w-fit pt-2">
                {/* <button
                  className="btn btn-success mr-1"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Accept
                </button> */}
                <button
                  className="btn btn-error ml-1"
                  onClick={() => {
                    setImageUrl(null);
                    setFile(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
