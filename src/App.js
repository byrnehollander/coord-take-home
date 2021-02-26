import { useState, useEffect } from 'react'
import axios from 'axios'
import AddressSearch from './AddressSearch'

const MIN_PARKING_SPACE_LENGTH_METERS = 5.5
const RADIUS_KM = '0.3'
const PARKING_USE = 'park'
const ALL_VEHICLE_TYPES = 'all'
const ACCESS_KEY = process.env.REACT_APP_COORD_ACCESS_KEY
const BASE_URL = 'https://api.coord.co/v1/search/curbs/bylocation/time_rules?'

const INIT_PARAMS = {
  radius_km: RADIUS_KM,
  access_key: ACCESS_KEY,
  permitted_use: PARKING_USE,
  vehicle_type: ALL_VEHICLE_TYPES
}

const params = new URLSearchParams(INIT_PARAMS)

const App = () => {
  const [latitude, setLatitude] = useState()
  const [longitude, setLongitude] = useState()
  const [response, setResponse] = useState()
  const [error, setError] = useState()
  const [isFetching, setIsFetching] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)

  useEffect(() => {
    if (latitude && longitude) {
      setIsFetching(true)
      async function fetchData () {
        try {
          params.set('latitude', latitude)
          params.set('longitude', longitude)
          const response = await axios.get(BASE_URL + params.toString())
          setResponse(response)
        } catch (error) {
          setError(error)
        } finally {
          setIsFetching(false)
        }
      }
      fetchData()
    }
  }, [latitude, longitude])

  const renderNumParkingSpots = () => {
    if (error) {
      return <div>Error! {error}</div>
    }

    if (isGeocoding || isFetching) {
      return <div>Loading...</div>
    }

    if (!latitude || !longitude) {
      return <div>Enter an NYC address above to get the number of parking spaces near you</div>
    }

    let validSpaces = []
    if (response?.data?.features?.length > 0) {
      validSpaces = response.data.features.filter(i => {
        const end = i?.properties?.metadata?.distance_end_meters
        const start = i?.properties?.metadata?.distance_start_meters
        if (start && end) {
          const length = end - start
          return length >= MIN_PARKING_SPACE_LENGTH_METERS
        }
        return false
      })
    }
    return <div>There are {validSpaces.length} parking spots nearby.</div>
  }

  return (
    <div>
      <div>Welcome! This app takes an address within one of the five boroughs of NYC and returns the number of available parking spots within 0.3 km (about 1000 feet).
        <div className='disclaimer'>Disclaimers:</div>
        <ul>
          <li>The parking spots returned are all at least 5.5m (18 feet) long. This means they'll fit cars like Toyota Camrys (16 feet long), but not large trucks.</li>
          <li>Any type of car can park in these spots – not just commercial vehicles.</li>
          <li>The Google Geocoding/Places API costs $0.005/request so I've set a quota of 100 requests per day, which resets at midnight Pacific Time.</li>
        </ul>
      </div>
      <AddressSearch
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        setIsGeocoding={setIsGeocoding}
        setError={setError}
        clearResponse={() => setResponse(null)}
      />
      {renderNumParkingSpots()}
      <div className='github-link'>
        <a href='https://github.com/byrnehollander/coord-take-home/' rel='noopener noreferrer' target='_blank'>View code on Github</a>
      </div>
    </div>
  )
}

export default App
