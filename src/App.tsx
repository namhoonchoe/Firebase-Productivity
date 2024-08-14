import { RouterProvider } from "react-router-dom";
import RootRouter from "./components/Router";
import SessionProvider from "./components/auth/SessionProvider";
function App() {
  return (
    <SessionProvider>
      <RouterProvider router={RootRouter} />
    </SessionProvider>
  );
}

export default App;
