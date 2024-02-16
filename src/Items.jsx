import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/Items.css";

const Items = () => {
  const [itemDetails, setItemDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://ddragon.leagueoflegends.com/cdn/14.2.1/data/ko_KR/item.json"
        );
        const data = await response.json();

        // 중복된 name을 가진 데이터 필터링
        const uniqueDetails = Array.from(
          new Set(Object.values(data.data).map((item) => item.name))
        ).map((name) => {
          const item = Object.values(data.data).find((i) => i.name === name);
          return {
            name: item.name,
            image: `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/item/${item.image.full}`,
          };
        });

        // 이름을 가나다순으로 정렬
        uniqueDetails.sort((a, b) => a.name.localeCompare(b.name));

        // 상점에 파는 아이템이 아닌 경우 -> 갱플랭크 패시브 아이템 등
        // 특정 인덱스 제외 (0, 1, 2, 15)
        const filteredDetails = uniqueDetails.filter(
          (item, index) => ![0, 1, 2, 15, 28, 29, 34, 37].includes(index)
        );
        setItemDetails(filteredDetails);
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="itemsFrame">
        <div className="itemList">
          {itemDetails.map((item, index) => (
            <table key={index} className="itemItem">
              <tbody>
                <tr>
                  <td>
                    <Link to={`/items/${encodeURIComponent(item.name)}`}>
                      <img
                        className="itemImg"
                        src={item.image}
                        alt={item.name}
                      />
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="itemDescriptiont">{item.name}</td>
                </tr>
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Items;
