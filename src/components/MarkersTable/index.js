import React from 'react'
import { TextField, Grid, InputAdornment, Button, Typography, CircularProgress } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import DeleteIcon from '@material-ui/icons/Delete'
import InfoIcon from '@material-ui/icons/Info'
import EditIcon from '@material-ui/icons/Edit'
import { Dialog } from '@material-ui/core'
import './index.css'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { api_endpoint } from '../../util/config'
import { withSnackbar } from 'notistack'
import { useTable, usePagination, useGlobalFilter } from 'react-table'

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const count = preGlobalFilteredRows.length
  
    return (
      <span>
        <TextField
            name='searchValue'
            variant="outlined"
            label="Search Marker"
            value={globalFilter || ''}
            onChange={e => setGlobalFilter(e.target.value || undefined)}
            fullWidth
            InputProps={{
                endAdornment: <InputAdornment position="end">
                    <SearchIcon color='primary' style={{ cursor: 'pointer' }} />
                </InputAdornment>
            }}
        />
      </span>
    )
  }

function MyTable({ columns, data,setModalValues,setModalVisible }) {
    // Use the useTable hook to create your table configuration
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        previousPage,
        state: { pageIndex, pageSize, globalFilter },
        canPreviousPage,
        nextPage,
        page,
        canNextPage,
        // pageIndex,
        pageOptions,
        gotoPage,
        setGlobalFilter,
        preGlobalFilteredRows,
        // pageSize,
        setPageSize
      } = useTable({
        columns,
        data,
      },useGlobalFilter,usePagination)
    // // console.log('porps', props)
    // console.log('____________________________________________________________________________',previousPage,
    // canPreviousPage,
    // nextPage,
    // canNextPage,
    // pageIndex,
    // pageOptions,
    // gotoPage,
    // pageSize,
    // setPageSize)

    return (
        <div style={{width:'90%'}}>
            <div>
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            </div>
            <table {...getTableProps()} style={{width:'100%'}}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
              <th style={{width:'40px'}}></th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                  {/* <td>{i+1}</td> */}
                {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
                <td style={{textAlign:'center'}}><InfoIcon color="primary" style={{cursor:'pointer'}} onClick={()=>{
                    setModalVisible(true)
                    console.log('row',row)
                    setModalValues(row.original)
                }}/></td>
              </tr>
            )
          })}
        </tbody>
      </table>
            {/* <table {...getTableProps()} style={{width:'100%'}}>
                
                <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
                <tbody  {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                        </tr>
                    )
                    })}

                </tbody>
            </table> */}
            <div style={{display:'flex',justifyContent:'space-between'}}>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    Previous Page
                </button>
                <div>
                    Page{' '}
                    <em>
                        {pageIndex + 1} of {pageOptions.length}
                    </em>
                </div>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    Next Page
                </button>
                {/* <div>Go to page:</div>
                <input
                    type="number"
                    defaultValue={pageIndex + 1 || 1}
                    onChange={e => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                        gotoPage(page)
                    }}
                /> */}
                {/* <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {pageSizeOptions.map(pageSize => (
             <option key={pageSize} value={pageSize}>
               Show {pageSize}
             </option>
           ))}
                </select> */}
            </div>
        </div>
    )
}

