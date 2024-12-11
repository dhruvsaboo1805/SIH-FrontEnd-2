import AdminSidebar from "../components/AdminSidebar";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown"; // Import react-markdown
import Loader from "../components/Loader";

const Health_recommendation = () => {
  const [loading, setLoading] = useState(false); // Loader state
  const [city, setCity] = useState("");
  const [aqi, setAqi] = useState("");
  const [health_issues, sethealth_issues] = useState("");
  const [responseMessage, setResponseMessage] = useState(""); // To display the API response

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Show loader
    const formData = {
      city,
      aqi,
      health_issues,
    };

    try {
      // Post the form data to your API endpoint
      const response = await axios.post(
        "https://sih.anujg.me/gemini",
        formData
      );

      // Format the response or set a fallback message
      const formattedResponse =
        response.data || "Recommendation received successfully!";
      setResponseMessage(formattedResponse);

      // Reset the form fields
      setCity("");
      setAqi("");
      sethealth_issues("");

      toast.success("Recommendation Generated Successfully");
    } catch (error) {
      console.error("Error while submitting the form:", error);
      toast.error("Recommendation Generation Unsuccessful");

      // Set error message
      setResponseMessage(
        error.response?.data?.message ||
          "An error occurred while submitting the form."
      );
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-container" style={{ display: "flex" }}>
        <main className="blog" style={{ flex: 1, padding: "20px" }}>
          <h2>Health Recommendation</h2>

          {/* Show Loader if loading */}
          {loading ? (
            <Loader />
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                style={{ maxWidth: "600px", margin: "0 auto" }}
              >
                <div style={{ marginBottom: "15px" }}>
                  <label htmlFor="city" style={{ fontWeight: "bold" }}>
                    City:
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter your City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "5px",
                      fontSize: "16px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label htmlFor="aqi" style={{ fontWeight: "bold" }}>
                    AQI (Air Quality Index):
                  </label>
                  <input
                    type="number"
                    id="aqi"
                    placeholder="Enter your City AQI"
                    name="aqi"
                    value={aqi}
                    onChange={(e) => setAqi(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "5px",
                      fontSize: "16px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label htmlFor="health_issues" style={{ fontWeight: "bold" }}>
                    Health Issues:
                  </label>
                  <textarea
                    id="health_issues"
                    name="health_issues"
                    placeholder="Tell about your health concerns"
                    value={health_issues}
                    onChange={(e) => sethealth_issues(e.target.value)}
                    required
                    rows="4"
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "5px",
                      fontSize: "16px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    style={{
                      padding: "10px 15px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Get Recommendation
                  </button>
                </div>
              </form>

              {/* Display the response message */}
              {responseMessage && (
                <div
                  style={{
                    maxWidth: "800px",
                    margin: "0 auto",
                    marginTop: "20px",
                    padding: "20px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #ddd",
                    color: "#333",
                    lineHeight: "1.6",
                    display: responseMessage ? "block" : "none", // Hide when no response
                  }}
                >
                  <ReactMarkdown>{responseMessage}</ReactMarkdown>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Health_recommendation;
