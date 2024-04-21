import React from "react";

function Overview({course,isowned,isproduced,handlebuy,sections}) {
  return (
    <div>
     
      <div className="h-screen overflow-y-scroll">
        <div
          id="container"
          class="p-20 w-auto flex px-24 justify-center relative"
        >
          <div
            id="container"
            class="p-20 sm:p-16 md:p-20 lg:p-24 xl:p-20 w-auto flex flex-col md:flex-row px-4 sm:px-8 md:px-24 lg:px-24 xl:px-24 relative"
          >
            <div class="mr-10">
              {course && course.img && (
                <img
                  class="rounded-lg min-w-[100px] w-full h-auto md:w-auto md:h-auto"
                  src={`http://localhost:7000/img/course/${course.img}`}
                  alt="image of myself"
                />
              )}
            </div>
            <div class="w-full sm:w-[70%] md:w-[60%] lg:w-[50%]">
              <h1 class="text-gray-800 font-bold text-3xl mt-6 mb-8">
                {course && course.name}
              </h1>

              <p class="text-gray-800 w-full sm:w-[35rem] md:w-[30rem] lg:w-[25rem] mb-10">
                I'm Aydin, a 18-year-old high schooler with a passion for web
                development. My tech journey started with HTML, CSS, and
                JavaScript, and I was hooked by the thrill of crafting dynamic,
                interactive websites. As I grew, Node.js and ReactJS became my
                go-to tools for building scalable applications. Feel free to
                connect if you have questions, collaboration ideas, or just want
                to discuss the latest in web development!
              </p>

              <div
                id="social"
                class="flex flex-wrap justify-start items-center gap-4"
              >
                {isowned || isproduced ? (
                  <></>
                ) : (
                  <div
                    class="bg-gray-800 rounded-lg p-5 w-64 flex items-center gap-2 text-white"
                    onClick={() => {
                      handlebuy();
                    }}
                  >
                    <img
                      class="mr-2 hover:scale-105 transition duration-300 ease-in-out"
                      src="https://i.ibb.co/BN5bj6V/flow-flow-logo.png"
                      width="20px"
                      height="20px"
                      alt="Github"
                    />
                    <span>Buy {course && course.price} flow</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
