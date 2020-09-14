import React from 'react'
import { TextField, Grid, InputAdornment, Select, MenuItem, CircularProgress, Backdrop } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { Dialog } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
//import './index.css'
import { api_endpoint, api_endpoint_warehouse } from '../../util/config'
import { withSnackbar } from 'notistack'
import { useTable, usePagination, useGlobalFilter, useRowSelect } from 'react-table'

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
                label="Search Rolls"
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

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
            <>
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
        )
    }
)

function MyTable({ columns, data,options }) {
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
        selectedFlatRows,
        state: { selectedRowIds },
        setGlobalFilter,
        preGlobalFilteredRows,
        // pageSize,
        setPageSize
    } = useTable({
        columns,
        data,
    }, useGlobalFilter, usePagination, useRowSelect,
        hooks => {
            hooks.visibleColumns.push(columns => [
                // Let's make a column for selection
                {
                    id: 'selection',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div>
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
                ...columns,
            ])
        })
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
        <div style={{overflowX:'scroll'}}>
            {/* <div style={{display:'flex',justifyContent:'center',marginTop:20}}>
              <div style={{width:300}}>
                  <GlobalFilter
                      preGlobalFilteredRows={preGlobalFilteredRows}
                      globalFilter={globalFilter}
                      setGlobalFilter={setGlobalFilter}
                  />
              </div>
            </div> */}
            <table {...getTableProps()} style={{ width: '100%' }}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                            <th>Select</th>
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        // console.log('row: ',row)
                        return (
                            <tr {...row.getRowProps()}>
                                {/* <td>{i+1}</td> */}
                                {row.cells.map(cell => {
                                    return <td style={{ textAlign: 'center',fontSize:14 }} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                                <td style={{ textAlign: 'center',width:150 }}>
                                <Select
                                    // value={age}
                                    style={{width:'100%'}}
                                >
                                    {
                                        options.map(o => <MenuItem value={o.value}>{o.label}</MenuItem>)
                                    }
                                </Select>
                                </td>
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
            <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
            {/* {
                Object.keys(selectedRowIds).length > 0?
                <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid item lg={12} md={12} sm={12} xs={12} style={{ marginTop:20 }}>
                        <Button fullWidth variant="contained" color='primary' onClick={()=>handleUpload(selectedRowIds)} style={{color:'#fff',height:55}} >UPLOAD</Button>
                    </Grid>
                </Grid>
                :null
            } */}
        </div>
    )
}

const Assign = props => {

    const [modalVisible, setModalVisible] = React.useState(false)
    const [invoiceNumbers, setInvoiceNumbers] = React.useState([])
    const [colors, setColors] = React.useState([])
    const [styles, setStyles] = React.useState([])
    const [lots, setLots] = React.useState([])
    const [tableValues, setTableValues] = React.useState([])
    const [options, setOptions] = React.useState([{value:'abc',label:'ABC'},{value:'def',label:'DEF'},{value:'ghi',label:'GHI'}])
    const [state, setState] = React.useState({})
    const [loading, setLoading] = React.useState(false)

    const notify = message => props.enqueueSnackbar(message, {
        variant: 'info',
    })

    const fetchData = () => {
        try {
            fetch(api_endpoint_warehouse + '/fetch/getInvoices')
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    if (res.Invoices) {
                        setInvoiceNumbers(res.Invoices)
                    }
                })
                .catch(err => {
                    console.log('err in fetching', err)
                    //setTableValues([])
                })
        } catch (err) {
            console.log('try catch error: ', err)
        }
    }
    const fetchSelectList = () => {
        try {
            fetch(api_endpoint_warehouse + '/fetch/getInvoices')
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    // if (res.Invoices) {
                    //     setInvoiceNumbers(res.Invoices)
                    // }
                })
                .catch(err => {
                    console.log('err in fetching', err)
                    //setTableValues([])
                })
        } catch (err) {
            console.log('try catch error: ', err)
        }
    }
    const fetchPackingList = () => {
        try {
            fetch(api_endpoint_warehouse + `/fetch/getAllRollsStateForInvoiceID?invoiceID=${state.invoice.InvoiceID}`)
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    if (res.PackingList) {
                        filterResults(res.PackingList)
                    } else {
                        notify('Something went wrong!')
                    }
                })
                .catch(err => {
                    console.log('err in fetching', err)
                    //setTableValues([])
                })
        } catch (err) {
            console.log('try catch error: ', err)
        }
    }

    const filterResults = async (packinglist) => {
        let colors = []
        let styles = []
        let lots = []
        setTableValues(packinglist)
        await Promise.all(packinglist.map(p => {
            colors.push(p.ColorCode)
            styles.push(p.StyleCode)
            lots.push(p.LotCode)
        }))
        colors = [...new Set(colors)]
        lots = [...new Set(lots)]
        styles = [...new Set(styles)]
        setColors(colors)
        setStyles(styles)
        setLots(lots)
    }

    React.useEffect(() => {
        fetchData()
    }, [])


    React.useEffect(() => {
        if (state.invoice) {
            fetchPackingList()
        }
    }, [state.invoice])

    // React.useEffect(() => {
    //   filterLot()
    // }, [state.style])

    React.useEffect(() => {
        console.log('state:', state)
    }, [state.color])

    return (
        <div>
            <Grid container style={{ justifyContent: 'center', display: 'flex' }}>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                    <Autocomplete
                        options={invoiceNumbers}
                        getOptionLabel={option => option.InvoiceCode}
                        style={{ width: '100%' }}
                        onChange={(e, v) => {
                            if (v) {
                                setState({ ...state, invoice: v })
                            }
                        }}
                        renderInput={params => (
                            <TextField {...params} label="Invoice Code" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                    <Autocomplete
                        options={styles}
                        getOptionLabel={option => option}
                        style={{ width: '100%' }}
                        onChange={(e, v) => setState({ ...state, style: v })}
                        renderInput={params => (
                            <TextField {...params} label="Style Code" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                    <Autocomplete
                        options={lots}
                        getOptionLabel={option => option}
                        style={{ width: '100%' }}
                        onChange={(e, v) => setState({ ...state, lot: v })}
                        renderInput={params => (
                            <TextField {...params} label="Lot Code" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                    <Autocomplete
                        options={colors}
                        getOptionLabel={option => option}
                        style={{ width: '100%' }}
                        onChange={(e, v) => setState({ ...state, color: v })}
                        renderInput={params => (
                            <TextField {...params} label="Color Code" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                {/* <Grid item lg={2} md={2} sm={6} xs={6} style={{padding:5}}>
                  <Button variant="contained" fullWidth color='primary' style={{height:'100%'}} onClick={fetchRolls}>
                    {
                      loading===true?
                      <CircularProgress color={'#fff'}/>
                      :'Fetch'
                    }
                  </Button>
                </Grid>
                <Grid item lg={5} md={5} sm={6} xs={6} style={{padding:5}}>
                    <Autocomplete
                      options={departments}
                      getOptionLabel={option => option.FromLocation}
                      style={{ width: '100%' }}
                      onChange={(e, v) => setState({ ...state, department: v })}
                      renderInput={params => (
                          <TextField {...params} label="Departments" variant="outlined" fullWidth />
                      )}
                    />
                </Grid> */}
            </Grid>
            {
                tableValues.length === 0 ?
                    <div style={{ padding: 50, justifyContent: 'center', display: 'flex', color: 'grey' }}>
                        Nothing to display.
              </div>
                    :
                    <MyTable columns={[
                        {
                            Header: 'Buyer',
                            accessor: 'Buyer',
                        },
                        {
                            Header: 'Color',
                            accessor: 'ColorCode',
                        },
                        {
                            Header: 'Length',
                            accessor: 'CurrentLength',
                        },
                        // {
                        //     Header: 'Customer',
                        //     accessor: 'Customer',
                        // },
                        {
                            Header: 'Fabric Type',
                            accessor: 'FabricType',
                        },
                        // {
                        //     Header: 'From Location',
                        //     accessor: 'FromLocation',
                        // },
                        {
                            Header: 'Invoice',
                            accessor: 'InvoiceCode',
                        },
                        // {
                        //     Header: 'Item ID',
                        //     accessor: 'ItemID',
                        // },
                        {
                            Header: 'Lot',
                            accessor: 'LotCode',
                        },
                        {
                            Header: 'Roll',
                            accessor: 'RollCode',
                        },
                        // {
                        //     Header: 'Route',
                        //     accessor: 'RouteID',
                        // },
                        // {
                        //     Header: 'Season',
                        //     accessor: 'Season',
                        // },
                        // {
                        //     Header: 'State ID',
                        //     accessor: 'StateID',
                        // },
                        {
                            Header: 'Style',
                            accessor: 'StyleCode',
                        },
                        {
                            Header: 'Supplier',
                            accessor: 'Supplier',
                        },
                        // {
                        //     Header: 'Warehouse Status',
                        //     accessor: 'WarehouseStatus',
                        // },

                    ]} data={tableValues} options={options} />

            }
            {/* <Dialog
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
            </Dialog> */}

        </div>
    )
}

export default withSnackbar(Assign)