import { useEffect, useState } from "preact/hooks";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import SignUp from "./Signup";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [user, setUser] = useState({ loggedIn: false });
  const [profile, setProfile] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [firstlogin, setFirstlogin] = useState(false);
  let navigate = useNavigate()
  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
    console.log(user);
  }, []);

  useEffect(() => {
    localStorage.setItem("user", user.loggedIn);
    console.log(localStorage.getItem("user"))
  }, [user]);

  function inlog() {
    fcl.authenticate();
    setConfirm(true);
  }

  async function Qry() {
    console.log("hello");
    const res = await fcl.query({
      cadence: `
        import User from 0xf8d6e0586b0a20c7
    
        pub fun main(address: Address): User.ReadOnly? {
          return User.read(address)
        }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)],
    });
    console.log(res)
    
    if(res == "null" && res == "undefined"){
      formbase()
      setFirstlogin(true);
    }else{
      navigate('/')

    }
  }

  async function formbase() {
    await fcl.mutate({
      cadence: `
        import User from 0xf8d6e0586b0a20c7
    
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
    })

  }

  if (firstlogin) {
    return (
      <>
        <section class="bg-gray-50 dark:bg-gray-900 mt-10">
          <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a
              href="#"
              class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            >
              <img
                class="w-30 h-24 mr-2"
                src="/logom.png"
                alt="logo"
              />
            
            </a>
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
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
                      id="email"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@mail.com"
                      required=""
                    />
                  </div>
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      name
                    </label>
                    <input
                      type="name"
                      name="name"
                      id="name"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Name"
                      required=""
                    />
                  </div>
                  <label
                    for="message"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Info
                  </label>
                  <textarea
                    id="info"
                    rows="4"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Info......."
                  ></textarea>
                  <button
                    type="button"
                    class="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
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
      <div class="flex h-screen">
        <div class="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
          <div class="max-w-md w-full p-6">
            <img src="/logom.png" alt="" />
            <h1 class="text-3xl font-semibold mb-6 text-gray-500 text-center">
              {user.addr}
            </h1>
            <h1 class="text-sm font-semibold mb-6 text-gray-500 text-center">
              Join to Our Community with all time access
            </h1>
            <div class="mt-4 flex flex-col lg:flex-row items-center justify-between">
              <div class="w-full mx-2 lg:w-1/2 mb-2 lg:mb-0">
                <button
                  type="button"
                  class="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    width="23px"
                    id="google"
                  >
                    <path
                      fill="#fbbb00"
                      d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"
                    ></path>
                    <path
                      fill="#518ef8"
                      d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"
                    ></path>
                    <path
                      fill="#28b446"
                      d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"
                    ></path>
                    <path
                      fill="#f14336"
                      d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"
                    ></path>
                  </svg>{" "}
                  Sign in with Google
                </button>
              </div>
              <div class="w-full mx-2 lg:w-1/2 ml-0 lg:ml-2">
                <button
                  type="button"
                  class="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    id="github"
                    width="23px"
                  >
                    <path d="M7.999 0C3.582 0 0 3.596 0 8.032a8.031 8.031 0 0 0 5.472 7.621c.4.074.546-.174.546-.387 0-.191-.007-.696-.011-1.366-2.225.485-2.695-1.077-2.695-1.077-.363-.928-.888-1.175-.888-1.175-.727-.498.054-.488.054-.488.803.057 1.225.828 1.225.828.714 1.227 1.873.873 2.329.667.072-.519.279-.873.508-1.074-1.776-.203-3.644-.892-3.644-3.969 0-.877.312-1.594.824-2.156-.083-.203-.357-1.02.078-2.125 0 0 .672-.216 2.2.823a7.633 7.633 0 0 1 2.003-.27 7.65 7.65 0 0 1 2.003.271c1.527-1.039 2.198-.823 2.198-.823.436 1.106.162 1.922.08 2.125.513.562.822 1.279.822 2.156 0 3.085-1.87 3.764-3.652 3.963.287.248.543.738.543 1.487 0 1.074-.01 1.94-.01 2.203 0 .215.144.465.55.386A8.032 8.032 0 0 0 16 8.032C16 3.596 12.418 0 7.999 0z"></path>
                  </svg>{" "}
                  Sign Up with Github
                </button>
              </div>
            </div>
            <div class="w-full lg:w-1/2 mt-2 lg:mb-0">
              <button
                onClick={() => {
                  inlog();
                }}
                type="button"
                class="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
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
            </div>

            {confirm && (
              <div class="w-full lg:w-1/2 mt-2 lg:mb-0">
                <button
                  onClick={() => Qry()}
                  type="button"
                  class="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                >
                  {profile != "No Profile" ? "Confirm login" : "Sign Up"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
