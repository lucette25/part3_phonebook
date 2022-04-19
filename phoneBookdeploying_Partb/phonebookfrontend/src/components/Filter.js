import React from 'react'


const Filter = ({ handleFilterChange }) => {
    return (
      <div>Filter shown with : <input onChange={handleFilterChange}/></div>
      )
  }

  export default Filter