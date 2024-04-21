import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Dashboard } from "./Pages/Dashboard/Dashboard";
import { Navbar } from "./components/Navbar/Navbar";

import Login from "./Pages/login/Login";
import { Confg } from "./smartcontracts/reactfunccad/Auth";
import SignUp from "./Pages/login/Signup";
import PrivateRoutes from "./PrivateRoutes";
import { useEffect, useState } from "preact/hooks";
import CourseUpload from "./Pages/CourseUpload/CourseUpload";
import Course from "./Pages/course/Course";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<PrivateRoutes />}>
        <Route index element={<Dashboard />} />
        <Route path="course/:cid" element={<Course />} />
        <Route path="uploadcourse" element={<CourseUpload  />} />
      </Route>

      <Route path="login" element={<Login />} />

      <Route path="signup" element={<SignUp />} />
    </Route>
  )
);

export function App({ routes }) {
  return (
    <div
      class="absolute inset-0 z-[-99] h-screen w-screen bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"
    >
      <div
        class="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"
      >
        <RouterProvider router={router} />
     </div>
     </div>
  );
}
