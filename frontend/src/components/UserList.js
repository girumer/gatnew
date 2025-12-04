import React, { useEffect, useState } from "react";

function UserList() {
 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://new.adeyebingo.com/api/users") // ✅ matches your backend
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched users:", data); // 👀 debug in console
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Registered Users</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Username</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Phone Number</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Chat ID</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "8px" }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.username}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.phoneNumber}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.chatId}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
