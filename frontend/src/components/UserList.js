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

// --- NEW CONSTANT FOR PAGINATION ---
const ROWS_PER_PAGE = 5;

function UserList() {
    // --- State for Data ---
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [completedTransactions, setCompletedTransactions] = useState([]);
    
    // --- NEW STATE FOR PAGINATION ---
    const [userCurrentPage, setUserCurrentPage] = useState(1);
    const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
    const [completedCurrentPage, setCompletedCurrentPage] = useState(1);

    // --- State for Loading ---
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [loadingCompletedTransactions, setLoadingCompletedTransactions] = useState(true);
    
    // --- State for Broadcast ---
    const [isBroadcasting, setIsBroadcasting] = useState(false); 
    const [broadcastMessage, setBroadcastMessage] = useState(null); 

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

    // Reset page on view change
    useEffect(() => {
        // You can add logic here if you want to reset all pages when the view changes,
        // but often it's better to keep the page state persistent per-table.
    }, [activeView]);

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
    // PAGINATION LOGIC HELPER
    // ========================================

    const paginateData = (data, currentPage) => {
        const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
        const endIndex = startIndex + ROWS_PER_PAGE;
        return data.slice(startIndex, endIndex);
    };

    const renderPaginationControls = (data, currentPage, setCurrentPage) => {
        const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
        
        if (totalPages <= 1) return null;

        return (
            <div style={paginationContainerStyle}>
                <button 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                    style={paginationButtonStyle}
                >
                    &laquo; Previous
                </button>
                <span style={{ margin: '0 15px', fontWeight: 'bold' }}>
                    Page {currentPage} of {totalPages}
                </span>
                <button 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    style={paginationButtonStyle}
                >
                    Next &raquo;
                </button>
            </div>
        );
    };


    // ========================================
    // RENDERING LOGIC (Updated to use Pagination)
    // ========================================
    
    const renderActiveTable = () => {
        let currentData = [];
        let currentPage = 1;
        let setCurrentPage = () => {};

        switch (activeView) {
            case VIEWS.USERS:
                currentData = users;
                currentPage = userCurrentPage;
                setCurrentPage = setUserCurrentPage;
                break;
            case VIEWS.PENDING:
                currentData = transactions;
                currentPage = pendingCurrentPage;
                setCurrentPage = setPendingCurrentPage;
                break;
            case VIEWS.COMPLETED:
                currentData = completedTransactions;
                currentPage = completedCurrentPage;
                setCurrentPage = setCompletedCurrentPage;
                break;
            default:
                return <p>Select a view from the sidebar.</p>;
        }

        const displayedData = paginateData(currentData, currentPage);

        // Utility to render the table rows based on the current view
        const renderRows = () => {
            if (currentData.length === 0) {
                 const colSpan = activeView === VIEWS.USERS || activeView === VIEWS.COMPLETED ? 4 : 5;
                 const style = activeView === VIEWS.USERS ? tdCenterStyle : (activeView === VIEWS.PENDING ? tdNoDataStyle : tdNoDataStyleBlue);

                return (
                    <tr>
                        <td colSpan={colSpan} style={style}>
                            {activeView === VIEWS.USERS && "No users found"}
                            {activeView === VIEWS.PENDING && "No pending transactions found."}
                            {activeView === VIEWS.COMPLETED && "No confirmed transactions in history."}
                        </td>
                    </tr>
                );
            }

            return displayedData.map((item) => {
                switch (activeView) {
                    case VIEWS.USERS:
                        return (
                            <tr key={item._id}>
                                <td style={tdStyle}>{item.username}</td>
                                <td style={tdStyle}>{item.phoneNumber}</td>
                                <td style={tdStyle}>{item.chatId}</td>
                                <td style={tdStyle}>{item.referredBy || 'N/A'}</td> {/* Added referredBy for completeness */}
                            </tr>
                        );
                    case VIEWS.PENDING:
                        return (
                            <tr key={item._id} style={{ backgroundColor: '#f9f9f9' }}>
                                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{item.amount.toFixed(2)}</td>
                                <td style={tdStyle}>{item.transactionNumber}</td>
                                <td style={{ ...tdStyle, textTransform: 'capitalize' }}>{item.type}</td>
                                <td style={tdStyle}>{item.method}</td>
                                <td style={tdStyle}>ACTION BUTTONS HERE</td> {/* Placeholder for Action buttons */}
                            </tr>
                        );
                    case VIEWS.COMPLETED:
                        return (
                            <tr key={item._id} style={{ backgroundColor: '#f0faff' }}>
                                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{item.amount.toFixed(2)}</td>
                                <td style={tdStyle}>{item.transactionNumber}</td>
                                <td style={{ ...tdStyle, textTransform: 'capitalize' }}>{item.type}</td>
                                <td style={tdStyle}>{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td style={tdStyle}>ACTION BUTTONS HERE</td> {/* Placeholder for Action buttons */}
                            </tr>
                        );
                    default:
                        return null;
                }
            });
        };

        // Render the main table structure
        return (
            <>
                {/* Table Title */}
                {activeView === VIEWS.USERS && <h2>👥 Registered Users ({currentData.length})</h2>}
                {activeView === VIEWS.PENDING && <h2>💰 Pending Transactions ({currentData.length})</h2>}
                {activeView === VIEWS.COMPLETED && <h2>✅ Confirmed Deposit History ({currentData.length})</h2>}

                {/* Pagination Controls (Top) */}
                {renderPaginationControls(currentData, currentPage, setCurrentPage)}

                {/* Main Table */}
                <table style={tableStyle}>
                    <thead>
                        <tr style={
                            activeView === VIEWS.USERS ? { backgroundColor: "#f2f2f2" } : 
                            activeView === VIEWS.PENDING ? { backgroundColor: "#007bff", color: 'white' } : 
                            { backgroundColor: "#17a2b8", color: 'white' }
                        }>
                            <th style={thStyle}>Amount/Username</th> {/* Combined for brevity */}
                            <th style={thStyle}>Phone/Txn Number</th>
                            <th style={thStyle}>Chat ID/Type</th>
                            <th style={thStyle}>Referred By/Method/Date</th>
                            {/* Only Pending and Completed tables need an Action column */}
                            {(activeView === VIEWS.PENDING || activeView === VIEWS.COMPLETED) && <th style={thStyle}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {renderRows()}
                    </tbody>
                </table>
                
                {/* Pagination Controls (Bottom) */}
                {renderPaginationControls(currentData, currentPage, setCurrentPage)}
            </>
        );
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
    marginBottom: "20px" 
};
const thStyle = { border: "1px solid #ddd", padding: "10px" };
const tdStyle = { border: "1px solid #ddd", padding: "8px" };
const tdCenterStyle = { textAlign: "center", padding: "8px" };
const tdNoDataStyle = { textAlign: "center", padding: "10px", backgroundColor: '#fffbe6' };
const tdNoDataStyleBlue = { textAlign: "center", padding: "10px", backgroundColor: '#e6f7ff' };

// --- NEW STYLES FOR PAGINATION ---
const paginationContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px 0',
    marginBottom: '10px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px'
};

const paginationButtonStyle = {
    padding: '8px 15px',
    margin: '0 5px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontWeight: 'bold'
};


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