import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SummonerInfo.css";

const SummonerInfo = ({ data }) => {
  const { encryptedPUUID, gameName, tagLine, profileIconId, summonerLevel } =
    data;
  const [recentMatchResults, setRecentMatchResults] = useState([]);
  const [matchData, setMatchData] = useState({
    encryptedPUUID: "",
    gameName: "",
    tagLine: "",
    profileIconId: "",
    summonerLevel: "",
  });

  useEffect(() => {
    const getRecentMatchResults = async () => {
      try {
        // puuid로 사용자의 최근 게임 ID를 가져옴
        const matchListResponse = await axios.get(
          `/lol/match/v5/matches/by-puuid/${encryptedPUUID}/ids?start=0&count=20&api_key=${process.env.REACT_APP_RIOT_API_KEY}`
        );

        // 각 게임 ID에 대한 상세 정보를 가져와서 승리 또는 패배를 확인
        const results = await Promise.all(
          matchListResponse.data.map(async (recentMatchId) => {
            const matchDetailResponse = await axios.get(
              `/lol/match/v5/matches/${recentMatchId}?api_key=${process.env.REACT_APP_RIOT_API_KEY}`
            );
            const participants = matchDetailResponse.data.info.participants;
            const playerDetails = participants.find(
              (participant) => participant.puuid === encryptedPUUID
            );
            return playerDetails.win ? "승리" : "패배";
          })
        );

        setRecentMatchResults(results);
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        setRecentMatchResults([]);
      }
    };

    if (encryptedPUUID) {
      getRecentMatchResults();
    }
  }, [encryptedPUUID]);

  return (
    <div className="summoner-container">
      <div className="profile">
        <div className="profile-icon">
          {profileIconId && (
            <>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.2.1/img/profileicon/${profileIconId}.png`}
                alt="Summoner's Profile Icon"
                className="icon"
              />
              <span className="level">{summonerLevel}</span>
            </>
          )}
        </div>
        <div className="summoner-details">
          <h2>
            <span className="game-name">{gameName} </span>
            <span className="tag-line">#{tagLine}</span>
          </h2>
        </div>
      </div>
      <div>
        <div className="recent-match">
          {recentMatchResults.map((result, index) => (
            <div
              key={index}
              className={`result ${result === "승리" ? "win" : "lose"}`}
            >
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummonerInfo;
