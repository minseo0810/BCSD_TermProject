import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Champions.css";

const Champions = () => {
  const [championDetails, setChampionDetails] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [filteredChampionDetails, setFilteredChampionDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://ddragon.leagueoflegends.com/cdn/14.2.1/data/ko_KR/champion.json"
        );
        const data = await response.json();
        const details = Object.values(data.data).map((champion) => ({
          id: champion.id,
          name: champion.name,
          tags: champion.tags.slice(0, 3),
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

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    const filteredChampions = championDetails.filter(
      (champion) => champion.tags.includes(tag) // 찾고자하는 태그가 있는 챔피언 필터링
    );
    const championDetailsArray = filteredChampions.map((champion) => ({
      id: champion.id,
      name: champion.name,
      image: champion.image,
    }));
    setFilteredChampionDetails(championDetailsArray);
  };

  return (
    <div>
      <div className="championsFrame">
        <div className="championList">
          {championDetails.map((details, index) => (
            <table key={index} className="championItem">
              <tbody>
                <tr>
                  <td>
                    <Link to={`/champions/${encodeURIComponent(details.id)}`}>
                      <img src={details.image} alt={details.name} />
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>{details.name}</td>
                </tr>
              </tbody>
            </table>
          ))}
        </div>

        <div className="championTags">
          {["Fighter", "Tank", "Mage", "Assassin", "Support", "Marksman"].map(
            (tag, index) => (
              <button
                key={index}
                onClick={() => handleTagClick(tag)}
                className={selectedTag === tag ? "click" : ""}
              >
                {tag === "Fighter"
                  ? "전사"
                  : tag === "Tank"
                  ? "탱커"
                  : tag === "Mage"
                  ? "마법사"
                  : tag === "Assassin"
                  ? "암살자"
                  : tag === "Support"
                  ? "서포터"
                  : tag === "Marksman"
                  ? "원거리"
                  : ""}
              </button>
            )
          )}
          <div className="filteredChampionDetails">
            {filteredChampionDetails.map((champion, index) => (
              <table key={index} className="filteredChampionItem">
                <tbody>
                  <tr>
                    <td>
                      <Link
                        to={`/champions/${encodeURIComponent(champion.id)}`}
                      >
                        <img src={champion.image} alt={champion.name} />
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>{champion.name}</td>
                  </tr>
                </tbody>
              </table>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Champions;
