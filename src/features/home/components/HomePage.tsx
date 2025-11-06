import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Layout from './Layout'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className="d-flex justify-content-end p-3">
        <Button 
          variant="outline-dark" 
          size="sm"
          onClick={() => navigate('/admin')}
        >
          Admin Panel
        </Button>
      </div>
      <Layout />
    </div>
  )
}

export default HomePage
