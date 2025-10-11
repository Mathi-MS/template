import CustomToast from "./Custom/CustomToast";
import { ReactQueryProvider } from "./Hooks/ReactQueryProvider";
import "./index.css";
import routes from "./Routes/Routes";
import { RouterProvider } from "react-router-dom";
import  { useEffect, useState } from "react";
import LoaderSplash from "./Components/LoaderSplash";
import { UserProvider } from "./Config/userContext";
import "antd/dist/reset.css";

import { Query, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  // Show splash for 20 seconds on app start
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  const queryClient = new QueryClient();

  return (
    <>
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          {showSplash ? <LoaderSplash /> : <RouterProvider router={routes} />}
        </QueryClientProvider>
        <CustomToast />
      </UserProvider>
    </>
  );
};
export default App;
