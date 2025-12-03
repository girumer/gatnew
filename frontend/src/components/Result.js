return (
  <div className="container">
    {result.length >= queue.length && (
      <div className="result-box">
        <h2>Exam Summary</h2>
        <p><strong>Exam:</strong> {exam}</p>
        <p><strong>Year:</strong> {year}</p>
        <p><strong>Part:</strong> {part}</p>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Phone:</strong> {phoneNumber}</p>
        <p><strong>Attempts:</strong> {atempts}</p>
        <p><strong>Points:</strong> {earnpoints} / {totalpoints}</p>
        <p className={flag ? 'passed' : 'failed'}>
          <strong>Status:</strong> {flag ? 'Passed ✅' : 'Failed ❌'}
        </p>

        {/* Table inside the same box */}
        <div className="result-table-wrapper">
          <UserResults phone={phoneNumber} />
        </div>
      </div>
    )}

    {/* Table only (when quiz not finished) */}
    {result.length < queue.length && (
   <UserResults phone={phoneNumber} />
    )}

    <UserResults phone={phoneNumber} />

    <div className="restart">
      <Link to="/" onClick={onRestart} className="btn">
        Restart Quiz
      </Link>
    </div>
  </div>
);
