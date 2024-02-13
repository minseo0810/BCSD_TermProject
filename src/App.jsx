import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Champions from "./Champions";
import ChampionsDetails from "./ChampionsDetails";
import Home from "./Home";
import SummonerInfo from "./SummonerInfo";
import logo from "./BCSDLOGO.png";
import "./App.css";

function App() {
  const [summonerData, setSummonerData] = useState({
    encryptedPUUID: "",
    gameName: "",
    tagLine: "",
    profileIconId: "",
    summonerLevel: "",
  });

  const updateSummonerData = (data) => {
    setSummonerData(data);
  };

  const [championName, setChampionName] = useState("");

  return (
    <BrowserRouter>
      <div>
        <h1>광고 받습니다</h1>
        <header>
          <div>
            <NavLink to="/">
              <img className="logoImg" src={logo} />
            </NavLink>
          </div>
          <div className="header-nav">
            <span>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "nav-active" : "")}
              >
                홈
              </NavLink>
            </span>
            <span>
              <NavLink
                to="/champions"
                className={({ isActive }) => (isActive ? "nav-active" : "")}
              >
                챔피언
              </NavLink>
            </span>
            <span>
              <NavLink to="/">게임 모드</NavLink>
            </span>
            <span>
              <NavLink to="/">통계</NavLink>
            </span>
            <span>
              <NavLink to="/">랭킹</NavLink>
            </span>
          </div>
        </header>
        <Routes>
          <Route
            path="/"
            element={<Home updateSummonerData={updateSummonerData} />}
          ></Route>
          <Route
            path="/champions"
            element={<Champions setChampionName={setChampionName} />} // 추가
          ></Route>
          <Route
            path="/summonerInfo"
            element={<SummonerInfo data={summonerData} />}
          ></Route>
          <Route
            path="/champions/:championName"
            element={<ChampionsDetails />}
          ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
