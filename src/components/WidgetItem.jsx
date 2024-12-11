import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Map from './Map';
import "../styles/WidgetItem.css"; // Custom styling for widget

const getHealthImpact = (aqiLevel) => {
    switch (aqiLevel) {
        case 'Hazardous':
            return 'Serious health effects';
        case 'Severe':
            return 'Health alert: everyone may experience more serious health effects';
        case 'Unhealthy':
            return 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects';
        case 'Poor':
            return 'Members of sensitive groups may experience health effects. The general public is not likely to be affected';
        case 'Moderate':
            return 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution';
        case 'Good':
            return 'Air quality is considered satisfactory, and air pollution poses little or no risk';
        default:
            return '';
    }
};

const WidgetItem = ({ city, aqi , stations }) => {
    let pathColor = "";
    let aqiLevel = "";

    if (aqi >= 401 && aqi <= 500) {
        pathColor = "#da0e26";
        aqiLevel = "Hazardous";
    } else if (aqi >= 301 && aqi <= 400) {
        pathColor = "#de4df3";
        aqiLevel = "Severe";
    } else if (aqi >= 201 && aqi <= 300) {
        pathColor = "#FFC0CB";
        aqiLevel = "Unhealthy";
    } else if (aqi >= 101 && aqi <= 200) {
        pathColor = "#fe714d";
        aqiLevel = "Poor";
    } else if (aqi >= 51 && aqi <= 100) {
        pathColor = "#f2f11f";
        aqiLevel = "Moderate";
    } else {
        pathColor = "#21ed15";
        aqiLevel = "Good";
    }

    let emoji = "";
    if (aqiLevel === "Hazardous" || aqiLevel === "Severe") {
        emoji = "❗️"; // Exclamation emoji for hazardous and severe levels
    } else {
        emoji = "😊"; // Smiley emoji for other levels
    }

    return (
        <div className="widget-container">
            {/* Left section: Map */}
            <div className="map-container">
                <Map city = {city} stations={stations}/>
            </div>

            {/* Right section: AQI widget */}
            <div className="widget-info">
                <h4>{city}</h4>

                <CircularProgressbar
                    value={aqi}
                    text={`${aqi}`}
                    maxValue={350}
                    styles={buildStyles({
                        pathColor: pathColor,
                        textColor: pathColor,
                        trailColor: "#e6e6e6",
                        strokeWidth: 10,  // Reduced thickness of the circle
                    })}
                />


                <div
                    className="aqi-level"
                    style={{
                        color: pathColor,
                    }}
                >
                    {aqiLevel}
                </div>

                <p>
                    {emoji} Let's take a breath of fresh air! Keep track of Air Quality
                    for a healthier life. {emoji}
                </p>

                <p>
                    <span style={{ color: pathColor }}>Health Impact:</span>{" "}
                    {getHealthImpact(aqiLevel)}
                </p>
            </div>
        </div>
    );
};

export default WidgetItem;
