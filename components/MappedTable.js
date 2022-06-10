import { Fragment, isValidElement } from "react"
import { Table } from "./common/Table"

const MappedTable = ({
  data,
  propertyNames = Object.keys(data[0]),
  customCell: Component = null,
}) => {
  let filteredData = data.map((v) =>
    Object.keys(v)
      .filter((k) => propertyNames.includes(k))
      .reduce((acc, key) => ((acc[key] = v[key]), acc), {})
  )
  // return (
  //   <div className="flex flex-col">
  //     <div className="overflow-x-auto shadow-md sm:rounded-lg">
  //       <div className="inline-block min-w-full align-middle">
  //         <div className="overflow-hidden ">
  //           <table className="min-w-full table-fixed divide-y divide-gray-200">
  //             <thead className="bg-gray-100">
  //               <tr>
  //                 {propertyNames.map((val) => (
  //                   <th
  //                     scope="col"
  //                     className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700"
  //                     key={`h_${val}`}
  //                   >
  //                     {val}
  //                   </th>
  //                 ))}
  //               </tr>
  //             </thead>
  //             <tbody className="divide-y divide-gray-200 bg-white">
  //               {data.map((val, i) => (
  //                 <tr
  //                   className="hover:bg-gray-100"
  //                   key={`i_${i}`}
  //                 >
  //                   {propertyNames.map((p, i, arr) => (
  //                     <td
  //                       width={Math.floor(100 / arr.length) + '%'}
  //                       className="whitespace-nowrap py-3 px-4 text-sm font-medium text-gray-900"
  //                       key={`i_${i}_${p}`}
  //                     >
  //                       {Component && (
  //                         <Component
  //                           value={val[p]}
  //                           propertyName={p}
  //                           item={val}
  //                         ></Component>
  //                       )}
  //                       {!Component && val[p]}
  //                     </td>
  //                   ))}
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )

  return (
    <Table>
      <Table.Head>
        {propertyNames.map((val) => (
          <Table.HeadCell
            key={`h_${val}`}
          >
            {val}
          </Table.HeadCell>
        ))}
      </Table.Head>

      <Table.Body className="divide-y">
        {data.map((val, i) => (
          <Table.Row
            className="bg-white"
            key={`i_${i}`}
          >
            {propertyNames.map((p, i, arr) => (
              <Table.Cell
                width={Math.floor(100 / arr.length) + '%'}
                className="whitespace-nowrap font-medium text-gray-900 "
                key={`i_${i}_${p}`}
              >
                {isValidElement(Component) && (
                  <Component
                    value={val[p]}
                    propertyName={p}
                    item={val}
                  ></Component>
                )}
                {!Component && val[p]}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default MappedTable
