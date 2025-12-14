import React, { useEffect, useState } from "react";

// Read the base URL from the environment variables
const BACKEND_URL = process.env.REACT_APP_BACKENDURL;

// Construct full API URLs using the environment variable
const USERS_URL = `${BACKEND_URL}/api/users`; 
const TRANSACTION_URL = `${BACKEND_URL}/api/pending-transactions`;
const ALL_TRANSACTION_URL = `${BACKEND_URL}/api/all-transactions`;

// 💡 NEW CONSTANT: Define view constants for clarity
const VIEWS = {
    USERS: 'users',
    PENDING: 'pending',
    COMPLETED: 'completed'
};

function UserList() {
    // --- State for Users ---
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    
    // --- State for Pending Transactions ---
    const [transactions, setTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(true);

    // --- State for Completed Transactions ---
    const [completedTransactions, setCompletedTransactions] = useState([]);
    const [loadingCompletedTransactions, setLoadingCompletedTransactions] = useState(true);

    // 💡 NEW STATE: Controls which table is displayed. Default to 'USERS'.
    const [activeView, setActiveView] = useState(VIEWS.USERS); 

    // ========================================
    // DATA FETCHING (All original logic is preserved)
    // ========================================

    // 3. Fetch Completed Transactions (Polling)
    useEffect(() => {
        const fetchCompletedTransactions = () => {
            fetch(ALL_TRANSACTION_URL) 
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch completed transactions.");
                    return res.json();
                })
                .then((data) => setCompletedTransactions(data?.transactions || []))
                .catch((err) => console.error("Error fetching completed transactions:", err))
                .finally(() => setLoadingCompletedTransactions(false));
        };

        fetchCompletedTransactions();
        const intervalId = setInterval(fetchCompletedTransactions, 10000); 
        return () => clearInterval(intervalId); 
    }, []);

    // 1. Fetch Users
    useEffect(() => {
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

    // 2. Fetch Pending Transactions (Polling)
    useEffect(() => {
        const fetchTransactions = () => {
            fetch(TRANSACTION_URL) 
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch transactions.");
                    return res.json();
                })
                .then((data) => {
                    setTransactions(data?.transactions || []); 
                    setLoadingTransactions(false);
                })
                .catch((err) => {
                    console.error("Error fetching transactions:", err);
                    setLoadingTransactions(false);
                });
        };

        fetchTransactions();
        const intervalId = setInterval(fetchTransactions, 5000); 
        return () => clearInterval(intervalId); 
    }, []); 

    // Combined loading states for initial render blocking
    if (loadingUsers || loadingTransactions || loadingCompletedTransactions) {
        return <p style={{ padding: "20px" }}>Loading Dashboard Data...</p>;
    }


    // 💡 NEW FUNCTION: Renders the active table based on 'activeView' state
    const renderActiveTable = () => {
        switch (activeView) {
            case VIEWS.USERS:
                return (
                    <>
                        <h2>👥 Registered Users ({users.length})</h2>
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
                                    <tr><td colSpan="3" style={{ textAlign: "center", padding: "8px" }}>No users found</td></tr>
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
                    </>
                );
            case VIEWS.PENDING:
                return (
                    <>
                        <h2>💰 Pending Transactions ({transactions.length})</h2>
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
                                    <tr><td colSpan="4" style={{ textAlign: "center", padding: "10px", backgroundColor: '#fffbe6' }}>No pending transactions found.</td></tr>
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
                    </>
                );
            case VIEWS.COMPLETED:
                return (
                    <>
                        <h2>✅ Confirmed Deposit History ({completedTransactions.length})</h2>
                        <table style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#17a2b8", color: 'white' }}>
                                    <th style={{ border: "1px solid #ddd", padding: "10px" }}>Amount (ETB)</th>
                                    <th style={{ border: "1px solid #ddd", padding: "10px" }}>Transaction Number</th>
                                    <th style={{ border: "1px solid #ddd", padding: "10px" }}>Type</th>
                                    <th style={{ border: "1px solid #ddd", padding: "10px" }}>Date Confirmed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completedTransactions.length === 0 ? (
                                    <tr><td colSpan="4" style={{ textAlign: "center", padding: "10px", backgroundColor: '#e6f7ff' }}>No confirmed transactions in history.</td></tr>
                                ) : (
                                    completedTransactions.map((tx) => (
                                        <tr key={tx._id} style={{ backgroundColor: '#f0faff' }}>
                                            <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: 'bold' }}>{tx.amount.toFixed(2)}</td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.transactionNumber}</td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px", textTransform: 'capitalize' }}>{tx.type}</td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </>
                );
            default:
                return <p>Select a view from the sidebar.</p>;
        }
    };


    return (
        // 💡 NEW LAYOUT STRUCTURE: Flex container for sidebar and content
        <div style={{ display: 'flex', minHeight: '100vh', padding: '0px' }}>
            
            {/* ----------------------------------------
            | LEFT: SIDEBAR NAVIGATION
            ---------------------------------------- */}
            <div style={{ 
                width: '250px', 
                backgroundColor: '#343a40', 
                color: 'white', 
                padding: '20px', 
                flexShrink: 0 
            }}>
                <h3 style={{ marginBottom: '30px', color: '#ffc107' }}>Admin Panel</h3>
                
                <button 
                    onClick={() => setActiveView(VIEWS.USERS)}
                    style={getButtonStyle(activeView === VIEWS.USERS)}
                >
                    👥 Total Users ({users.length})
                </button>
                
                <button 
                    onClick={() => setActiveView(VIEWS.PENDING)}
                    style={getButtonStyle(activeView === VIEWS.PENDING)}
                >
                    💰 Pending Transactions ({transactions.length})
                </button>
                
                <button 
                    onClick={() => setActiveView(VIEWS.COMPLETED)}
                    style={getButtonStyle(activeView === VIEWS.COMPLETED)}
                >
                    ✅ Deposit History ({completedTransactions.length})
                </button>
                
            </div>

            {/* ----------------------------------------
            | RIGHT: MAIN CONTENT AREA (Only renders one table)
            ---------------------------------------- */}
            <div style={{ flexGrow: 1, padding: "20px", overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                {renderActiveTable()}
            </div>
        </div>
    );
}

export default UserList;


// 💡 HELPER FUNCTION for button styling
const getButtonStyle = (isActive) => ({
    width: '100%',
    padding: '12px 15px',
    margin: '10px 0',
    textAlign: 'left',
    backgroundColor: isActive ? '#007bff' : '#495057',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
    boxShadow: isActive ? '0 0 10px rgba(0, 123, 255, 0.5)' : 'none',
});