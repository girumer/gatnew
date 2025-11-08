import React from 'react'

function ResultTable() {
  return (
    <div>
      <table>
        <thead className='table-header'>
        <tr className='table-row'>
            <td>Name</td>
             <td>Atempts</td>
             <td>Earning Points</td>
             <td>Result</td>
        </tr>
        </thead>
        <tbody>
          <tr className='table-body'>
            <td>GAT EXAM</td>
             <td>03</td>
             <td>100</td>
             <td>PASSED</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ResultTable
