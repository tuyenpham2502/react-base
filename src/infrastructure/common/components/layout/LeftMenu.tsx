import { Link } from 'react-router-dom'

const LeftMenu = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to='/home'>Home</Link>
        </li>
        <li>
          <Link to='/about'>About</Link>
        </li>
        <li>
          <Link to='/contact'>Contact</Link>
        </li>
      </ul>
    </div>
  )
}

export default LeftMenu
