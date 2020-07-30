import React from 'react'
import { TextField, Grid, InputAdornment, Button, Typography, CircularProgress, Backdrop } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { Dialog } from '@material-ui/core'
import './index.css'
import { api_endpoint } from '../../util/config'
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
              <th></th>
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
                <td style={{ textAlign: 'center' }}><EditIcon color='primary' onClick={() => {
                    setModalVisible(true)
                    setModalValues(row.original)
                }} style={{ cursor: 'pointer', marginRight: 15 }} /><DeleteIcon color='primary' onClick={() => {
                    handleDelete(row.original); setOpenBackdrop(true);
                }} style={{ cursor: 'pointer' }} /></td>
                
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

const OrdersTable = props => {

    const [searchText, setSearchText] = React.useState('')
    const [modalVisible, setModalVisible] = React.useState(false)
    const [openBackdrop, setOpenBackdrop] = React.useState(false)
    const [deleteLoader, setDeleteLoader] = React.useState(false)
    const [modalValues, setModalValues] = React.useState(null)
    const [tableValues, setTableValues] = React.useState(null)
    const [editState, setEditState] = React.useState({})
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        console.log('modalValues', modalValues)
        setEditState(modalValues)
    }, [modalValues])

    const handleUpdate = () => {
        console.log('editState', editState)
        //operation_id operation_code operation_description operation_smv
        try {
            let url = api_endpoint + `/Jordan/SPTS/order/updateOrder.php?order_id=${editState.order_id}&order_description=${editState.order_description}&otn=${editState.otn}&buyer=${editState.buyer_code}&style_code=${editState.style_code}&color=${editState.color}`;
            console.log('url', url)
            fetch(url, {
                method: 'post',
            })
                .then(res => res.json())
                .then(res => {
                    setLoading(false)
                    console.log('res: ', res)
                    if (res.Error_No === 0) {
                        props.enqueueSnackbar('Successfully Updated Order!', {
                            variant: 'info',
                        })
                        fetchOrders()
                        setModalVisible(false)
                    } else {
                        if (typeof res.Error_Description === 'object') {
                            console.log('objecttypeee')
                            props.enqueueSnackbar('Validation Errors!', {
                                variant: 'info',
                            })
                        } else {
                            props.enqueueSnackbar(res.Error_Description, {
                                variant: 'info',
                            })
                        }
                    }
                })
                .catch(err => {
                    console.log('error while fetching', err)
                    setLoading(false)
                    props.enqueueSnackbar('Error While Updating Order!', {
                        variant: 'info',
                    })
                })
        } catch (err) {
            console.log('err in try catch', err)
            setLoading(false)
            props.enqueueSnackbar('Error While Updating Order!', {
                variant: 'info',
            })
        }
    }

    const handleDelete = (record) => {

        try {
            setDeleteLoader(true)
            setOpenBackdrop(true)
            fetch(api_endpoint + `/Jordan/SPTS/order/closeOrder.php?order_id=${record.order_id}`)
                .then(res => res.json())
                .then(res => {
                    setDeleteLoader(false)
                    setOpenBackdrop(false)
                    console.log('delete response: ', res)
                    if (res.Error_No === 0) {
                        props.enqueueSnackbar('Successfully deleted order!', {
                            variant: 'info',
                        })
                        fetchOrders()
                    }
                    //setTableValues(res.Orders)
                })
                .catch(err => {
                    console.log('err in fetching', err)
                    setDeleteLoader(false)
                    setOpenBackdrop(false)
                    //setTableValues([])
                })
        } catch (err) {
            console.log('try catch error: ', err)
            setDeleteLoader(false)
            setOpenBackdrop(false)
            //setTableValues([])
        }
    }

    const fetchOrders = () => {
        try {
            fetch(api_endpoint + '/Jordan/SPTS/order/getOrders.php')
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    setTableValues(res.Orders)
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
        fetchOrders()
    }, [])

    return (
        <div>
            <Dialog
                open={modalVisible}
            >
                <div style={{ padding: 20, width: 480 }}>
                    {
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
                                Header: 'Style',
                                accessor: 'style_code',
                            },
                            {
                                Header: 'Buyer',
                                accessor: 'buyer_code',
                            },
                            {
                                Header: 'Color',
                                accessor: 'color',
                            },
                        ]} data={tableValues} tableValues={tableValues} setModalValues={setModalValues} setModalVisible={setModalVisible} handleDelete={handleDelete} setOpenBackdrop={setOpenBackdrop} />
                        // <table style={{ height: 400, overflowY: 'scroll' }}>
                        //     <tr>
                        //         <th>Color</th>
                        //         <th>Style</th>
                        //         <th>Buyer</th>
                        //         <th style={{ width: '70px' }}></th>
                        //     </tr>
                        //     <tbody>
                        //         {
                        //             tableValues.map(v => (
                        //                 <tr>
                        //                     <td>{v.color}</td>
                        //                     <td>{v.style_code}</td>
                        //                     <td>{v.buyer_code}</td>
                        //                     <td style={{ textAlign: 'center' }}><EditIcon color='primary' onClick={() => {
                        //                         setModalVisible(true)
                        //                         setModalValues(v)
                        //                     }} style={{ cursor: 'pointer', marginRight: 15 }} /><DeleteIcon color='primary' onClick={() => {
                        //                         handleDelete(v); setOpenBackdrop(true); console.log('delete row: ', v);
                        //                     }} style={{ cursor: 'pointer' }} /></td>
                        //                 </tr>
                        //             ))
                        //         }

                        //     </tbody>
                            
                        // </table>
                }
                <Backdrop open={openBackdrop}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </div>
    )
}

export default withSnackbar(OrdersTable)