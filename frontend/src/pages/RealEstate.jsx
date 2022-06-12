// import { pingOther } from '../features/realEstate'
import {useEffect, useState} from 'react'
import DataTable from '../components/DataTable'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

function RealEstate() {
    const [regions, setRegions] = useState({})
    const [realEstateData, setRealEstateData] = useState({})
    const [indicators, setIndicator] = useState({})
    const [lineChartData, setLineChartData] = useState({})
    const [scaterChartData, setScatterChartData] = useState([])
    const [lookup] = useState({
        realEstateData:["region_id","indicator_id","data","value"],
        regions:["region_id","region_type,","region"],
        indicators: ["indicator_id","indicator", "category"]})
    const [queryParameters,setQueryParameters] = useState({
        "region_id": "",
        "region_type": "", 
        "region": "", 
        "indicator_id": "", 
        "indicator": "", 
        "category": "", 
        "data": "", 
        "value": ""})
    const [sampleData, setSampleData] = useState( 
        [
        {
          "x": 100,
          "y": 200,
          "z": 200
        },
        {
          "x": 120,
          "y": 100,
          "z": 260
        },
        {
          "x": 170,
          "y": 300,
          "z": 400
        },
        {
          "x": 140,
          "y": 250,
          "z": 280
        },
        {
          "x": 150,
          "y": 400,
          "z": 10000000
        },
        {
          "x": 110,
          "y": 280,
          "z": 200
        }
      ])
    useEffect(() => {
        // fetchStuffs()
        // console.log(realEstateData)
    }, [])

    const fetchStuffs = async () => {
        const response = await fetch("https://data.nasdaq.com/api/v3/datatables/ZILLOW/DATA?indicator_id=ZSFH&region_id=99999&api_key=AMT4KbKMfjkMktKg_9Cs")
        const data = await response.json()
        setRealEstateData(data.datatable)
        console.log( "this is repsonse", realEstateData)
    }

    const consoleLogData = () => {
        console.log('chart data', createChartData(realEstateData.data))
    }

    const submitQuery = async (e,type) => {
        e.preventDefault()
        let query = ""
        let table = ""
        let saveResponse
        switch(type) {
            case "realEstateData":
                table = "DATA"
                saveResponse = (x) => setRealEstateData(x)
                lookup.realEstateData.map(field => {
                    if(queryParameters[field].length > 0){
                        query += field+"="+queryParameters[field]+"&"
                    }
                })
                break;
            case "regions":
                table = "REGIONS"
                saveResponse = (x) => setRegions(x)
                lookup.regions.map(field => {
                    if(queryParameters[field].length > 0){
                        query += field+"="+queryParameters[field]+"&"
                    }
                })
                break;
            case "indicators":
                table = "INDICATORS"
                saveResponse = (x) => setIndicator  (x)
                lookup.indicators.map(field => {
                    if(queryParameters[field].length > 0){
                        query += field+"="+queryParameters[field]+"&"
                    }
                })
                break;
            default:
                console.log("shouldn't be reaching this")
        }
        if (query == "") {query += "&"}
        const response = await fetch("https://data.nasdaq.com/api/v3/datatables/ZILLOW/"+table+"?"+query+"api_key=AMT4KbKMfjkMktKg_9Cs")
        const data = await response.json()
        saveResponse(data.datatable)
        console.log("this is regions table", query)
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setQueryParameters(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const createChartData = (data, xaxis) => {
        let temp = lineChartData
        console.log('inside function',data)
        data.forEach(element => {
            let value = (Math.ceil(element[3]/50000)*50000)
            let field = element[2].substring(0,4)
            if(temp[value] != undefined){
                if(temp[value][field] != undefined){
                    temp[value][field] += 1
                }else{
                    temp[value][field] = 1
                }
            }else{
                temp[value] = {}
                temp[value][field] = 1
            }
        })
        let chartTemp = []
        setScatterChartData(chartTemp)
        let keys = Object.keys(temp)
        keys.forEach((soldPrice) => {
            let points = Object.keys(temp[soldPrice])
            points.forEach((date) => {
                chartTemp.push(
                    {
                        value: soldPrice,
                        date: parseInt(date),
                        numberSold: temp[soldPrice][date]
                    }
                )
            })
        })
        setScatterChartData(chartTemp)
        return chartTemp
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

    let showLineGraph = (xaxis, data) => {
        if (JSON.stringify(data) !== '{}'){  
            return(
                <LineChart width={730} height={250} data={data} className={'recharts-chart'}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xaxis} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
            )
        }else{
            <></>
        }
    }

    let showScatterChart = (data) => {
        return( 
            <>
                <ScatterChart width={1000} height={250} 
                    margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" name="date" type='number' domain={['dataMin', 'dataMax']} tickCount={10} />
                    <YAxis dataKey="value" name="value" unit="$" orientation='right'/>
                    <ZAxis dataKey="numberSold" range={[0, 500]} name="sold" unit=" Sold" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} label='Number'/>
                    <Legend />
                    <Scatter name="Houses Sold" data={data} fill="#8884d8" />
                    {/* <Scatter name="B school" data={data02} fill="#82ca9d" /> */}
                </ScatterChart>
            </>
        )
    }

    return(
        <>
            <form onSubmit={e => submitQuery(e,"realEstateData")}>
                <div className='form-group'>
                    <textarea
                    name='indicator_id'
                    id='indicator_id'
                    className='form-control'
                    placeholder='Indicator ID'
                    value={queryParameters.indicator_id}
                    onChange={(e) => handleChange(e)}
                    ></textarea>
                    <textarea
                    name='region_id'
                    id='region_id'
                    className='form-control'
                    placeholder='Region ID'
                    value={queryParameters.region_id}
                    onChange={(e) => handleChange(e)}
                    ></textarea>
                    <textarea
                    name='data'
                    id='data'
                    className='form-control'
                    placeholder='Data'
                    value={queryParameters.data}
                    onChange={(e) => handleChange(e)}
                    ></textarea>
                    <textarea
                    name='value'
                    id='value'
                    className='form-control'
                    placeholder='Value'
                    value={queryParameters.Value}
                    onChange={(e) => handleChange(e)}
                    ></textarea>
                </div>
                <div className='form-group'>
                    <button className='btn' type='submit'>
                    Real Estate data
                    </button>
                </div>
            </form>
            <form onSubmit={e => submitQuery(e,"regions")}>
                <div className='form-group'>
                    <textarea
                    name='region_id'
                    id='region_id'
                    className='form-control'
                    placeholder='Region ID'
                    value={queryParameters.region_id}
                    onChange={(e) => handleChange(e)}
                    ></textarea>
                    <textarea
                    name='region_type'
                    id='region_type'
                    className='form-control'
                    placeholder='Region Type'
                    value={queryParameters.region_type}
                    onChange={(e) => handleChange(e)}
                    ></textarea>
                    <textarea
                    name='region'
                    id='region'
                    className='form-control'
                    placeholder='Region'
                    value={queryParameters.region}
                    onChange={(e) => handleChange(e)}
                    ></textarea>
                </div>
                <div className='form-group'>
                    <button className='btn' type='submit'>
                    Regions
                    </button>
                </div>
            </form>
            <form onSubmit={e => submitQuery(e,"indicators")}>
                <div className='form-group'>
                    <textarea
                    name='indicator_id'
                    id='indicator_id'
                    className='form-control'
                    placeholder='Indicator ID'
                    value={queryParameters.indicator_id}
                    onChange={(e) => handleChange(e)}
                    ></textarea>
                    <textarea
                    name='indicator'
                    id='indicator'
                    className='form-control'
                    placeholder='Indicator'
                    value={queryParameters.indicator}
                    onChange={(e) => handleChange(e)}
                    ></textarea>
                    <textarea
                    name='category'
                    id='category'
                    className='form-control'
                    placeholder='Category'
                    value={queryParameters.category}
                    onChange={(e) => handleChange(e)}
                    ></textarea>
                </div>
                <div className='form-group'>
                    <button className='btn' type='submit'>
                    indicators
                    </button>
                </div>
            </form>
            <button onClick={consoleLogData} className='btn'> console log chart data</button>
            {/* <button onClick={getRegions} className='btn'> Regions </button> */}
            {/* <>{showLineGraph("dates", data)}</> */}
            <>{showScatterChart(scaterChartData)}</>
            <>{showTable(indicators)}</>
            <>{showTable(regions)}</>
            <>{showTable(realEstateData)}</>

        </>
    )
}

export default RealEstate