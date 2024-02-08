import React, { useState, useEffect } from "react";
import "./Champions.css";

const ChampionsList = () => {
  const [championDetails, setChampionDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://ddragon.leagueoflegends.com/cdn/14.2.1/data/ko_KR/champion.json"
        );
        const data = await response.json();
        const details = Object.values(data.data).map((champion) => ({
          name: champion.name,
          image: `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/champion/${champion.image.full}`,
        }));
        // 이름을 가나다순으로 정렬
        details.sort((a, b) => a.name.localeCompare(b.name));
        setChampionDetails(details);
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {championDetails.map((details, index) => (
        <table class="championItem">
          <tbody>
            <tr>
              <td>
                <img src={details.image} alt={details.name} />
              </td>
            </tr>
            <tr>
              <td>{details.name}</td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
};

export default ChampionsList;
