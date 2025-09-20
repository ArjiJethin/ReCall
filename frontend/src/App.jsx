import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Home from "./pages/Home";
import ComputerNetworks from "./pages/ComputerNetworks";
import MachineLearning from "./pages/MachineLearning";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/ComputerNetworks",
    element: <ComputerNetworks />,
  },
  {
    path: "/MachineLearning",
    element: <MachineLearning />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