const MarkersTable = props => {

    const [searchText, setSearchText] = React.useState('')
    // const [designations,setDesignations] = React.useState([])
    const [sizes, setSizes] = React.useState([])
    // const [deparments,setDepartments] = React.useState([])
    const [modalVisible, setModalVisible] = React.useState(false)
    const [modalValues, setModalValues] = React.useState(null)
    const [tableValues, setTableValues] = React.useState(null)
    const [editState, setEditState] = React.useState({})
    const [loading, setLoading] = React.useState(false)

    // React.useEffect(()=>{
    //     console.log('modalValues',modalValues)
    //     setEditState(modalValues)
    // },[modalValues])
    React.useEffect(() => {
        console.log('modalValues', modalValues)
        setLoading(true)
        setEditState(modalValues)
        if (modalValues) {

            try {
                let url = api_endpoint + `/Jordan/Cutting/Marker/getSizesForMarker.php?marker_id=${modalValues.marker_id}`;
                console.log('url', url)
                fetch(url, {
                    method: 'post',
                })
                    .then(res => res.json())
                    .then(res => {
                        console.log('res: ', res)
                        setSizes(res.Sizes)
                        setLoading(false)
                        // if(res.Error_No===0){
                        //     props.enqueueSnackbar('Successfully Updated Worker!', { 
                        //         variant: 'info',
                        //     })
                        //     //fetchWorkers()
                        //     setModalVisible(false)
                        // }else{
                        //     if(typeof res.Error_Description==='object'){
                        //         console.log('objecttypeee')
                        //         props.enqueueSnackbar('Validation Errors!', { 
                        //             variant: 'info',
                        //         })
                        //     }else{
                        //         props.enqueueSnackbar(res.Error_Description, { 
                        //             variant: 'info',
                        //         })
                        //     }
                        // }
                    })
                    .catch(err => {
                        console.log('error while fetching', err)
                        setLoading(false)
                        props.enqueueSnackbar('Error While Getting Styles!', {
                            variant: 'info',
                        })
                    })
            } catch (err) {
                console.log('err in try catch', err)
                setLoading(false)
                props.enqueueSnackbar('Error While Fetching Styles!', {
                    variant: 'info',
                })
            }
        }
    }, [modalValues])


    const fetchMarkers = () => {

        try {
            fetch(api_endpoint + '/Jordan/Cutting/Marker/getMarkers.php')
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    setTableValues(res.Markers)
                })
                .catch(err => {
                    console.log('err in fetching', err)
                    setTableValues([])
                })
        } catch (err) {
            console.log('try catch error: ', err)
            setTableValues([])
        }
    }

    React.useEffect(() => {

        fetchMarkers()

    }, [])

    return (
        <div>
            {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Grid lg={6} md={6} sm={6} xs={6}>
                    <TextField
                        name='searchValue'
                        variant="outlined"
                        label="Search Worker"
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        fullWidth
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <SearchIcon color='primary' style={{ cursor: 'pointer' }} />
                            </InputAdornment>
                        }}
                    // endAdornment={
                    //     <InputAdornment position="end">
                    //       <SearchIcon/>
                    //     </InputAdornment>
                    //   }
                    />
                </Grid>
            </div> */}
            <Dialog
                open={modalVisible}
            >
                <div style={{ padding: 20, width: 480 }}>
                    {
                        modalVisible ?
                            <>
                                <div style={{ textAlign: 'center', marginBottom: 15 }}><Typography variant="h6"> Styles</Typography></div>
                                {
                                    loading === true ?
                                        <div style={{ padding: 20, justifyContent: 'center', display: 'flex' }}>
                                            <CircularProgress color='primary' />
                                        </div>
                                        :
                                        <div container style={{ textAlign: 'center' }}>
                                            {
                                                sizes && sizes.map(s => (<p>Size: {s.size_code}, Quantity: {s.quantity}</p>))
                                            }
                                        </div>
                                }
                                <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                                        <Button color='primary' variant='contained' style={{ color: '#fff', height: '50px' }} fullWidth onClick={() => setModalVisible(false)}>Okay</Button>
                                    </Grid>
                                </Grid>
                            </>
                            : null
                    }
                </div>
            </Dialog>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {
                    tableValues === null ?
                        <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress color='primary' />
                        </div>
                        :
                        <MyTable columns={[
                            {
                                Header: 'Marker',
                                accessor: 'marker_description',
                            }
                        ]} data={tableValues} tableValues={tableValues} setModalValues={setModalValues} setModalVisible={setModalVisible} />
                }
            </div>
        </div>
    )
}

export default withSnackbar(MarkersTable)