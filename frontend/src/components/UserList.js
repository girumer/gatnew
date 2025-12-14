import React, { useEffect, useState } from "react";

// Read the base URL from the environment variables
const BACKEND_URL = process.env.REACT_APP_BACKENDURL;

// Construct full API URLs using the environment variable
const USERS_URL = `${BACKEND_URL}/api/users`; 
const TRANSACTION_URL = `${BACKEND_URL}/api/pending-transactions`;
const ALL_TRANSACTION_URL = `${BACKEND_URL}/api/all-transactions`;
// 💡 NEW CONSTANT: Broadcast Endpoint
const BROADCAST_URL = `${BACKEND_URL}/api/brodcatst`; 

// Define view constants for clarity
const VIEWS = {
    USERS: 'users',
    PENDING: 'pending',
    COMPLETED: 'completed'
};

function UserList() {
    // --- State for Data ---
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [completedTransactions, setCompletedTransactions] = useState([]);
    
    // --- State for Loading ---
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [loadingCompletedTransactions, setLoadingCompletedTransactions] = useState(true);
    
    // --- State for Broadcast ---
    const [isBroadcasting, setIsBroadcasting] = useState(false); // 💡 NEW: For button loading state
    const [broadcastMessage, setBroadcastMessage] = useState(null); // 💡 NEW: For success/error message

    // For calculated total deposit sum
    const [totalDepositSum, setTotalDepositSum] = useState(0); 

    // Controls which table is displayed.
    const [activeView, setActiveView] = useState(VIEWS.USERS); 

    // ========================================
    // ACTION HANDLERS
    // ========================================

    /**
     * Handles the broadcast of the marketing message to all users.
     */
    const handleBroadcast = async () => {
        if (!window.confirm("Are you sure you want to broadcast this message to ALL users? This action cannot be undone.")) {
            return;
        }

        setIsBroadcasting(true);
        setBroadcastMessage(null);

        try {
            const response = await fetch(BROADCAST_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Assuming your controller doesn't need a body, but including it just in case:
                // body: JSON.stringify({ message: "Broadcast message trigger" }) 
            });

            const data = await response.json();

            if (response.ok) {
                setBroadcastMessage({ type: 'success', text: data.message });
            } else {
                setBroadcastMessage({ type: 'error', text: data.error || "Broadcast failed with an unknown error." });
            }
        } catch (error) {
            console.error("Broadcast fetch error:", error);
            setBroadcastMessage({ type: 'error', text: `Network error: ${error.message}` });
        } finally {
            setIsBroadcasting(false);
            // Clear the feedback message after a few seconds
            setTimeout(() => setBroadcastMessage(null), 8000); 
        }
    };

    // ========================================
    // DATA FETCHING & CALCULATION (Same as before)
    // ========================================

    // 3. Fetch Completed Transactions (Polling)
    useEffect(() => {
        const fetchCompletedTransactions = () => {
            fetch(ALL_TRANSACTION_URL) 
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch completed transactions.");
                    return res.json();
                })
                .then((data) => {
                    setCompletedTransactions(data?.transactions || []);
                    setLoadingCompletedTransactions(false);
                })
                .catch((err) => console.error("Error fetching completed transactions:", err));
        };

        fetchCompletedTransactions();
        const intervalId = setInterval(fetchCompletedTransactions, 10000); 
        return () => clearInterval(intervalId); 
    }, []);

    // Calculate the total sum whenever completedTransactions changes
    useEffect(() => {
        if (completedTransactions.length > 0) {
            const sum = completedTransactions.reduce((acc, tx) => acc + tx.amount, 0);
            setTotalDepositSum(sum);
        } else if (loadingCompletedTransactions === false) {
            setTotalDepositSum(0);
        }
    }, [completedTransactions, loadingCompletedTransactions]);

    // 1. Fetch Users
    useEffect(() => {
        fetch(USERS_URL) 
            .then((res) => res.json())
            .then((data) => { setUsers(data); })
            .catch((err) => console.error("Error fetching users:", err))
            .finally(() => setLoadingUsers(false));
    }, []);

    // 2. Fetch Pending Transactions (Polling)
    useEffect(() => {
        const fetchTransactions = () => {
            fetch(TRANSACTION_URL) 
                .then((res) => res.json())
                .then((data) => { setTransactions(data?.transactions || []); })
                .catch((err) => console.error("Error fetching transactions:", err))
                .finally(() => setLoadingTransactions(false));
        };

        fetchTransactions();
        const intervalId = setInterval(fetchTransactions, 5000); 
        return () => clearInterval(intervalId); 
    }, []); 

    // Combined loading states for initial render blocking
    if (loadingUsers || loadingTransactions || loadingCompletedTransactions) {
        return <p style={{ padding: "20px" }}>Loading Dashboard Data...</p>;
    }


    // ========================================
    // RENDERING LOGIC (The table rendering logic is unchanged, styles are added below)
    // ========================================
    
    const renderActiveTable = () => {
        // ... (Your existing renderActiveTable function logic here) ...
        // We will keep the original implementation brief for clarity
        switch (activeView) {
            case VIEWS.USERS:
                return (
                    <>
                        <h2>👥 Registered Users ({users.length})</h2>
                        <table style={tableStyle}>
                            <thead>
                                <tr style={{ backgroundColor: "#f2f2f2" }}>
                                    <th style={thStyle}>Username</th>
                                    <th style={thStyle}>Phone Number</th>
                                    <th style={thStyle}>Chat ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr><td colSpan="3" style={tdCenterStyle}>No users found</td></tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user._id}>
                                            <td style={tdStyle}>{user.username}</td>
                                            <td style={tdStyle}>{user.phoneNumber}</td>
                                            <td style={tdStyle}>{user.chatId}</td>
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
                        <table style={tableStyle}>
                            <thead>
                                <tr style={{ backgroundColor: "#007bff", color: 'white' }}>
                                    <th style={thStyle}>Amount (ETB)</th>
                                    <th style={thStyle}>Transaction Number</th>
                                    <th style={thStyle}>Type</th>
                                    <th style={thStyle}>Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr><td colSpan="4" style={tdNoDataStyle}>No pending transactions found.</td></tr>
                                ) : (
                                    transactions.map((tx) => (
                                        <tr key={tx._id} style={{ backgroundColor: '#f9f9f9' }}>
                                            <td style={{ ...tdStyle, fontWeight: 'bold' }}>{tx.amount.toFixed(2)}</td>
                                            <td style={tdStyle}>{tx.transactionNumber}</td>
                                            <td style={{ ...tdStyle, textTransform: 'capitalize' }}>{tx.type}</td>
                                            <td style={tdStyle}>{tx.method}</td>
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
                        <table style={tableStyle}>
                            <thead>
                                <tr style={{ backgroundColor: "#17a2b8", color: 'white' }}>
                                    <th style={thStyle}>Amount (ETB)</th>
                                    <th style={thStyle}>Transaction Number</th>
                                    <th style={thStyle}>Type</th>
                                    <th style={thStyle}>Date Confirmed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completedTransactions.length === 0 ? (
                                    <tr><td colSpan="4" style={tdNoDataStyleBlue}>No confirmed transactions in history.</td></tr>
                                ) : (
                                    completedTransactions.map((tx) => (
                                        <tr key={tx._id} style={{ backgroundColor: '#f0faff' }}>
                                            <td style={{ ...tdStyle, fontWeight: 'bold' }}>{tx.amount.toFixed(2)}</td>
                                            <td style={tdStyle}>{tx.transactionNumber}</td>
                                            <td style={{ ...tdStyle, textTransform: 'capitalize' }}>{tx.type}</td>
                                            <td style={tdStyle}>{new Date(tx.createdAt).toLocaleDateString()}</td>
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
        <div style={{ display: 'flex', minHeight: '100vh', padding: '0px' }}>
            
            {/* LEFT: SIDEBAR NAVIGATION */}
            <div style={sidebarStyle}>
                <h3 style={{ marginBottom: '30px', color: '#ffc107' }}>Admin Panel</h3>
                
                {/* Total Deposit Card */}
                <div style={getTotalDepositCardStyle()}>
                    <h4>💸 Total Deposit</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>
                        {totalDepositSum.toFixed(2)} ETB
                    </p>
                </div>

                {/* 💡 NEW: BROADCAST BUTTON */}
                <button 
                    onClick={handleBroadcast}
                    disabled={isBroadcasting}
                    style={getBroadcastButtonStyle(isBroadcasting)}
                >
                    {isBroadcasting ? 'Broadcasting...' : '📣 Send Broadcast Message'}
                </button>

                {/* Broadcast Feedback Message */}
                {broadcastMessage && (
                    <div style={getFeedbackStyle(broadcastMessage.type)}>
                        {broadcastMessage.text}
                    </div>
                )}
                
                {/* Navigation Buttons */}
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

            {/* RIGHT: MAIN CONTENT AREA */}
            <div style={mainContentStyle}>
                {renderActiveTable()}
            </div>
        </div>
    );
}

export default UserList;


// ========================================
// STYLES (Extracted for cleaner code)
// ========================================

const sidebarStyle = { 
    width: '250px', 
    backgroundColor: '#343a40', 
    color: 'white', 
    padding: '20px', 
    flexShrink: 0 
};

const mainContentStyle = { 
    flexGrow: 1, 
    padding: "20px", 
    overflowY: 'auto', 
    backgroundColor: '#f8f9fa' 
};

const tableStyle = { 
    borderCollapse: "collapse", 
    width: "100%", 
    marginBottom: "40px" 
};
const thStyle = { border: "1px solid #ddd", padding: "10px" };
const tdStyle = { border: "1px solid #ddd", padding: "8px" };
const tdCenterStyle = { textAlign: "center", padding: "8px" };
const tdNoDataStyle = { textAlign: "center", padding: "10px", backgroundColor: '#fffbe6' };
const tdNoDataStyleBlue = { textAlign: "center", padding: "10px", backgroundColor: '#e6f7ff' };


// Helper function for navigation button styling
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

// Helper function for the new Total Deposit card styling
const getTotalDepositCardStyle = () => ({
    backgroundColor: '#28a745', // Green color
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
});

// 💡 NEW: Helper function for Broadcast button styling
const getBroadcastButtonStyle = (isBroadcasting) => ({
    width: '100%',
    padding: '15px',
    margin: '15px 0',
    backgroundColor: isBroadcasting ? '#6c757d' : '#dc3545', // Red/Grey
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: isBroadcasting ? 'not-allowed' : 'pointer',
    fontSize: '17px',
    fontWeight: 'bolder',
    transition: 'background-color 0.2s',
    opacity: isBroadcasting ? 0.7 : 1,
});

// 💡 NEW: Helper function for Feedback message styling
const getFeedbackStyle = (type) => ({
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    fontSize: '14px',
    textAlign: 'center',
    backgroundColor: type === 'success' ? '#28a745' : '#dc3545', // Green or Red
    color: 'white',
    border: `1px solid ${type === 'success' ? '#1e7e34' : '#bd2130'}`,
});