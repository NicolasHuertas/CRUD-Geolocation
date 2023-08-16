import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MapPage } from './views/MapPage'
import { PlaceFormPage } from './views/PlaceFormPage'
import { PlaceListPage } from './views/PlaceListPage'

function App() {
  return (
    <div className='container mx-auto'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/map' />} />
          <Route path='/map/' element={<MapPage />} />
          <Route path='/places-add' element={<PlaceFormPage />} />
          <Route path='/places' element={<PlaceListPage />} />
          <Route path='/places/:id' element={<PlaceFormPage />} />
        </Routes>
      </BrowserRouter>
    </div>

  )
}
export default App