import React, { useEffect, useState } from "react";
import InfoBox from "./components/InfoBox";
import MapM from "./components/MapM";
import Table from "./components/Table";
import LineGraph from "./components/LineGraph";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import { prettyPrintState, sortData } from "./helpers/utils";
import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    //call api and get countries
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);

          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        {/* Header */}
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem key="5555" value={country}>
                {country}
              </MenuItem>
              {countries.map((country, i) => (
                <MenuItem key={i} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* InfoBox */}
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus cases"
            cases={prettyPrintState(countryInfo.todayCases)}
            total={prettyPrintState(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintState(countryInfo.todayRecovered)}
            total={prettyPrintState(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintState(countryInfo.todayDeaths)}
            total={prettyPrintState(countryInfo.deaths)}
          />
        </div>

        {/* Map.jsx */}
        <MapM
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Live cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__right__h3">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
          {/* Graph */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
