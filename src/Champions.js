import React, { useState, useEffect } from "react";

const getChampions = async () => {
  const response = await fetch(
    "https://ddragon.leagueoflegends.com/cdn/12.5.1/data/en_US/champion.json"
  );
  const data = await response.json();
  return data.data;
};

const Champions = () => {
  const [champions, setChampions] = useState({});

  useEffect(() => {
    getChampions().then((data) => setChampions(data));
  }, []);

  return (
    <div>
      <ul>
        {Object.keys(champions).map((key) => (
          <li key={key}>{champions[key].name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Champions;
