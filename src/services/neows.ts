import axios from 'axios'
import { response } from 'express'
import lodash from 'lodash'
import moment from 'moment'

const api_key = 'z1CwSch60fYEIwXG7uTXo4PnDEdDojkiEfBHlyvF'

function formatNeoWsData(_data) {
    const data = _data.map((asteroid: { [key: string]: any }) => {
        return {
            asteroid_id: asteroid.id,
            diameter: `${Math.trunc(asteroid.estimated_diameter.feet.estimated_diameter_min)} - ${Math.trunc(asteroid.estimated_diameter.feet.estimated_diameter_max)}`,
            velocity: asteroid.close_approach_data[0] ? `${Math.trunc(asteroid.close_approach_data[0].relative_velocity.miles_per_hour)}` : null,
            distance: asteroid.close_approach_data[0] ? `${Math.trunc(asteroid.close_approach_data[0].miss_distance.miles)}` : null,
            close_approach: asteroid.close_approach_data[0] ? `${moment(asteroid.close_approach_data[0].epoch_date_close_approach).format('DD/MM/YY - HH:mm')}` : null,
            pha: asteroid.is_potentially_hazardous_asteroid,
            name: asteroid.name
        }
    })
    return data
}

export interface IDates {
    start: string,
    end: string
}

export async function feed(dates: IDates) {
    try {
        const params = {}
        if(dates.start) params['start_date'] = dates.start
        if(dates.end) params['end_date'] = dates.end
        const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/feed?detailed=true&api_key=${api_key}`, {
            params: params
        })
        const closest = getClosest(response.data.near_earth_objects)
        return {
            data: formatNeoWsData(closest),
            status: 200
        }
    } catch (error) {
        return {
            data: {error: error.response.data.error_message},
            status: 500
        }
    }
}

export async function browse() {
    try {
        const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/browse?page=0&size=10&api_key=${api_key}`)
        return {
            data: formatNeoWsData(response.data.near_earth_objects),
            status: 200
        }
    } catch (error) {
        return {
            data: {error: error.response.data.error_message},
            status: 500
        }
    }
}

export async function search(asteroid_id: string) {
    try {
        const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/${asteroid_id}?api_key=${api_key}`)
        return {
            data: formatNeoWsData([response.data]),
            status: 200
        }
    } catch (error) {
        return {
            data: {error: error.response.data.error_message},
            status: 400
        }
    }
}


function getClosest(_data: {}) {
    let asteroids = []
    Object.entries(_data).forEach( (group: any[]) => {
        asteroids = [...asteroids, ...group[1]]
    })
    const ordered = lodash.sortBy(asteroids, (e: any) => {
       return e.close_approach_data[0].epoch_date_close_approach
    })
    return ordered.reverse().slice(0, 10)
}

