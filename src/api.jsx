// gameName과 tagLine을 이용해 puuid를 받아옴
export const getSummonerByRiotId = (gameName, tagLine) => {
  return `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
    gameName
  )}/${encodeURIComponent(tagLine)}?api_key=${
    process.env.REACT_APP_RIOT_API_KEY
  }`;
};

// puuid를 이용해 소환사의 정보를 가져옴
export const getSummonerByPUUID = (puuid) => {
  return `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(
    puuid
  )}?api_key=${process.env.REACT_APP_RIOT_API_KEY}`;
};

// puuid를 이용해 소환사의 matchId를 받아옴
export const getRecentMatches = (encryptedPUUID) => {
  return `/lol/match/v5/matches/by-puuid/${encryptedPUUID}/ids?start=0&count=20&api_key=${process.env.REACT_APP_RIOT_API_KEY}`;
};

// matchId를 통해 match정보를 받아옴
export const getMatchDetails = (matchId) => {
  return `/lol/match/v5/matches/${matchId}?api_key=${process.env.REACT_APP_RIOT_API_KEY}`;
};
