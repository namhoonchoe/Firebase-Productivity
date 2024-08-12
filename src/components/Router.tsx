import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Board from "@/pages/Board";
import Boards from "@/pages/Boards";
import Profile from "@/pages/Profile";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Pomodoro from "@/pages/Pomodoro";
import MemoIntro from "@/pages/MemoIntro";
import Memo from "@/pages/Memo";
import { Outlet } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import SidebarLayout from "./layouts/SidebarLayout";
const RootRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <SidebarLayout>
          <Outlet />
        </SidebarLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "boards",
        element: <Boards />,
      },
      { path: "boards/:boardId", element: <Board /> },
      { path: "memo", element: <MemoIntro /> },
      { path: "memo/:momoId", element: <Memo /> },

      { path: "profile", element: <Profile /> },
      { path: "pomodoro", element: <Pomodoro /> },
    ],
  },
  {
    path: "/auth",
    element: (
      <div className="fit-center">
        <Outlet />
      </div>
    ),
    children: [
      { path: "signup", element: <SignUp /> },
      { path: "signin", element: <SignIn /> },
    ],
  },
]);

export default RootRouter;
