import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EvoNet.css';

interface LeaderboardRow {
  username: string;
  points: number;
}

interface ScriptRequest {
  id: number;
  title: string;
  upvotes: number;
}

function EvoNet() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardRow[]>([
    { username: "user1", points: 1000 },
    { username: "user2", points: 900 },
    { username: "user3", points: 800 },
    // ... add more data
  ]);

  const [scriptRequests, setScriptRequests] = useState<ScriptRequest[]>([
    { id: 1, title: "Script 1", upvotes: 0 },
    { id: 2, title: "Script 2", upvotes: 0 },
    { id: 3, title: "Script 3", upvotes: 0 },
    // ... add more data
  ]);

  useEffect(() => {
    const fetchMergedPRs = async () => {
        let page = 1;
        const perPage = 100;
        let hasNextPage = true;
        const userPointsMap: { [username: string]: number } = {};
      
        while (hasNextPage) {
          const response = await axios.get(`https://api.github.com/repos/polywrap/evo.ninja/pulls?state=closed&per_page=${perPage}&page=${page}`);
          const closedPRs = response.data;
      
          if (closedPRs.length < perPage) {
            hasNextPage = false;
          }
      
          const mergedPRs = closedPRs.filter((pr: any) => pr.merged_at);
      
          mergedPRs.forEach((pr: any) => {
            const username = pr.user.login;
            if (!userPointsMap[username]) {
              userPointsMap[username] = 0;
            }
            userPointsMap[username] += 50;
          });
      
          page += 1;
        }
      
        const updatedLeaderboardData: LeaderboardRow[] = Object.keys(userPointsMap).map((username) => ({
          username,
          points: userPointsMap[username],
        }));
      
        // Sort by points in descending order
        updatedLeaderboardData.sort((a, b) => b.points - a.points);
      
        setLeaderboardData(updatedLeaderboardData);
      };
      

    fetchMergedPRs();
  }, []);
  const handleUpvote = (id: number) => {
    setScriptRequests(prevState => prevState.map(request => {
      if (request.id === id) {
        return { ...request, upvotes: request.upvotes + 1 };
      }
      return request;
    }));
  };

  return (
    <div className="evo-net-background">
      <div className="evo-net-container">
        <img src="avatar-name.png" alt="Main Logo" className="Logo" />
        <h1>Leaderboard</h1>
        <p>Based on PRs merged to the evo.ninja repo. Each PR earning 50 points
        </p>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((row, index) => (
              <tr key={index}>
                <td>{row.username}</td>
                <td>{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h1>Script Requests</h1>
        <ul className="script-requests">
          {scriptRequests.map(request => (
            <li key={request.id}>
              {request.title} - Upvotes: {request.upvotes}
              <button onClick={() => handleUpvote(request.id)}>Upvote</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EvoNet;
