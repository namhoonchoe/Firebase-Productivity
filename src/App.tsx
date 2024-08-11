import { RouterProvider } from "react-router-dom";
import RootRouter from "./components/Router";

function App() {
  return (
       <RouterProvider router={RootRouter} />
   );
}

export default App;
