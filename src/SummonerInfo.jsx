import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SummonerInfo.css";
import * as api from "./api.jsx";

const SummonerInfo = ({ data }) => {
  const { encryptedPUUID, gameName, tagLine, profileIconId, summonerLevel } =
    data;
  const [recentMatchResults, setRecentMatchResults] = useState([]);
  const [matchData, setMatchData] = useState({
    win: false,
    championName: "",
    kills: "",
    deaths: "",
    assists: "",
    totalDamageDealtToChampions: "",
    gameMode: "",
    gameCreation: "",
    gameDuration: "",
    championImage: "",
    summonerSpells: [],
    items: [],
  });

  useEffect(() => {
    const getRecentMatchResults = async () => {
      try {
        const matchListResponse = { data: ["KR_6931963608"] };
        /*
        await axios.get(
          api.getRecentMatches(encryptedPUUID)
        );
        */

        const results = await Promise.all(
          matchListResponse.data.map(async (recentMatchId) => {
            const matchDetailResponse = await axios.get(
              api.getMatchDetails(recentMatchId)
            );
            const participants = matchDetailResponse.data.info.participants;
            const playerDetails = participants.find(
              (participant) => participant.puuid === encryptedPUUID
            );

            // spellId를 통해 spell 이름을 반환
            const getSpellKeyById = (spellId) => {
              switch (spellId) {
                case 1:
                  return "SummonerBoost";
                case 3:
                  return "SummonerExhaust";
                case 4:
                  return "SummonerFlash";
                case 6:
                  return "SummonerHaste";
                case 7:
                  return "SummonerHeal";
                case 11:
                  return "SummonerSmite";
                case 12:
                  return "SummonerTeleport";
                case 13:
                  return "SummonerMana";
                case 14:
                  return "SummonerDot";
                case 21:
                  return "SummonerBarrier";
                case 30:
                  return "SummonerPoroRecall";
                case 31:
                  return "SummonerPoroThrow";
                case 32:
                  return "SummonerSnowball";
                case 39:
                  return "SummonerSnowURFSnowball_Mark";
                default:
                  return null;
              }
            };

            // 게임 진행한 정보를 저장(졸라 많다리)
            const resultData = {
              win: playerDetails.win,
              championName: playerDetails.championName,
              kills: playerDetails.kills,
              deaths: playerDetails.deaths,
              assists: playerDetails.assists,
              totalDamageDealtToChampions:
                playerDetails.totalDamageDealtToChampions,
              gameMode: matchDetailResponse.data.info.gameMode,
              gameCreation: matchDetailResponse.data.info.gameCreation,
              gameDuration: matchDetailResponse.data.info.gameDuration,
              runes: playerDetails.runes,
              championImage: `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/champion/${playerDetails.championName}.png`,
              summonerSpells: [
                `https://ddragon.leagueoflegends.com/cdn/11.12.1/img/spell/${getSpellKeyById(
                  playerDetails.summoner1Id
                )}.png`,
                `https://ddragon.leagueoflegends.com/cdn/11.12.1/img/spell/${getSpellKeyById(
                  playerDetails.summoner2Id
                )}.png`,
              ],
              items: [
                `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/item/${playerDetails.item0}.png`,
                `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/item/${playerDetails.item1}.png`,
                `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/item/${playerDetails.item2}.png`,
                `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/item/${playerDetails.item3}.png`,
                `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/item/${playerDetails.item4}.png`,
                `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/item/${playerDetails.item5}.png`,
                `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/item/${playerDetails.item6}.png`,
              ],
            };

            // matchData 상태 업데이트
            setMatchData(resultData);
            return resultData;
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
              className={`result ${result.win ? "win" : "lose"}`}
            >
              <table>
                <tr>
                  <th>
                    {result.gameMode === " CLASSIC"
                      ? "소환사의 협곡"
                      : "무작위 총력전"}
                  </th>
                  <th>
                    <table>
                      <tr>
                        <th rowspan="2">
                          <img src={result.championImage} />
                        </th>
                        <th>
                          <img src={result.summonerSpells[0]} />
                        </th>
                      </tr>
                      <tr>
                        <th>
                          <img src={result.summonerSpells[1]} />
                        </th>
                      </tr>
                    </table>
                  </th>
                </tr>
              </table>

              <span>
                {result.win ? "승리" : "패배"}
                <br></br>
                {Math.floor(result.gameDuration / 60)}분{" "}
                {result.gameDuration % 60}초
              </span>
              <span>
                {result.kills} / {result.deaths}/ {result.assists}
              </span>
              <p>
                {((result.kills + result.assists) / result.deaths).toFixed(2)} :
                1 평점
              </p>
              <div className="items">
                {result.items.map((item, index) => (
                  <img src={item} alt={`Item ${index + 1}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummonerInfo;
