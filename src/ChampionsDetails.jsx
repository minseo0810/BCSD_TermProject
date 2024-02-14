import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ChampionsDetails.css";

const ChampionsDetails = () => {
  const { championName } = useParams();
  const [championDetails, setChampionDetails] = useState({
    id: "",
    name: "",
    title: "",
    image: {
      full: "",
    },
    lore: "",
    spells: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/14.2.1/data/ko_KR/champion/${championName}.json`
        );
        const data = await response.json();
        const championData = data.data[championName];
        setChampionDetails({
          id: championData.id,
          name: championData.name,
          title: championData.title,
          image: {
            full: championData.image.full,
          },
          lore: championData.lore,
          spells: [
            `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/spell/${championData.spells[0].id}.png`,
            `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/spell/${championData.spells[1].id}.png`,
            `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/spell/${championData.spells[2].id}.png`,
            `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/spell/${championData.spells[3].id}.png`,
          ],
          spellsName: [
            championData.spells[0].name,
            championData.spells[1].name,
            championData.spells[2].name,
            championData.spells[3].name,
          ],
          spellsDescription: [
            championData.spells[0].description,
            championData.spells[1].description,
            championData.spells[2].description,
            championData.spells[3].description,
          ],
        });
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };

    fetchData();
  }, [championName]);

  return (
    <div className="championDetailsFrame">
      <div className="championDetailsMain">
        <div>
          <span className="championName">{championDetails.name}</span>
          <span className="championTitle"> ({championDetails.title})</span>
        </div>
        <table>
          <tbody>
            <tr>
              <td>
                <img
                  className="championImg"
                  src={`http://ddragon.leagueoflegends.com/cdn/14.2.1/img/champion/${championDetails.image.full}`}
                  alt={`${championDetails.name} 이미지`}
                />
              </td>
              <td className="championDescriptiont">{championDetails.lore}</td>
            </tr>
          </tbody>
        </table>

        <div className="skillTitle">스킬</div>
        {championDetails.spells.map((spell, index) => (
          <table>
            <tbody>
              <tr>
                <td>
                  <img
                    className="skillImg"
                    src={spell}
                    alt={`Spell ${index + 1}`}
                  />
                </td>
                <td className="spellName">
                  {championDetails.spellsName[index]}
                </td>
                <td className="spellsDescription">
                  {championDetails.spellsDescription[index]}
                </td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
};

export default ChampionsDetails;
