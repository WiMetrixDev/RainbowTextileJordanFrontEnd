import React from 'react'
import { TextField, Grid, InputAdornment, Button, Typography, CircularProgress, Backdrop } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import EditIcon from '@material-ui/icons/Edit'
import { Dialog } from '@material-ui/core'
//import './index.css'
import { api_endpoint,api_endpoint_warehouse } from '../../util/config'
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
                label="Search"
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
function MyTable({ columns, data, handleUpload }) {
    // Use the useTable hook to create your table configuration
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        previousPage,
        state: { pageIndex, pageSize, globalFilter, selectedRowIds },
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
        <div style={{ width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <div style={{ width: 400 }}>
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                </div>
            </div>
            <table {...getTableProps()} style={{ width: '100%' }}>
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
                                    return <td style={{ fontSize: 12 }} {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
            {
                Object.keys(selectedRowIds).length > 0 ?
                    <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
                        <Grid item lg={12} md={12} sm={12} xs={12} style={{ marginTop: 20 }}>
                            <Button fullWidth variant="contained" color='primary' onClick={() => handleUpload(selectedRowIds)} style={{ color: '#fff', height: 55 }} >UPLOAD</Button>
                        </Grid>
                    </Grid>
                    : null
            }
        </div>
    )
}

const AddRollIssuance = props => {

    const [searchText, setSearchText] = React.useState('')
    const [modalVisible, setModalVisible] = React.useState(false)
    const [openBackdrop, setOpenBackdrop] = React.useState(false)
    const [invoiceNumbers, setInvoiceNumbers] = React.useState([])
    const [departments, setDepartments] = React.useState([])
    //const [deleteLoader, setDeleteLoader] = React.useState(false)
    const [modalValues, setModalValues] = React.useState(null)
    const [tableValues, setTableValues] = React.useState([])
    // const [editState, setEditState] = React.useState({})
    const [state, setState] = React.useState({})
    const [loading, setLoading] = React.useState(false)

    // React.useEffect(() => {
    //     console.log('modalValues', modalValues)
    //     setEditState(modalValues)
    // }, [modalValues])

    const handleFetch = () => {

        console.log('state: ', state)
        console.log('tableValues: ', tableValues)
        setTableValues(null)
        // console.log(`/Jordan/Cutting/Marker/insertMarkerAndSizeMappings.php?style_code=${state.color.style_code}&color=${state.color.color}&marker_description=${state.marker_description}&no_of_plies=${state.no_of_plies}&size_mappings=${tableValues}`)
        setLoading(true)
        try {
            let url = api_endpoint_warehouse + `/fetch/getIssuanceRollsForInvoiceID?invoiceID=${state.invoice ? state.invoice.InvoiceID : ''}`;
            console.log('url', url)
            fetch(url, {
                method: 'get',
            })
                .then(res => res.json())
                .then(res => {
                    setLoading(false)
                    console.log('res: ', res)
                    if (res.Rolls) {
                        setTableValues(res.Rolls)
                    }
                })
                .catch(err => {
                    console.log('error while fetching', err)
                    setLoading(false)
                    props.enqueueSnackbar('Failed to Fetch Packing List!', {
                        variant: 'info',
                    })
                })
        } catch (err) {
            console.log('err in try catch', err)
            setLoading(false)
            props.enqueueSnackbar('Failed to Fetch Packing List!', {
                variant: 'info',
            })
        }

    }

    const handleUpload = async (args) => {
        if (state.department) {
            console.log('args', args, Object.keys(args), state.department.RouteID)
            let keysArray = Object.keys(args)
            let rolls = []
            setLoading(true)
            for (let i = 0; i < keysArray.length; i++) {
                rolls.push({
                    ItemID: tableValues[parseInt(keysArray[i])].ItemID,
                    RollLength: tableValues[parseInt(keysArray[i])].RollLength
                })
            }
            console.log('rolls', rolls)
            let obj = {
                itemIDArray: rolls,
                intentionRouteID: state.department.RouteID
            }
            console.log('obj ---> ', obj)
            try {
                let url = api_endpoint + `/Jordan/Warehouse/Issuance/insertDepartmentMovement.php`
                //invoice_no=${state.invoice?state.invoice.invoice_code:''}
                console.log('url', url)
                fetch(url, {
                    method: 'post',
                    body: JSON.stringify(obj)
                })
                    .then(res => res.json())
                    .then(async res => {
                        setLoading(false)
                        console.log('response Roll Insertion: ', res)
                        if (res.Error_No === 0) {
                            props.enqueueSnackbar('Roll Intention Inserted successfully!', {
                                variant: 'info',
                            })
                            let keys = []
                            if (res.Responses && res.Responses.length > 0) {
                                setModalValues(res.Responses)
                                setModalVisible(true)
                            }
                            // await Promise.all(keysArray.map(kI => keys.push(tableValues[parseInt(kI)].item_id)))
                            // console.log('keys => ',keys)
                            // let tempTableValues = tableValues
                            // for(let i=0;i<keys.length;i++){
                            //     tempTableValues = tempTableValues.filter(tV => tV.item_id === keys[i])
                            //     // tableValues[parseInt(keysArray[i])].item_id
                            // }
                            setTableValues([])

                        } else {
                            props.enqueueSnackbar('Failed to Insert roll!', {
                                variant: 'info',
                            })
                        }
                        // if(res.Packing_List){
                        //     setTableValues(res.Packing_List)
                        // }
                    })
                    .catch(err => {
                        console.log('error while fetching', err)
                        setLoading(false)
                        props.enqueueSnackbar('Failed to Insert roll!', {
                            variant: 'info',
                        })
                    })
            } catch (err) {
                console.log('err in try catch', err)
                setLoading(false)
                props.enqueueSnackbar('Failed to Insert roll!', {
                    variant: 'info',
                })
            }
        } else {
            props.enqueueSnackbar('Select Department First!', {
                variant: 'info',
            })
        }



    }

    const fetchInvoiceNumbers = () => {
        try {
            fetch(api_endpoint_warehouse + '/fetch/getIssuanceInvoices')
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
            //setTableValues([])
        }
        try {
            fetch(api_endpoint_warehouse + '/fetch/getRoutesForStockingOut')
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    if (res.Routes) {
                        setDepartments(res.Routes)
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
                onBackdropClick={() => setModalVisible(false)}
            >
                <div style={{ padding: 20, width: 480 }}>
                    {
                        modalValues && modalValues.length > 0 ?
                            <div style={{ width: '100%', textAlign: 'center', position: 'relative' }}>
                                <CloseIcon color={'lightgrey'} size={25} style={{ position: 'absolute', top: 5, right: 5, cursor: 'pointer' }} onClick={() => setModalVisible(false)} />
                                <Typography variant="h6" color='primary' style={{ textAlign: 'center' }}>
                                    Issuance Summary
                            </Typography>
                                <table style={{ width: '100%', marginTop: 15 }}>
                                    <thead>
                                        <tr>
                                            <th style={{ fontSize: 13 }}>Roll Rfid</th>
                                            <th style={{ fontSize: 13 }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            modalValues.map(mV => (
                                                <tr>
                                                    <td style={{ fontSize: 12 }}>{mV.item_id}</td>
                                                    <td style={{ fontSize: 12 }}>{mV.Error_Description}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            : 'Nothing to Display'
                    }
                </div>
            </Dialog>

            <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
                <Grid item lg={4} md={4} sm={5} xs={5} style={{ padding: 5 }}>
                    <Autocomplete
                        //id="combo-box-demo"
                        options={invoiceNumbers}
                        getOptionLabel={option => option.InvoiceCode}
                        style={{ width: '100%' }}
                        onChange={(e, v) => setState({ ...state, invoice: v })}
                        renderInput={params => (
                            <TextField {...params} label="Invoice" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                <Grid item lg={2} md={2} sm={2} xs={2} style={{ padding: 5 }}>
                    <Button fullWidth variant="contained" color='primary' onClick={handleFetch} style={{ color: '#fff', height: '100%' }} >
                        {
                            loading === true ?
                                <CircularProgress color={'#fff'} />
                                :
                                `Fetch`
                        }
                    </Button>
                </Grid>
                <Grid item lg={4} md={4} sm={5} xs={5} style={{ padding: 5 }}>
                    <Autocomplete
                        //id="combo-box-demo"
                        options={departments}
                        getOptionLabel={option => option.ToLocation}
                        style={{ width: '100%' }}
                        onChange={(e, v) => setState({ ...state, department: v })}
                        renderInput={params => (
                            <TextField {...params} label="Departments" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
            </Grid>
            <Grid container style={{ display: 'flex', justifyContent: 'center' }}>

                {
                    // tableValues === null ?
                    // <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
                    //     <CircularProgress color='primary' />
                    // </div>
                    // :
                    tableValues === null || tableValues.length === 0 ?
                        null
                        :
                        <MyTable columns={[
                            {
                                Header: 'Rfid',
                                accessor: 'TagID',
                            },
                            // {
                            //     Header: 'ID',
                            //     accessor: 'ItemID',
                            // },
                            {
                                Header: 'Supplier',
                                accessor: 'Supplier',
                            },
                            // {
                            //     Header: 'Buyer',
                            //     accessor: 'Buyer',
                            // },
                            {
                                Header: 'Style',
                                accessor: 'StyleCode',
                            },
                            {
                                Header: 'Color',
                                accessor: 'ColorCode',
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
                        ]} data={tableValues} tableValues={tableValues} handleUpload={handleUpload}
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

export default withSnackbar(AddRollIssuance)