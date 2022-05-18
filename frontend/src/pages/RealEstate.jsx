// import { pingOther } from '../features/realEstate'
import {useEffect, useState} from 'react'
import DataTable from '../components/DataTable'

function RealEstate() {
    const [regions, setRegions] = useState({})
    const [realEstateData,setRealEstateData] = useState({})

    useEffect(() => {
        fetchStuffs()
        console.log(realEstateData)
    }, [])

    const fetchStuffs = async () => {
        const response = await fetch("https://data.nasdaq.com/api/v3/datatables/ZILLOW/DATA?indicator_id=ZSFH&region_id=99999&api_key=AMT4KbKMfjkMktKg_9Cs")
        const data = await response.json()
        setRealEstateData(data.datatable)
        console.log( "this is repsonse", realEstateData)
    }

    const onClick = async (e) => {
        e.preventDefault()
        const response = await fetch("https://data.nasdaq.com/api/v3/datatables/ZILLOW/DATA?indicator_id=ZSFH&region_id=99999&api_key=AMT4KbKMfjkMktKg_9Cs")
        const data = await response.json()
        setRealEstateData(data.datatable)
        console.log("this is real estate", realEstateData)
    }

    const getRegions = async (e) => {
        e.preventDefault()
        const response = await fetch("https://data.nasdaq.com/api/v3/datatables/ZILLOW/REGIONS?&api_key=AMT4KbKMfjkMktKg_9Cs")
        const data = await response.json()
        setRegions(data.datatable)
        console.log("this is regions table", regions)
    }

    let showTable = (data) => {
        if (JSON.stringify(data) !== '{}'){    
            return (
                <table>
                    <thead>
                        <tr>
                            {console.log('show table',data.column)}
                            {
                                data.columns.map((column,i) => {
                                    return <th key={`${column.name.toString()}-${i}`}>{column.name.toString()}</th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                    {data.data.map((row,i) => {
                        return <tr key={"hello" + i}>
                            {
                                row.map((item,idx) => {
                                    return <td key={`${item}-${i}`}>{item}</td>
                                })
                            }
                        </tr>

                        }
                    )} 
                    </tbody>   
                </table>
            )
        }else{
            <></>
        }
    } 

    return(
        <>
            <button onClick={onClick} className='btn'> Real Estate</button>
            <button onClick={getRegions} className='btn'> Regions </button>
            <div>check the console </div>
            <>{showTable(regions)}</>
            <>{showTable(realEstateData)}</>

        </>
    )
}

export default RealEstate