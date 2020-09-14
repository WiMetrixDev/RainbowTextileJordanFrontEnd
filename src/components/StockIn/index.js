import React from 'react'
import { TextField, Grid, InputAdornment, Button, Typography, CircularProgress, Backdrop } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { Dialog } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
//import './index.css'
import { api_endpoint, api_endpoint_warehouse } from '../../util/config'
import { withSnackbar } from 'notistack'
import { useTable, usePagination, useGlobalFilter,useRowSelect } from 'react-table'

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

function MyTable({ columns, data, handleUpload }) {
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
      },useGlobalFilter,usePagination,useRowSelect,
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
        <div >
            <div style={{display:'flex',justifyContent:'center',marginTop:20}}>
              <div style={{width:300}}>
                  <GlobalFilter
                      preGlobalFilteredRows={preGlobalFilteredRows}
                      globalFilter={globalFilter}
                      setGlobalFilter={setGlobalFilter}
                  />
              </div>
            </div>
            <table {...getTableProps()} style={{width:'100%'}}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
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
                    return <td style={{textAlign:'center'}} {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
            {
                Object.keys(selectedRowIds).length > 0?
                <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid item lg={12} md={12} sm={12} xs={12} style={{ marginTop:20 }}>
                        <Button fullWidth variant="contained" color='primary' onClick={()=>handleUpload(selectedRowIds)} style={{color:'#fff',height:55}} >UPLOAD</Button>
                    </Grid>
                </Grid>
                :null
            }
        </div>
    )
}

const StockIn = props => {

    // const [searchText, setSearchText] = React.useState('')
    const [modalVisible, setModalVisible] = React.useState(false)
    // const [openBackdrop, setOpenBackdrop] = React.useState(false)
    // const [deleteLoader, setDeleteLoader] = React.useState(false)
    const [invoiceCodes, setInvoiceCodes] = React.useState([])
    const [rolls, setRolls] = React.useState([])
    const [departments, setDepartments] = React.useState([])
    const [tableValues, setTableValues] = React.useState([])
    const [state, setState] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    
    const notify = message => props.enqueueSnackbar(message, { 
      variant: 'info',
    })

    const fetchRolls = () => {
      setLoading(true)
      try {
        let url = api_endpoint_warehouse+`/fetch/getRollsForInvoiceIDOperation?operation=In&invoiceID=${state.invoice?state.invoice.InvoiceID:''}`;
        console.log('url',url)
        fetch(url,{
            method: 'get',
        })
        .then(res => res.json())
        .then(res => {
            console.log('--->',res)
            if(res.Rolls){
              setRolls(res.Rolls)
            }
            setLoading(false)
          })
          .catch(err => {
            setLoading(false)
            console.log('err in fetching', err)
            // setTableValues([])
          })
      } catch (err) {
          setLoading(false)
          console.log('try catch error: ', err)
          // setTableValues([])
      }
    }
    const handleRollIntention = async (array) => {


      if(!state.department){
        notify('Select a department first')
        return
      }

      setLoading(true)
      console.log('array: ',array,', rolls: ',rolls,state)
      let keysArray = Object.keys(array)
      let error = false
      let arr = []
      for(let i=0; i<keysArray.length;i++){
        console.log(rolls[parseInt(keysArray[i])].ItemID)
        arr.push(rolls[parseInt(keysArray[i])].ItemID)
      }
      console.log(arr)
        try {
          let url = api_endpoint_warehouse+`/update/makeStockInOutForRolls`;
          console.log('url',url)
          fetch(url,{
              method: 'put',
              headers:{
                'Content-Type':'application/json'
              },
              body:JSON.stringify({warehouseStatus:'stockedIn',routeID:state.department.RouteID,itemIDArray:arr})
          })
          .then(res => res.json())
          .then(res => {
            setLoading(false)
            if(res.ErrorNumber===0){
              notify('Successfull')
            }else{
              notify('Something went wrong')
            }
              console.log('roll intetntion insertion response -----> ',res)
            })
            .catch(err => {
              notify('Something went wrong')
              console.log('err in fetching', err)
              setLoading(false)
            })
        } catch (err) {
            notify('Something went wrong')
            console.log('try catch error: ', err)
            setLoading(false)
        }

    }

    const fetchInvoiceCodes = () => {
        try {
            fetch(api_endpoint_warehouse + '/fetch/getInvoicesForOperation?operation=In')
                .then(res => res.json())
                .then(res => {
                    console.log('=> ',res)
                    if(res.Invoices){
                      setInvoiceCodes(res.Invoices)
                    }
                })
                .catch(err => {
                    console.log('err in fetching', err)
                    // setTableValues([])
                })
        } catch (err) {
            console.log('try catch error: ', err)
            // setTableValues([])
        }
    }
    const fetchDepartments = () => {
      try {
        fetch(api_endpoint_warehouse + '/fetch/getRoutesForStockingIn')
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
      fetchInvoiceCodes()
      fetchDepartments()
    }, [])

    return (
        <div>
            <Grid container style={{justifyContent:'center',display:'flex'}}>
                <Grid item lg={5} md={5} sm={6} xs={6} style={{padding:5}}>
                    {/* <TextField name="roll" value={state.roll} onChange={e => setState({ ...state, roll: e.target.value })} variant="outlined" fullWidth label="Roll" /> */}
                    <Autocomplete
                      options={invoiceCodes}
                      getOptionLabel={option=>option.InvoiceCode}
                      style={{ width: '100%' }}
                      onChange={(e, v) => setState({ ...state, invoice: v })}
                      renderInput={params => (
                          <TextField {...params} label="Invoice Codes" variant="outlined" fullWidth />
                      )}
                    />
                </Grid>
                <Grid item lg={2} md={2} sm={6} xs={6} style={{padding:5}}>
                  <Button variant="contained" fullWidth color='primary' style={{height:'100%'}} onClick={fetchRolls}>
                    {
                      loading===true?
                      <CircularProgress color={'#fff'}/>
                      :'Fetch'
                    }
                  </Button>
                </Grid>
                <Grid item lg={5} md={5} sm={6} xs={6} style={{padding:5}}>
                    {/* <TextField name="roll" value={state.roll} onChange={e => setState({ ...state, roll: e.target.value })} variant="outlined" fullWidth label="Roll" /> */}
                    <Autocomplete
                      options={departments}
                      getOptionLabel={option => option.Location}
                      style={{ width: '100%' }}
                      onChange={(e, v) => setState({ ...state, department: v })}
                      renderInput={params => (
                          <TextField {...params} label="Departments" variant="outlined" fullWidth />
                      )}
                    />
                </Grid>
            </Grid>
            {
              rolls.length===0?
              <div style={{padding:50,justifyContent:'center',display:'flex',color:'grey'}}>
                Nothing to display.
              </div>
              :
              <MyTable columns={[
                  {
                      Header: 'RFID',
                      accessor: 'TagID',
                  },
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
                  
              ]} data={rolls} handleUpload={handleRollIntention} />

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

export default withSnackbar(StockIn)