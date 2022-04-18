import React from 'react'
import Button from './Button'
import personsService from '../services/persons'

const Person = ({ person,setPersons,persons,setErrorMessage,setClassName }) => {
    return (
      <tr>
      <td>{person.name} {person.number} </td>
      <td> <Button handleClick={()=>handleClick(person,setPersons,persons,setErrorMessage,setClassName)} text={"Delete"}/></td>
    </tr>
      
    )
  }
  
  const handleClick= (person,setPersons,persons,setErrorMessage,setClassName) => {
    
    if (window.confirm(`Do you really want to delete ${person.name} ?`)) {
      const personName=person.name
      personsService
      .deletePerson(person.id)
      .then(response => {
            personsService
        .getAll()
        .then(updatePersons => {
          setPersons(updatePersons)
            }).catch(error => {
              //Setting error nottification attribut
                setErrorMessage(` Information of ${personName} has already been remove` )
                setClassName('error')
                setTimeout(() => {
                  setErrorMessage('')
                }, 3000)
            })

      })

      //Setting sucess nottification attribut
      setErrorMessage(` ${person.name} is deleted` )
      setClassName('sucess')
      setTimeout(() => {
        setErrorMessage('')
      }, 2000)

    }
 }
  
  const Persons = ({ persons,setPersons,showFilter,setErrorMessage,setClassName }) => {
    const namesToShow = showFilter===''
    ? persons
    : persons.filter(person=>person.name.toLowerCase().includes(showFilter.toLowerCase()))
  
    return (
      <table>
      <tbody>
          {namesToShow.map(person =>
            <Person key={person.id} person={person} persons={persons} setPersons={setPersons} setErrorMessage={setErrorMessage}
            setClassName={setClassName} />
          )}
      </tbody>
      </table>
      
    )
  }

  export default Persons