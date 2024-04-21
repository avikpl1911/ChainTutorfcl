import { useEffect, useState } from "preact/hooks";
import React from "react";
import * as fcl from "@onflow/fcl";
import { useParams } from "react-router-dom";
import axios from "axios";
import Overview from "./coursepages/Overview";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import mintNFT from "./Mintnft";

function Course() {
  const [user, setuser] = useState(null);

  const [course, setcourse] = useState(null);
  const { cid } = useParams();
  const [isproduced, setisproduced] = useState(false);
  const [isowned, setisowned] = useState(false);
  const [sections, setsections] = useState([]);
  const [currpage, setcurrpage] = useState("view");
  const [currsection, setCurrsection] = useState({});
  const [certbutton, setcertbutton] = useState(false);
  const [ifcert, setifcert] = useState(false);
  const [imgurl, setimgurl] = useState("");

  const getsections = async (user) => {
    const resp = await axios.post(
      "http://localhost:7000/coursesections",
      {
        user: user.addr,
        course: cid,
      },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    setsections(resp.data);
  };

  const getuser = async (user) => {
    const resp = await axios.get(`http://localhost:7000/user/${user.addr}`);

    console.log(resp.data);
    if (resp.data.producedcourses.findIndex((pc) => pc == cid) != -1) {
      setisproduced(true);
      getsections(user);
    }

    if (resp.data.ownedcourses.findIndex((oc) => oc.id == cid) != -1) {
      setisowned(true);
      getsections(user);
    }
  };

  const getaboutcourse = async () => {
    const resp = await axios.get(`http://localhost:7000/course/${cid}`);
    console.log(resp.data);
    setcourse(resp.data);
  };

  const handlemint = async () => {
    const respp = await axios.post(
      `http://localhost:7000/makecert`,
      {
        user: user.addr,
        courseid: cid,
      },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    
    if(respp.status==200){
      
      setimgurl(respp.data.filename)
      setifcert(true);
      mintnft(respp.data.filename)
    }
  };

  const mintnft = (filename)=>{
    mintNFT("pdf",filename)
  }



  const nextsection = async (index) => {
    console.log(index);
    const ressp = await axios.post(
      `http://localhost:7000/changestatus`,
      {
        user: user.addr,
        status: index,
        courseid: cid,
      },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    if (ressp.data.status == 2) {
      setcertbutton(true);
    }
  };

  useEffect(() => {
    if (isproduced == false) {
      if (currsection.sec && currsection.sec.doctype == "document") {
        console.log(currsection.index);
        nextsection(currsection.index);
      }
    }
  }, [currsection]);

  const getifimg = async () => {
    const respp = await axios.get(`http://localhost:7000/cert/${cid}/${user.addr}`);
    if (respp.status == 200) {
      setifcert(true);
      setimgurl(respp.data.cert.file);
    }
  };

  useEffect(() => {
    if (currpage == "cert") {
      getifimg();
    }
  }, [currpage]);

  const handlebuy = async () => {
    const sendFlow = async (recepient, amount) => {
      const cadence = `
            import FungibleToken from 0xee82856bf20e2aa6
            import FlowToken from 0x0ae53cb6e3f42a79
        
            transaction(recepient: Address, amount: UFix64){
              prepare(signer: AuthAccount){
                let sender = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
                  ?? panic("Could not borrow Provider reference to the Vault")
        
                let receiverAccount = getAccount(recepient)
        
                let receiver = receiverAccount.getCapability(/public/flowTokenReceiver)
                  .borrow<&FlowToken.Vault{FungibleToken.Receiver}>()
                  ?? panic("Could not borrow Receiver reference to the Vault")
        
                        let tempVault <- sender.withdraw(amount: amount)
                receiver.deposit(from: <- tempVault)
              }
            }
            `;
      const args = (arg, t) => [
        arg(recepient, t.Address),
        arg(amount, t.UFix64),
      ];
      const limit = 500;

      const txId = await fcl.mutate({ cadence, args, limit });
      console.log(txId);
      const resx = await axios.post(
        `http://localhost:7000/buy`,
        {
          user: user.addr,
          txid: txId,
          courseid: cid,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      if (resx.status == 200) {
        window.location.reload();
      }
    };
    const ff = 11.11;
    const rpient = course.OriginalOwner;
    const price = course.price.toFixed(2);
    console.log();
    sendFlow(rpient, price);
  };

  useEffect(() => {
    fcl.currentUser.subscribe(setuser);
    fcl.currentUser.subscribe(getuser);
    getaboutcourse();
  }, []);

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content h-screen overflow-y-scroll">
        {/* Page content here */}
        <label
          htmlFor="my-drawer"
          className="btn btn-primary drawer-button m-2 z-99  "
        >
          Open drawer
        </label>

        {currpage == "cert" && (
          <div
            className="flex justify-center align-center h-screen "
            style={{ marginTop: "250px" }}
          >
            {ifcert ? (
              <>
                <object
                  className="pdf mx-auto h-full"
                  data={"http://localhost:7000/mycert/"+imgurl}
                  width="800"
                  height="500"
                ></object>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={()=>{handlemint()}}>
                  mint cert
                </button>
              </>
            )}
          </div>
        )}

        {currpage == "view" && (
          <Overview
            isproduced={isproduced}
            isowned={isowned}
            course={course}
            handlebuy={handlebuy}
          />
        )}

        {currpage == "section" && (
          <div className="w-screen  overflow-y-scroll">
            <p className="text-3xl" style={{ margin: "50px" }}>
              {`Section ${currsection.index} : ${currsection.sec.sectionname}`}
            </p>
            {currsection.sec.doctype == "document" && (
              <object
                className="pdf mx-auto h-full"
                data={currsection.sec.url}
                width="800"
                height="500"
              ></object>
            )}

            {currsection.sec.doctype == "video" && (
              <MediaPlayer
                onEnd={() => {
                  if (isproduced == false) {
                    nextsection(currsection.index);
                  }
                }}
                title="Sprite Fight"
                src={currsection.sec.url}
              >
                <MediaProvider />
                <DefaultVideoLayout icons={defaultLayoutIcons} />
              </MediaPlayer>
            )}
          </div>
        )}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li
            onClick={() => {
              setcurrpage("view");
            }}
          >
            <a>Overview</a>
          </li>
          {sections.map((sec, index) => {
            console.log(sec);
            return (
              <li
                key={index}
                onClick={() => {
                  setcurrpage("section");
                  setCurrsection({ sec, index: index + 1 });
                }}
              >
                <a>{`Section ${index + 1} : ${sec.sectionname}`}</a>
              </li>
            );
          })}
          {certbutton && (
            <li
              onClick={() => {
                setcurrpage("cert");
              }}
            >
              <a>certificate</a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Course;
