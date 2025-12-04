import React, { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKENDURL}/api/users`) // ✅ matches your CORS origin
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div>
      <h2>Registered Users</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Username</th>
            <th>Phone Number</th>
            <th>Chat ID</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.chatId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
