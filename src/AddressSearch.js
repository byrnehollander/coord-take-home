import { useState } from 'react'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete'

const VALID_CITIES = [
  'New York, NY',
  'Brooklyn, NY',
  'Queens, NY',
  'Staten Island, NY',
  'Bronx, NY'
]

const AddressSearch = ({
  setLatitude,
  setLongitude,
  setIsGeocoding,
  setError,
  clearResponse
}) => {
  const [address, setAddress] = useState('')
  const [isInNYC, setIsInNYC] = useState(false)

  const isAddressInNYC = address => {
    for (let i = 0; i < VALID_CITIES.length; i++) {
      if (address.includes(VALID_CITIES[i])) {
        return true
      }
    }
    return false
  }

  const handleChange = address => {
    setAddress(address)
  }

  const resetState = () => {
    setAddress('')
    setIsInNYC(false)
    setLatitude(null)
    setLongitude(null)
    clearResponse()
  }

  const handleSelect = selected => {
    setAddress(selected)
    if (isAddressInNYC(selected)) {
      setIsInNYC(true)
      setIsGeocoding(true)
      geocodeByAddress(selected)
        .then(res => getLatLng(res[0]))
        .then(({ lat, lng }) => {
          setLatitude(lat)
          setLongitude(lng)
          setIsGeocoding(false)
        })
        .catch(error => {
          setError(error)
          setIsGeocoding(false)
        })
    } else if (isInNYC) {
      resetState()
    }
  }

  const handleCloseClick = () => {
    resetState()
  }

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
      highlightFirstSuggestion
    >
      {({ getInputProps, suggestions, getSuggestionItemProps }) => {
        return (
          <div>
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Search Places...',
                  className: 'search-input'
                })}
              />
              {address.length > 0 && (
                <button
                  className='clear-button'
                  onClick={handleCloseClick}
                >
                  x
                </button>
              )}
            </div>
            {suggestions.length > 0 && (
              <div>
                {suggestions.map((suggestion, i) => {
                  return (
                    <div
                      key={i}
                      {...getSuggestionItemProps(suggestion, { })}
                    >
                      <strong>
                        {suggestion.formattedSuggestion.mainText}
                      </strong>{' '}
                      <small>
                        {suggestion.formattedSuggestion.secondaryText}
                      </small>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      }}
    </PlacesAutocomplete>
  )
}

export default AddressSearch
