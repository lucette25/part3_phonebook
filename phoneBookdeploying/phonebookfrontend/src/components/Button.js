const Button = ({ handleClick,text }) => (
    <button onClick={handleClick} className='button'>
      {text}
    </button>
  )

export default Button


