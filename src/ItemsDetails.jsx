import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/ItemsDetails.css";

const ItemsDetails = () => {
  const { itemName } = useParams();
  const [itemDetails, setItemDetails] = useState({
    name: "",
    description: "",
    image: {
      full: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://ddragon.leagueoflegends.com/cdn/14.2.1/data/ko_KR/item.json"
        );
        const data = await response.json();

        const selectedItem = Object.values(data.data).find(
          (item) => item.name === itemName
        );

        if (selectedItem) {
          setItemDetails({
            name: selectedItem.name,
            description: selectedItem.description,
            image: {
              full: `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/item/${selectedItem.image.full}`,
            },
          });
        } else {
          console.error("오류 발생");
        }
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };

    fetchData();
  }, [itemName]);

  return (
    <>
      <div className="itemDetailsFrame">
        <div className="itemDetailsMain">
          <div className="itemDetailsname">{itemDetails.name}</div>
          <table>
            <tbody>
              <tr>
                <td>
                  <img
                    className="itemDetailsImg"
                    src={itemDetails.image.full}
                    alt={itemDetails.name}
                  />
                </td>
                <td
                  className="itemDetailsDescriptiont"
                  dangerouslySetInnerHTML={{ __html: itemDetails.description }}
                ></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <h1>여기도 광고 받습니다</h1>
    </>
  );
};

export default ItemsDetails;
