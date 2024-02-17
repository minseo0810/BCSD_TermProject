import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Home.css";
import banner from "./BCSD.png";
import * as api from "./api.jsx";

const Home = ({ updateSummonerData }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [region, setRegion] = useState("asia");
  const [encryptedPUUID, setEncryptedPUUID] = useState("");
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // 로컬 스토리지에서 검색 기록 로드
  useEffect(() => {
    const loadedSearchHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(loadedSearchHistory);
  }, []);

  // 입력 필드 클릭 시 검색 기록 보여주기
  const handleInputClick = () => {
    setShowHistory(true);
  };

  //로컬스토리지에 10개의 정보만을 저장
  const updateSearchHistory = (newSearch) => {
    const updatedSearchHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!updatedSearchHistory.includes(newSearch)) {
      updatedSearchHistory.unshift(newSearch); // 새 검색 항목을 배열의 시작 부분에 추가
      if (updatedSearchHistory.length > 10) {
        updatedSearchHistory.pop(); // 배열이 10개를 초과하면 가장 오래된 항목 제거
      }
      localStorage.setItem(
        "searchHistory",
        JSON.stringify(updatedSearchHistory)
      );
      setSearchHistory(updatedSearchHistory);
    }
  };

  // 검색 기록을 클릭하면 해당 검색어로 검색 수행
  const handleSearchHistoryClick = (clickedSearch) => {
    setInputValue(clickedSearch); // 클릭된 검색 기록으로 입력 값을 설정
    setShowHistory(false);
    // 검색 실행을 위해 기존 handleSearch 함수 사용
    handleSearch(clickedSearch);
  };

  //엔터 키 입력시 검색 함수 작동
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // 검색 버튼 클릭시 또는 로컬스토리지 데이터 선택시 작동
  const handleSearch = async (searchValue = inputValue) => {
    setShowHistory(false);

    // searchValue가 문자열이 아니거나 undefined, null인 경우 예외 처리
    if (typeof searchValue !== "string" || !searchValue.trim()) {
      alert("검색어가 올바르지 않습니다.");
      return;
    }

    const [name, line] = searchValue.split("#");
    if (!name || !line) {
      alert("올바른 형식의 검색어가 아닙니다.");
      return;
    }

    try {
      const response = await axios.get(api.getSummonerByRiotId(name, line));
      setEncryptedPUUID(response.data.puuid);
      setGameName(response.data.gameName);
      setTagLine(response.data.tagLine);

      // 검색이 성공했을 때만 로컬 스토리지에 데이터 저장
      updateSearchHistory(searchValue);
    } catch (error) {
      console.error("첫 번째 API 요청 중 오류 발생:", error);
    }
  };

  //소환사 이름, 태그, 아이콘, 레벨을 저장하는 함수
  useEffect(() => {
    if (!encryptedPUUID) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          api.getSummonerByPUUID(encryptedPUUID)
        );
        const data = {
          encryptedPUUID,
          gameName,
          tagLine,
          profileIconId: response.data.profileIconId,
          summonerLevel: response.data.summonerLevel,
        };

        updateSummonerData(data); // App 컴포넌트의 상태 업데이트
        navigate("/summonerInfo"); // SummonerInfo 페이지로 이동
      } catch (error) {
        console.error("두 번째 API 요청 중 오류 발생:", error);
      }
    };

    fetchData();
  }, [encryptedPUUID, gameName, tagLine, updateSummonerData, navigate]);

  return (
    <>
      <div className="main">
        <div>
          <img className="banner-img" src={banner} alt="BCSD Logo" />
        </div>
        <div className="search-section">
          <table className="search-table">
            <tbody>
              <tr>
                <td>
                  <label className="input-label">지역</label>
                </td>
                <td>
                  <label className="input-label">검색</label>
                </td>
                <td rowSpan="2">
                  <button className="search-button" onClick={handleSearch}>
                    .BCSD
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <select
                    className="region-select"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    <option value="Korea">Korea</option>{" "}
                    {/* 지역 값도 변수로 API를 사용할 수 있으나 Proxy 문제로 인해 지역은 Korea 또는 Asia로 통일 */}
                  </select>
                </td>
                <td>
                  <input
                    className={`search-input ${inputValue ? "filled" : ""}`}
                    type="text"
                    placeholder="플레이어 이름 + #KR1"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onClick={handleInputClick}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {showHistory && (
            <div className="search-history-container">
              {searchHistory.map((history, index) => (
                <div
                  key={index}
                  className="search-history-item"
                  onClick={() => handleSearchHistoryClick(history)}
                >
                  {history}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <h1>여기도 광고 받습니다</h1>
    </>
  );
};

export default Home;
