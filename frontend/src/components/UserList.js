import React, { useEffect, useState } from "react";

// Read the base URL from the environment variables
// It will be 'http://localhost:5001' in a development environment.
const BACKEND_URL = process.env.REACT_APP_BACKENDURL;

// Construct full API URLs using the environment variable
const USERS_URL = `${BACKEND_URL}/api/users`; 
const TRANSACTION_URL = `${BACKEND_URL}/api/pending-transactions`;

function UserList() {
 
  // --- State for Users ---
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
    
  // --- State for Transactions ---
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  // 1. Fetch Users
  useEffect(() => {
    // Using the constructed USERS_URL
    fetch(USERS_URL) 
      .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch users.");
          return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoadingUsers(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoadingUsers(false);
      });
  }, []);

  // 2. Fetch Transactions
  useEffect(() => {
    // Using the constructed TRANSACTION_URL
    fetch(TRANSACTION_URL) 
      .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch transactions.");
          return res.json();
      })
      .then((data) => {
        // Ensure to handle the possibility that data or data.transactions is undefined
        setTransactions(data?.transactions || []); 
        setLoadingTransactions(false);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        setLoadingTransactions(false);
      });
  }, []);

  // Combined loading states for initial render blocking
  if (loadingUsers || loadingTransactions) {
    return <p style={{ padding: "20px" }}>Loading Users and Transactions...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      
      {/* ========================================
        SECTION 1: REGISTERED USERS
        ========================================
      */}
      <h2>👥 Registered Users</h2>
      <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: "40px" }}>
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

      <hr style={{ margin: "30px 0" }}/>

      {/* ========================================
        SECTION 2: PENDING TRANSACTIONS
        ========================================
      */}
      <h2>💰 Pending Transactions</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#007bff", color: 'white' }}>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Amount (ETB)</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Transaction Number</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Type</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Method</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "10px", backgroundColor: '#fffbe6' }}>
                No pending transactions found.
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx._id} style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: 'bold' }}>{tx.amount.toFixed(2)}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.transactionNumber}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textTransform: 'capitalize' }}>{tx.type}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.method}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;