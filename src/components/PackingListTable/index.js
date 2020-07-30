import React from 'react'
import { TextField, Grid, InputAdornment, Button, Typography, CircularProgress, Backdrop } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { Dialog } from '@material-ui/core'
import './index.css'
import { api_endpoint, api_endpoint_warehouse } from '../../util/config'
import { withSnackbar } from 'notistack'
import { useTable, usePagination, useGlobalFilter } from 'react-table'

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    //const count = preGlobalFilteredRows.length
  
    return (
      <span>
        <TextField
            name='searchValue'
            variant="outlined"
            label="Search Order"
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

function MyTable({ columns, data,setModalValues,setModalVisible,handleDelete,setOpenBackdrop }) {
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
        initialState: { pageSize: 50 }
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
            {/* <div>
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            </div> */}
            <table {...getTableProps()} style={{width:'100%'}}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
              {/* <th></th> */}
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
                    return <td style={{fontSize:12}} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
                {/* <td style={{ textAlign: 'center' }}><EditIcon color='primary' onClick={() => {
                    setModalVisible(true)
                    setModalValues(row.original)
                }} style={{ cursor: 'pointer', marginRight: 15 }} /><DeleteIcon color='primary' onClick={() => {
                    handleDelete(row.original); setOpenBackdrop(true);
                }} style={{ cursor: 'pointer' }} /></td> */}
                
              </tr>
            )
          })}
        </tbody>
      </table>
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
            </div>
        </div>
    )
}

