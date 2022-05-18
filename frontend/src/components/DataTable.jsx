import { useSelector } from 'react-redux'

function DataTable(data) {

  return (
    <tbody>
        <tr>
            <th>Id</th>
            <th>region_id</th>
            <th>date</th>
            <th>value</th>
        </tr>
        {data.map((item, i) => (
            <tr key={i}>
                <td>{item.Id}</td>
                <td>{item.region_id}</td>
                <td>{item.date}</td>
                <td>{item.value}</td>
            </tr>
        ))}
    </tbody>
  )
}

export default DataTable
