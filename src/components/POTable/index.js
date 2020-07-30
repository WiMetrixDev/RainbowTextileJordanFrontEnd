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

const POTable = props => {

    const [searchText, setSearchText] = React.useState('')
    // const [designations,setDesignations] = React.useState([])
    const [sizes,setSizes] = React.useState([])
    // const [deparments,setDepartments] = React.useState([])
    const [modalVisible, setModalVisible] = React.useState(false)
    const [modalValues, setModalValues] = React.useState(null)
    const [tableValues, setTableValues] = React.useState(null)
    const [editState,setEditState] = React.useState({})
    const [loading,setLoading] = React.useState(false)

    // React.useEffect(()=>{
    //     console.log('modalValues',modalValues)
    //     setEditState(modalValues)
    // },[modalValues])
    React.useEffect(()=>{
        console.log('modalValues',modalValues)
        setLoading(true)
        setEditState(modalValues)
        if(modalValues){

            try{
                let url = api_endpoint+`/Jordan/Cutting/PO/getSizesForPO.php?PO_id=${modalValues.po_id}`;
                console.log('url',url)
                fetch(url,{
                    method: 'post',
                })
                .then(res => res.json())
                .then(res => {
                    console.log('res: ',res)
                    setSizes(res.Sizes)
                    setLoading(false)
                })
                .catch(err => {
                    console.log('error while fetching',err)
                    setLoading(false)
                    props.enqueueSnackbar('Error While Getting Styles!', { 
                        variant: 'info',
                    })
                })
            }catch(err){
                console.log('err in try catch',err)
                setLoading(false)
                props.enqueueSnackbar('Error While Fetching Styles!', { 
                    variant: 'info',
                })
            }
        }
    },[modalValues])

    const fetchMarkers = () => {

        try {
            fetch(api_endpoint + '/Jordan/Cutting/PO/getPO.php')
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    setTableValues(res.PO)
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
            
            <Dialog
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
            </Dialog>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {
                    tableValues === null ?
                        <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress color='primary' />
                        </div>
                        :
                        <table style={{overflowY: 'scroll' }}>
                            <tr>
                                <th style={{ width: '40px' }}></th>
                                <th>PO</th>
                                <th style={{ width: '40px' }}></th>
                            </tr>
                            <tbody>
                                {
                                    tableValues && tableValues.map((v,i) => (
                                        <tr>
                                            <td>{i+1}</td>
                                            <td style={{textAlign:'center'}}>{v.po_code}</td>
                                            <td style={{ textAlign: 'center' }}>
                                            <InfoIcon color='primary' onClick={() => {
                                                setModalVisible(true)
                                                setModalValues(v)
                                            }} style={{ cursor: 'pointer', marginRight: 15 }} />
                                                {/* <DeleteIcon color='primary' style={{ cursor: 'pointer' }} /> */}
                                                </td>
                                        </tr>
                                    ))
                                }
                                
                            </tbody>
                        </table>
                }
            </div>
        </div>
    )
}

export default withSnackbar(POTable)