import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, lazy, useEffect } from "react";
import Loader from "./components/Loader";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import "./App.css";
import { useState } from "react";

// ** pages lazy import()
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AqiIndex = lazy(() => import("./pages/AqiIndex"));
const RecentBlogs = lazy(() => import("./pages/RecentBlogs"));
const Blog = lazy(() => import("./pages/Blog"));
const Health = lazy(() => import("./pages/Health"));
const Contact = lazy(() => import("./pages/Contact"));
const Forecast = lazy(() => import("./pages/Forecast"));
const Health_recommendation = lazy(() =>
  import("./pages/Health_recommendation")
);
const DownloadData = lazy(() => import("./pages/DownloadData"));
const CityData = lazy(() => import("./pages/CityData"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/Signup"));
const AQI_spike = lazy(() => import("./pages/AQI_spike"));
const Graph_data = lazy(() => import("./pages/Graph_data"));

// const [isAuthenticated, setIsAuthenticated] = useState(false);


const App = () => {
  useEffect(() => {
    // Clear any toasts when the component is unmounted or on re-render
    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/home" element={<PrivateRoute element={<Home />} />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/aqi/index" element={<AqiIndex />} />
          <Route path="/blogs" element={<RecentBlogs />} />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/health" element={<Health />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/aqi_spike" element={<AQI_spike />} />
          <Route
            path="/health_recommendation"
            element={<Health_recommendation />}
          />
          <Route path="/city_data_comparision" element={<CityData />} />
          <Route path="/download" element={<DownloadData />} />
          <Route path="/daily_trends" element={<Graph_data />} />
          
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000} // Automatically close after 3 seconds
          hideProgressBar={false} // Show progress bar (optional)
          newestOnTop={true} // Newest toast on top
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
