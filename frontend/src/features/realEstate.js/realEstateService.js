import axios from 'axios'

const API_URL = ''

const pingOther = async () => {
    const config = {
    
    }

    const response = await axios.get( "https://pokeapi.co/api/v2/pokemon/ditto" )

    return response.data
}

const realEstateService = {
    pingOther
}

export default realEstateService