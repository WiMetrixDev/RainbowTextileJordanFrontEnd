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
    //const count = preGlobalFilteredRows.length
  
    return (
      <span>
        <TextField
            name='searchValue'
            variant="outlined"
            label="Search"
            style={{marginTop:30}}
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

function MyTable({ columns, data,handleDelete }) {
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
                <td style={{ textAlign: 'center' }}>
                    <DeleteIcon color='primary' style={{ cursor: 'pointer' }} onClick={() => handleDelete(row.original)} />
                </td>
                
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

const CutReportTable = props => {

    // const [searchText, setSearchText] = React.useState('')
    // const [designations,setDesignations] = React.useState([])
    const [styles, setStyles] = React.useState([])
    const [count, setCount] = React.useState(null)
    const [colors, setColors] = React.useState([])
    // const [deparments,setDepartments] = React.useState([])
    const [modalVisible, setModalVisible] = React.useState(false)
    const [state, setState] = React.useState({})
    const [tableValues, setTableValues] = React.useState(null)
    // const [editState,setEditState] = React.useState({})
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {

        if (state.style) {
            try {
                fetch(api_endpoint + `/Jordan/SPTS/order/getColorsForStyleCode.php?style_code=${state.style.style_code}`)
                    .then(res => res.json())
                    .then(res => {
                        console.log(res)
                        setColors(res.Colors)
                    })
                    .catch(err => {
                        console.log('err in fetching', err)
                        setColors([])
                    })
            } catch (err) {
                console.log('try catch error: ', err)
                setColors([])
            }
        }


    }, [state.style])


    const handleFetch = () => {
        setCount(null)
        console.log('Stat', state)
        setLoading(true)
        let url = api_endpoint + `/Jordan/SPTS/cutReport/getCutReportForOrder.php?order_id=${state.color.order_id}`;
        console.log('url', url)
        try {
            fetch(url)
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    if (res.Cut_Report) {
                        setTableValues(res.Cut_Report)
                        setCount(res.Cut_Report.length)
                        setLoading(false)
                    } else {
                        setTableValues([])
                        setLoading(false)
                    }
                })
                .catch(err => {
                    console.log('err in fetching', err)
                    setTableValues([])
                    setLoading(false)
                })
        } catch (err) {
            console.log('try catch error: ', err)
            setTableValues([])
            setLoading(false)
        }
    }

    React.useEffect(() => {
        try {
            //fetch(api_endpoint + '/Jordan/SPTS/style/getUploadedStyleCodes.php')
            fetch(api_endpoint + '/Jordan/SPTS/order/getStyleCodes.php')
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    setStyles(res.Styles)
                })
                .catch(err => {
                    console.log('err in fetching', err)
                    setStyles([])
                })
        } catch (err) {
            console.log('try catch error: ', err)
            setStyles([])
        }
        //fetchMarkers()

    }, [])

    const handleDelete = (record) => {
        console.log('record: ', record)
        alert('In progress!')
        // let url = api_endpoint + `/Jordan/SPTS/cutReport/deleteBundles.php?bundle_ids=${record.bundle_id}`;
        // console.log('url',url)
        // try {
        //     fetch(url,{
        //         method:'post'
        //     })
        //         .then(res => res.json())
        //         .then(res => {
        //             console.log(res)
        //             if(res.Cut_Report){
        //                 setTableValues(res.Cut_Report)
        //                 setLoading(false)
        //             }else{
        //                 setTableValues([])
        //                 setLoading(false)
        //             }
        //         })
        //         .catch(err => {
        //             console.log('err in fetching', err)
        //             setTableValues([])
        //             setLoading(false)
        //         })
        //     } catch (err) {
        //         console.log('try catch error: ', err)
        //         setTableValues([])
        //         setLoading(false)
        // }


    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Grid lg={5} md={5} sm={5} xs={5} style={{ padding: 5 }}>
                    <Autocomplete
                        //id="combo-box-demo"
                        options={styles}
                        getOptionLabel={option => option.style_code}
                        style={{ width: '100%' }}
                        onChange={(e, v) => setState({ ...state, style: v })}
                        renderInput={params => (
                            <TextField {...params} label="Style" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                <Grid lg={5} md={5} sm={5} xs={5} style={{ padding: 5 }}>
                    <Autocomplete
                        //id="combo-box-demo"
                        options={colors}
                        getOptionLabel={option => option.color}
                        style={{ width: '100%' }}
                        onChange={(e, v) => setState({ ...state, color: v })}
                        renderInput={params => (
                            <TextField {...params} label="Color" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                <Grid lg={2} md={2} sm={2} xs={2} style={{ padding: 5 }}>
                    <Button variant="contained" color='primary' style={{ width: '100%', height: 55, color: '#fff' }} onClick={handleFetch}>
                        {
                            loading===true?
                            <CircularProgress color={'#fff'}/>
                            :`Fetch`
                        }
                    </Button>
                </Grid>
                {/* <Grid lg={6} md={6} sm={6} xs={6}>
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
                </Grid> */}
            </div>
            {/* <Dialog
                open={modalVisible}
            >
                <div style={{ padding: 20, width: 480 }}>
                    {
                        modalVisible ?
                            <>
                                <div style={{ textAlign: 'center', marginBottom: 15 }}><Typography variant="h6"> Styles</Typography></div>
                                {
                                    loading === true?
                                    <div style={{padding:20,justifyContent:'center',display:'flex'}}>
                                        <CircularProgress color='primary'/>
                                    </div>
                                    :
                                    <div container style={{textAlign:'center'}}>
                                        {
                                            sizes && sizes.map(s => (<p>Size: {s.size_code}, Quantity: {s.quantity}</p>))
                                        }
                                    </div>
                                }
                                <Grid container style={{display:'flex',justifyContent:'center'}}>
                                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                                        <Button color='primary' variant='contained' style={{ color: '#fff', height: '50px' }} fullWidth onClick={() => setModalVisible(false)}>Okay</Button>
                                    </Grid>
                                </Grid>
                            </>
                            : null
                    }
                </div>
            </Dialog> */}
            {
                tableValues === null ?
                    null
                    :
                    <>
                    {
                        count !== null?
                        <Grid lg={12} md={12} sm={12} xs={12} style={{paddingTop:15,marginTop:15}}>
                            <Typography variant="subtitle" color='primary' style={{display:'flex',justifyContent:'center',fontWeight:'600'}}>
                                No Of Cuts: {count}
                            </Typography>

                        </Grid>
                        :null
                    }
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {
                            loading === true ?
                                <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress color='primary' />
                                </div>
                                :
                                 <MyTable columns={[
                                        {
                                            Header: 'Cut',
                                            accessor: 'cut_code',
                                        },
                                        {
                                            Header: 'Bundle',
                                            accessor: 'bundle_code',
                                        },
                                        {
                                            Header: 'Piece Size',
                                            accessor: 'piece_size',
                                        },
                                        {
                                            Header: 'Color',
                                            accessor: 'color',
                                        },
                                        {
                                            Header: 'Qty',
                                            accessor: 'quantity',
                                        },
                                        {
                                            Header: 'Pay Order',
                                            accessor: 'pay_order_code',
                                        },
                                        {
                                            Header: 'Seq Start',
                                            accessor: 'seq_start',
                                        },
                                        {
                                            Header: 'Seq End',
                                            accessor: 'seq_end',
                                        },
                                        {
                                            Header: 'Part Name',
                                            accessor: 'part_name',
                                        },
                                        {
                                            Header: 'Remarks',
                                            accessor: 'remarks',
                                        },
                                    ]} data={tableValues} tableValues={tableValues} handleDelete={handleDelete} />

                                // <table style={{ height: 400, overflowY: 'scroll' }}>
                                //     <tr>
                                //         {/* <th style={{ width: '40px' }}></th> */}
                                //         <th>OTN</th>
                                //         <th>Cut</th>
                                //         <th>Bundle</th>
                                //         <th>Piece Size</th>
                                //         <th>Color</th>
                                //         <th>Quantity</th>
                                //         <th>Seq Start</th>
                                //         <th>Seq End</th>
                                //         <th>Part Name</th>
                                //         <th style={{ width: '40px' }}></th>
                                //         {/* <th style={{ width: '70px' }}></th> */}
                                //     </tr>
                                //     <tbody>
                                //         {
                                //             tableValues && tableValues.map((v, i) => (
                                //                 <tr>
                                //                     <td>{v.otn}</td>
                                //                     <td>{v.cut_code}</td>
                                //                     <td>{v.bundle_code}</td>
                                //                     <td>{v.piece_size}</td>
                                //                     <td>{v.color}</td>
                                //                     <td>{v.quantity}</td>
                                //                     <td>{v.seq_start}</td>
                                //                     <td>{v.seq_end}</td>
                                //                     <td>{v.part_name}</td>
                                                    
                                //                 </tr>
                                //             ))
                                //         }

                                //     </tbody>
                                // </table>
                        }
                    </div>
                    </>

            }
        </div>
    )
}

export default withSnackbar(CutReportTable)