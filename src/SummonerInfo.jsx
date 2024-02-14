import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SummonerInfo.css";
import * as api from "./api.jsx";

const SummonerInfo = ({ data }) => {
  const { encryptedPUUID, gameName, tagLine, profileIconId, summonerLevel } =
    data || {};
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
        const matchListResponse = await axios.get(
          api.getRecentMatches(encryptedPUUID)
        );

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

            // 메인 룬 id 값 받아오기
            const primaryStyle = playerDetails.perks.styles.find(
              (style) => style.description === "primaryStyle"
            ).style;
            // 메인 룬 id의 세부 룬 id 받아오기
            const primaryStyleDetails = playerDetails.perks.styles.find(
              (style) => style.description === "primaryStyle"
            ).selections[0].perk;

            // 룬 데이터(json) 가져오기
            const runesResponse = await axios.get(
              "https://ddragon.leagueoflegends.com/cdn/14.2.1/data/ko_KR/runesReforged.json"
            );
            const runesData = runesResponse.data;

            // 메인 룬의 링크
            const mainRuneIcon = runesData
              .find((rune) => rune.id === primaryStyle)
              .slots[0].runes.find(
                (rune) => rune.id === primaryStyleDetails
              ).icon;

            // 서브 룬 id 값 받아오기
            const subStyle = playerDetails.perks.styles.find(
              (style) => style.description === "subStyle"
            ).style;

            // 서브 룬의 링크
            const subRuneIcon = runesData.find(
              (rune) => rune.id === subStyle
            ).icon;

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
              runes: [
                `https://ddragon.leagueoflegends.com/cdn/img/${mainRuneIcon}`,
                `https://ddragon.leagueoflegends.com/cdn/img/${subRuneIcon}`,
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
                <tbody>
                  <tr>
                    <th
                      className={`result ${
                        result.win ? "winText" : "loseText"
                      }`}
                    >
                      {result.gameMode === " CLASSIC"
                        ? "소환사의 협곡"
                        : "무작위 총력전"}
                    </th>
                    <th>
                      <table className="infoImg">
                        <tbody>
                          <tr>
                            <th rowSpan="2" className="infoChampionImg">
                              <img
                                src={result.championImage}
                                style={{ width: "100px", height: "100px" }}
                              />
                            </th>
                            <th>
                              <img src={result.summonerSpells[0]} />
                            </th>

                            <th>
                              <img src={result.runes[0]} />
                            </th>
                            <th>
                              {result.kills} / {result.deaths}/ {result.assists}
                            </th>
                          </tr>
                          <tr>
                            <th>
                              <img src={result.summonerSpells[1]} />
                            </th>
                            <th>
                              <img src={result.runes[1]} />
                            </th>
                            <th>
                              {(
                                (result.kills + result.assists) /
                                result.deaths
                              ).toFixed(2)}{" "}
                              : 1 평점
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </th>
                  </tr>
                  <tr>
                    <th className="infoTime">
                      {result.win ? "승리" : "패배"}
                      <br></br>
                      {Math.floor(result.gameDuration / 60)}분{" "}
                      {result.gameDuration % 60}초
                    </th>
                    <th className="infoItemas">
                      {result.items.map((item, index) => (
                        <span
                          key={index}
                          className={` ${
                            item.endsWith("/0.png") ? "infoNotItem" : "infoItem"
                          }`}
                        >
                          <img src={item} />
                        </span>
                      ))}
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummonerInfo;
