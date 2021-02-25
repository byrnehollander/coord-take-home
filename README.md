# Byrne's Coord Take-Home

The app is available at [https://byrnehollander.github.io/coord-take-home/](https://byrnehollander.github.io/coord-take-home/).

This app asks users to pick a location within NYC and tells them how many parking spots are within walking distance at the current time. 

### 1. What is walking distance?

For this app, walking distance is defined as 0.3km (around 1000 feet). [Some researchers have defined walking distance as "no more than 0.25 miles (or 0.40 km)"](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3377942/), but acknowledge that distance varies depending on  purpose and population group. [Others have argued for 300-600 feet for retail customers](https://trid.trb.org/view/859431#:~:text=There%20is%20a%20lack%20of,as%20great%20as%202%2C000%20feet.), so I just settled on 1000 feet.

### 2. How big is a parking spot?

Different cars require different sized parking spaces. [Some sources](https://franklinst.com/how-large-is-a-parking-space/) say a standard parallel parking spot is 20 feet long, but I went with 5.5 meters (~18 feet) for this challenge. A Toyota Camry is 16 feet long, so this will work for Camrys (as long as nothing is partially parked in the spot).

### 3. What counts as a parking spot? Can only certain kinds of vehicles can park there?

I found these parking spots with the [Coord 'Rules at a point in time for curbs near a location' API](https://www.coord.com/api#/reference/0/rules-at-a-point-in-time-for-curbs-near-a-location/find-the-rules-for-curbs-near-a-location-at-a-certain-time). All these parking spaces are currently available (excluding the `time` parameter uses the current time by default), have parking as a `permitted_use`, and support all `vehicle_type`s.


### 4. How does the user input their location?

Users will use the enter their NYC address into the autocomplete input box. The component is from the [react-places-autocomplete](https://github.com/hibiken/react-places-autocomplete) project but is very much unstyled (sorry!), and uses the [Google Maps Places Library](https://developers.google.com/maps/documentation/javascript/places) and the [Google Maps Geocoder API](https://developers.google.com/maps/documentation/javascript/geocoding).

Unfortunately, these APIs cost money per request, so I've limited them to 100 requests/day. Additionally, if you select an address outside of the five boroughs, the app does not make a call to the Geocoder API.
## How to run locally

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), so it should look pretty familiar if you've used CRA before.

## Create a `.env` file

You can run `cp .env.sample .env` and set values for both `REACT_APP_COORD_ACCESS_KEY` and `REACT_APP_GOOGLE_GEOCODING_API_KEY` in `.env`. Then, run `source .env`.
### `yarn start`

After the environment variables are set, run `yarn start` to run the app in the development mode.

Then, open [http://localhost:3000/coord-take-home](http://localhost:3000/coord-take-home) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
