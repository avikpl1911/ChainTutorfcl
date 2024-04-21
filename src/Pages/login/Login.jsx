import { useEffect, useState } from "preact/hooks";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import SignUp from "./Signup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Login() {
  const [user, setUser] = useState({ loggedIn: false });
  const [profile, setProfile] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [firstlogin, setFirstlogin] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  let navigate = useNavigate();
  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
    console.log(user);
  }, []);

  useEffect(() => {
    localStorage.setItem("user", user.loggedIn);
    console.log(localStorage.getItem("user"));
  }, [user]);

  function inlog() {
    fcl.authenticate();
    setConfirm(true);
  }

  async function Qry() {
    console.log("hello");
    const res = await fcl.query({
      cadence: `
        import User from  0xf8d6e0586b0a20c7
    
        pub fun main(address: Address): User.ReadOnly? {
          return User.read(address)
        }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)],
    });
    console.log(res);

    console.log(user.addr)

    if (res) {
      sessionStorage.setItem("user",true)
      navigate("/");
    } else {
      formbase();
      setFirstlogin(true);
      const res = await axios.post("http://localhost:7000/newuser",{
        address : user.addr
      },{
        header:{
          "Content-type":"application/json"
        }
      })
    }
  }

  const handleSubmit= async () => {
    



    const resp =await fcl.mutate({
      cadence: `
      import User from  0xf8d6e0586b0a20c7
    
        transaction(name: String,email: String,info: String) {
          prepare(currentUser: AuthAccount) {
            currentUser
              .borrow<&{User.Owner}>(from: User.privatePath)!
              .setName(name)
            currentUser
              .borrow<&{User.Owner}>(from: User.privatePath)!
              .setEmail(email)
            currentUser
              .borrow<&{User.Owner}>(from: User.privatePath)!
              .setInfo(info)
              
          }
        }
      `,
      args: (arg, t) => [arg(name, t.String),arg(email, t.String),arg(info, t.String)],
      limit: 55,
    });


    sessionStorage.setItem("user",true)
    navigate('/')
  };


  async function formbase() {
    await fcl.mutate({
      cadence: `
        import User from  0xf8d6e0586b0a20c7
    
        transaction {
          let address: Address
          prepare(currentUser: AuthAccount) {
            self.address = currentUser.address
            if !User.check(self.address) {
              currentUser.save(<- User.new(), to: User.privatePath)
              currentUser.link<&User.Base{User.Public}>(User.publicPath, target: User.privatePath)
            }
          }
          post {
            User.check(self.address): "Account was not initialized"
          }
        }
      `,
      limit: 55,
    });
  }

  if (firstlogin) {
    return (
      <>
        <section class=" mt-10">
          <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a
              href="#"
              class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            >
              <img class="w-30 h-24 mr-2" src="/logom.png" alt="logo" />
            </a>
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 glass backdrop-blur">
              <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create and account
                </h1>
                <div class="space-y-4 md:space-y-6" action="#">
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      id="email"
                      class="border border-gray-300 text-gray-900 sm:text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@mail.com"
                      required=""
                    />
                  </div>
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      name
                    </label>
                    <input
                      type="name"
                      name="name"
                      id="name"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      class=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Name"
                      required=""
                    />
                  </div>
                  <label
                    for="message"
                    class="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Info
                  </label>
                  <textarea
                    onChange={(e) => {
                      setInfo(e.target.value);
                    }}
                    id="info"
                    rows="4"
                    class="block p-2.5 w-full text-sm text-gray-900  rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Info......."
                  ></textarea>
                  <button
                    type="button"
                    class="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  } else {
    return (
      <div class=" h-screen">
        <div class="w-full lg:w-1/2 flex flex-row items-center justify-center">
          <div class="max-w-md w-full p-6">
            <img src="/logom.png" alt="" />
            <h1 class="text-3xl font-semibold mb-6 text-gray-500 text-center">
              {user.addr}
            </h1>
            <h1 class="text-sm font-semibold mb-6 text-gray-500 text-center">
              Join to Our Community with all time access
            </h1>
            
            
            </div>
            <div class="w-full lg:w-1/2 mt-2 lg:mb-0">
              <div className="flex flex-col">
              <button
                onClick={() => {
                  inlog();
                }}
                type="button"
                class="btn w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 42 42"
                  id="flow"
                  width="25px"
                >
                  <g clip-path="url(#clip0_106_24812)">
                    <path
                      d="M20.8333 41.8334C32.3393 41.8334 41.6667 32.506 41.6667 21.0001C41.6667 9.49415 32.3393 0.166748 20.8333 0.166748C9.3274 0.166748 0 9.49415 0 21.0001C0 32.506 9.3274 41.8334 20.8333 41.8334Z"
                      fill="#00EF8B"
                    ></path>
                    <path
                      d="M29.9732 17.7417H24.0898V23.625H29.9732V17.7417Z"
                      fill="white"
                    ></path>
                    <path
                      d="M18.2138 25.8292C18.2138 26.266 18.0843 26.6929 17.8416 27.0561C17.599 27.4192 17.2541 27.7023 16.8506 27.8694C16.447 28.0366 16.003 28.0803 15.5746 27.9951C15.1463 27.9099 14.7528 27.6996 14.4439 27.3907C14.1351 27.0819 13.9248 26.6884 13.8396 26.26C13.7544 25.8316 13.7981 25.3876 13.9652 24.9841C14.1324 24.5806 14.4154 24.2357 14.7786 23.993C15.1417 23.7504 15.5687 23.6209 16.0055 23.6209H18.2138V17.7417H16.0055C14.4059 17.7417 12.8423 18.216 11.5123 19.1047C10.1823 19.9934 9.14572 21.2564 8.5336 22.7342C7.92147 24.212 7.76131 25.8382 8.07337 27.407C8.38543 28.9758 9.15569 30.4169 10.2867 31.5479C11.4178 32.679 12.8589 33.4492 14.4277 33.7613C15.9965 34.0733 17.6226 33.9132 19.1004 33.3011C20.5782 32.6889 21.8413 31.6523 22.73 30.3224C23.6186 28.9924 24.093 27.4287 24.093 25.8292V23.6209H18.2138V25.8292Z"
                      fill="white"
                    ></path>
                    <path
                      d="M26.2984 14.8001H32.9151V8.91675H26.2984C24.1542 8.91895 22.0984 9.77174 20.5821 11.288C19.0659 12.8042 18.2131 14.86 18.2109 17.0042V17.7417H24.0901V17.0042C24.0912 16.4193 24.3244 15.8587 24.7384 15.4454C25.1524 15.0322 25.7135 14.8001 26.2984 14.8001V14.8001Z"
                      fill="white"
                    ></path>
                    <path
                      d="M18.2109 23.6209H24.0901V17.7417H18.2109V23.6209Z"
                      fill="#00EF8B"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_106_24812">
                      <rect
                        width="100"
                        height="41.6666"
                        fill="white"
                        transform="translate(0 0.166748)"
                      ></rect>
                    </clipPath>
                  </defs>
                </svg>
                Sign in with Flow
              </button>
              {confirm && (
              <div class="  mt-2 lg:mb-0">
                <button
                  onClick={() => Qry()}
                  type="button"
                  class="w-full items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                >
                  {profile != "No Profile" ? "Confirm login" : "Sign Up"}
                </button>
              </div>
            )}
            </div>

            
            </div>
          </div>
        </div>
   
    );
  }
}