const PackingListTable = props => {

    const [searchText, setSearchText] = React.useState('')
    const [modalVisible, setModalVisible] = React.useState(false)
    const [openBackdrop, setOpenBackdrop] = React.useState(false)
    const [invoiceNumbers,setInvoiceNumbers] = React.useState([])
    //const [deleteLoader, setDeleteLoader] = React.useState(false)
    const [modalValues, setModalValues] = React.useState(null)
    const [tableValues, setTableValues] = React.useState([])
    const [editState, setEditState] = React.useState({})
    const [state, setState] = React.useState({})
    const [loading, setLoading] = React.useState(false)

    // React.useEffect(() => {
    //     console.log('modalValues', modalValues)
    //     setEditState(modalValues)
    // }, [modalValues])

    const handleFetch = () => {

        console.log('state: ',state)
        console.log('tableValues: ',tableValues)
        setTableValues(null)
        // console.log(`/Jordan/Cutting/Marker/insertMarkerAndSizeMappings.php?style_code=${state.color.style_code}&color=${state.color.color}&marker_description=${state.marker_description}&no_of_plies=${state.no_of_plies}&size_mappings=${tableValues}`)
        setLoading(true)
        try{
            let url = api_endpoint_warehouse+`/fetch/getPackingListDetailsForInvoiceID?invoiceID=${state.invoice?state.invoice.InvoiceID:''}`;
            console.log('url',url)
            fetch(url,{
                method: 'get',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.PackingList){
                    setTableValues(res.PackingList)
                }
            })
            .catch(err => {
                console.log('error while fetching',err)
                setLoading(false)
                props.enqueueSnackbar('Failed to Fetch Packing List!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Failed to Fetch Packing List!', { 
                variant: 'info',
            })
        }

    }

    const handleDelete = (record) => {

    //     try {
    //         setDeleteLoader(true)
    //         setOpenBackdrop(true)
    //         fetch(api_endpoint + `/Jordan/SPTS/order/closeOrder.php?order_id=${record.order_id}`)
    //             .then(res => res.json())
    //             .then(res => {
    //                 setDeleteLoader(false)
    //                 setOpenBackdrop(false)
    //                 console.log('delete response: ', res)
    //                 if (res.Error_No === 0) {
    //                     props.enqueueSnackbar('Successfully deleted order!', {
    //                         variant: 'info',
    //                     })
    //                     fetchOrders()
    //                 }
    //                 //setTableValues(res.Orders)
    //             })
    //             .catch(err => {
    //                 console.log('err in fetching', err)
    //                 setDeleteLoader(false)
    //                 setOpenBackdrop(false)
    //                 //setTableValues([])
    //             })
    //     } catch (err) {
    //         console.log('try catch error: ', err)
    //         setDeleteLoader(false)
    //         setOpenBackdrop(false)
    //         //setTableValues([])
    //     }
    }

    const fetchInvoiceNumbers = () => {
        try {
            fetch(api_endpoint_warehouse + '/fetch/getInvoices')
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    if(res.Invoices){
                        setInvoiceNumbers(res.Invoices)
                    }
                })
                .catch(err => {
                    console.log('err in fetching', err)
                    //setTableValues([])
                })
        } catch (err) {
            console.log('try catch error: ', err)
            //setTableValues([])
        }
    }

    React.useEffect(() => {
        fetchInvoiceNumbers()
    }, [])
    // React.useEffect(() => {
    //     fetchPackingListForInvoice()
    // }, [state.invoice])

    return (
        <>
            {/* <label for="date">Order Date:&nbsp;</label>
            <input type="date" id="date" onChange={(e)=>console.log('date: ',e,e.target.value)} name="date"></input> */}
            <Dialog
                open={modalVisible}
            >
                <div style={{ padding: 20, width: 480 }}>
                    asdf
                    {/* {
                        editState ?
                            <>
                                <div style={{ textAlign: 'center', marginBottom: 15 }}><Typography variant="h6"> Edit Order</Typography></div>
                                <Grid container>
                                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                                        <TextField name="buyer" value={editState.buyer_code} onChange={e => setEditState({ ...editState, buyer_code: e.target.value })} variant="outlined" fullWidth label="Buyer" />
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                                        <TextField name="style" value={editState.style_code} onChange={e => setEditState({ ...editState, style_code: e.target.value })} variant="outlined" fullWidth label="Style" />
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                                        <TextField name="color" value={editState.color} onChange={e => setEditState({ ...editState, color: e.target.value })} variant="outlined" fullWidth label="Color" />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                                        <Button color='primary' variant='contained' style={{ color: '#fff', height: '50px' }} fullWidth onClick={handleUpdate}>Update</Button>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                                        <Button color='primary' variant='contained' style={{ color: '#fff', height: '50px' }} fullWidth onClick={() => setModalVisible(false)}>Cancel</Button>
                                    </Grid>
                                </Grid>
                            </>
                            : null
                    } */}
                </div>
            </Dialog>

                <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                        <Autocomplete
                            //id="combo-box-demo"
                            options={invoiceNumbers}
                            getOptionLabel={option => option.InvoiceCode}
                            style={{ width: '100%' }}
                            onChange={(e,v) => setState({...state,invoice:v})}
                            renderInput={params => (
                                <TextField {...params} label="Invoice" variant="outlined" fullWidth />
                            )}
                        />
                    </Grid>
                    <Grid item lg={3} md={3} sm={3} xs={3} style={{ padding: 5 }}>
                        <Button variant="contained" color='primary' onClick={handleFetch} style={{color:'#fff',height:'100%'}} >
                            {
                                `Fetch`
                            }
                        </Button>
                    </Grid>
                </Grid>
                <Grid container style={{ display: 'flex', justifyContent: 'center' }}>

                    {
                        tableValues === null ?
                        <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress color='primary' />
                        </div>
                        :
                        tableValues.length === 0 ?
                        null
                        :
                        <MyTable columns={[
                            {
                                Header: 'Supplier',
                                accessor: 'Supplier',
                            },
                            {
                                Header: 'Buyer',
                                accessor: 'Buyer',
                            },
                            {
                                Header: 'Style',
                                accessor: 'StyleCode',
                            },
                            {
                                Header: 'Color',
                                accessor: 'ColorCode',
                            },
                            {
                                Header: 'Lot',
                                accessor: 'LotCode',
                            },
                            {
                                Header: 'Invoice',
                                accessor: 'InvoiceCode',
                            },
                            {
                                Header: 'Roll No',
                                accessor: 'RollCode',
                            },
                            {
                                Header: 'Fabric',
                                accessor: 'FabricType',
                            },
                            {
                                Header: 'Length',
                                accessor: 'RollLength',
                            },
                            {
                                Header: 'Net Weight',
                                accessor: 'NetWeight',
                            },
                            {
                                Header: 'Gross Weight',
                                accessor: 'GrossWeight',
                            },
                        ]} data={tableValues} tableValues={tableValues} 
                        // setModalValues={setModalValues} setModalVisible={setModalVisible} handleDelete={handleDelete} setOpenBackdrop={setOpenBackdrop}
                        />
                    }
                </Grid>
                <Backdrop open={openBackdrop}>
                    <CircularProgress color="inherit" />
                </Backdrop>
        </>
    )
}

export default withSnackbar(PackingListTable)