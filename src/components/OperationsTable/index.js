import React from 'react'
import { TextField, Grid, InputAdornment, Button, Typography, CircularProgress } from '@material-ui/core'
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
            label="Search Operation"
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
                }} style={{ cursor: 'pointer', marginRight: 15 }} /></td>
                
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

const OperationsTable = props => {

    const [searchText, setSearchText] = React.useState('')
    const [modalVisible, setModalVisible] = React.useState(false)
    const [modalValues, setModalValues] = React.useState(null)
    const [tableValues, setTableValues] = React.useState(null)
    const [editState,setEditState] = React.useState({})
    const [loading,setLoading] = React.useState(false)

    React.useEffect(()=>{
        console.log('modalValues',modalValues)
        setEditState(modalValues)
    },[modalValues])

    const handleUpdate = () => {
        console.log('editState',editState)
        //operation_id operation_code operation_description operation_smv
        try{
            let url = api_endpoint+`/Jordan/SPTS/operation/updateOperation.php?operation_id=${editState.operation_id}&operation_code=${editState.operation_code}&operation_description=${editState.operation_description}&operation_smv=${editState.operation_smv}&piece_rate=${editState.piece_rate}`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.Error_No===0){
                    props.enqueueSnackbar('Successfully Updated Operation!', { 
                        variant: 'info',
                    })
                    fetchOperations()
                    setModalVisible(false)
                }else{
                    if(typeof res.Error_Description==='object'){
                        console.log('objecttypeee')
                        props.enqueueSnackbar('Validation Errors!', { 
                            variant: 'info',
                        })
                    }else{
                        props.enqueueSnackbar(res.Error_Description, { 
                            variant: 'info',
                        })
                    }
                }
            })
            .catch(err => {
                console.log('error while fetching',err)
                setLoading(false)
                props.enqueueSnackbar('Error While Updating Operation!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Error While Updating Operation!', { 
                variant: 'info',
            })
        }
    }

    const fetchOperations = () => {
        try {
            fetch(api_endpoint + '/Jordan/SPTS/operation/getOperations.php')
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    setTableValues(res.Operations)
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
        fetchOperations()
    }, [])

    return (
        <div>
            {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Grid lg={6} md={6} sm={6} xs={6}>
                    <TextField
                        name='searchValue'
                        variant="outlined"
                        label="Search Operation"
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
                        editState ?
                            <>
                                <div style={{ textAlign: 'center', marginBottom: 15 }}><Typography variant="h6"> Edit Operation</Typography></div>
                                <Grid container>
                                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                                        <TextField name="operationCode" value={editState.operation_code} onChange={e => setEditState({...editState,operation_code:e.target.value})} variant="outlined" fullWidth label="Operation Code" />
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                                        <TextField name="operationDescription" value={editState.operation_description} onChange={e => setEditState({...editState,operation_description:e.target.value})} variant="outlined" fullWidth label="Operation Description" />
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                                        <TextField name="operationSMV" type="number" value={editState.operation_smv} onChange={e => setEditState({...editState,operation_smv:e.target.value})} variant="outlined" fullWidth label="Operation SMV" />
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                                        <TextField name="pieceRate" type="number" value={editState.piece_rate} onChange={e => setEditState({...editState,piece_rate:e.target.value})} variant="outlined" fullWidth label="Piece Rate" />
                                    </Grid>
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
                                Header: 'Operation ID',
                                accessor: 'operation_id',
                            },
                            {
                                Header: 'Operation Code',
                                accessor: 'operation_code',
                            },
                            {
                                Header: 'Description',
                                accessor: 'operation_description',
                            },
                            {
                                Header: 'SMV',
                                accessor: 'operation_smv',
                            },
                            {
                                Header: 'Piece Rate',
                                accessor: 'piece_rate',
                            },
                        ]} data={tableValues} tableValues={tableValues} setModalValues={setModalValues} setModalVisible={setModalVisible} />
                        // <table style={{ height: 400, overflowY: 'scroll' }}>
                        //     <tr>
                        //         <th>Operation Code</th>
                        //         <th>operation Description</th>
                        //         <th>Operation SMV</th>
                        //         <th>Piece Rate</th>
                        //         <th style={{ width: '70px' }}></th>
                        //     </tr>
                        //     <tbody>
                        //         {
                        //             tableValues.map(v => (
                        //                 <tr>
                        //                     <td>{v.operation_code}</td>
                        //                     <td>{v.operation_description}</td>
                        //                     <td>{v.operation_smv}</td>
                        //                     <td>{v.piece_rate}</td>
                        //                     <td style={{ textAlign: 'center' }}><EditIcon color='primary' onClick={() => {
                        //                         setModalVisible(true)
                        //                         setModalValues(v)
                        //                     }} style={{ cursor: 'pointer', marginRight: 15 }} /></td>
                        //                 </tr>
                        //             ))
                        //         }
                                
                        //     </tbody>
                        // </table>
                }
            </div>
        </div>
    )
}

export default withSnackbar(OperationsTable)