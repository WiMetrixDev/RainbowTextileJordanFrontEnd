import React from 'react'
import { Grid, TextField, Button, CircularProgress } from '@material-ui/core'
import { api_endpoint } from '../../util/config'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withSnackbar } from 'notistack'; 
import { Dialog } from '@material-ui/core'
import uuid from 'uuid/v4'
import DeleteIcon from '@material-ui/icons/Delete'


const EditPO = props => {

    const [state,setState] = React.useState({})
    const [loading,setLoading] = React.useState(false)
    const [somethingChanged, setSomethingChanged] = React.useState(false)
    const [sizes,setSizes] = React.useState([])
    const [styles,setStyles] = React.useState([])
    const [colors,setColors] = React.useState([])
    const [modalVisible, setModalVisible] = React.useState(false)
    const [deleteRow, setDeleteRow] = React.useState (false)
    const [modalValues, setModalValues] = React.useState()
    const [pos,setPOS] = React.useState([])
    const [tableValues,setTableValues] = React.useState([])
    const [deparments,setDepartments] = React.useState([])

    React.useEffect(()=>{
        console.log('state',state)
        if(state.po){
            fetch(api_endpoint+`/Jordan/Cutting/PO/getPOdetailForPO.php?po_code=${state.po}`)
            .then(res => res.json()
            .then(res => {
                setTableValues(res.poDetail);
            }))
            .catch(err => {
                console.log('err in fetch',err)
            })
            fetch(api_endpoint+`/Jordan/Cutting/PO/getPOId.php?po_code=${state.po}`)
            .then(res => res.json()
            .then(res => {
                setState({...state,poid:res.POID.po_id})
            }))
            .catch(err => {
                console.log('err in fetch',err)
            })
        }
        
    },[state.po, deleteRow])

    React.useEffect(()=>{
        //http://192.168.88.237/Jordan/Cutting/Marker/getSizes.php
        console.log('state',state)
        if(state.style){
            fetch(api_endpoint+`/Jordan/SPTS/order/getColorsForStyleCode.php?style_code=${state.style}`)
            .then(res => res.json()
            .then(res => {
                console.log('res colors',res)
                setColors(res.Colors)
            }))
            .catch(err => {
                console.log('err in fetch',err)
            })

        }
    },[state.style])

    React.useEffect(()=>{
        
        fetch(api_endpoint+'/Jordan/Cutting/PO/getPOlist.php')
        .then(res => res.json()
        .then(res => {
            console.log('res pos',res)
            setPOS(res.PO)
        }))
        .catch(err => {
            console.log('err in fetch',err)
        })
        fetch(api_endpoint+'/Jordan/Cutting/Marker/getSizes.php')
        .then(res => res.json()
        .then(res => {
            console.log('res sized',res)
            setSizes(res.Sizes)
        }))
        .catch(err => {
            console.log('err in fetch',err)
        })
        fetch(api_endpoint+'/Jordan/SPTS/order/getStyleCodes.php')
        .then(res => res.json()
        .then(res => {
            console.log('res styles',res)
            setStyles(res.Styles)
        }))
        .catch(err => {
            console.log('err in fetch',err)
        })

    },[])

    const handleDelete = (v) => {
        console.log('state: ',state)
        setLoading(true)
        setDeleteRow(true)
        try{
            let url = api_endpoint+`/Jordan/Cutting/PO/deletePO.php?po_id=${state.poid}&quantity=${v.quantity}&size=${v.size_code}`;
            console.log('url',url)
            fetch(url,{
                method: 'delete',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.Error_No === 0){
                    props.enqueueSnackbar('Successfully Deleted PO!', { 
                        variant: 'info',
                    })
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
                props.enqueueSnackbar('Error While Deleting PO!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Error While Deleting PO!', { 
                variant: 'info',
            })
        }

    }
    
    const handleUpdate = async (style,size,color,quantity,psize) => {
        try{
            console.log('Style : ',style);
            console.log('Color : ',color);
            console.log('Size : ',size);
            let url = api_endpoint+`/Jordan/Cutting/PO/updatePO.php?po_id=${state.poid}&style=${style}&color=${color}&size=${size}&quantity=${quantity}&pSize=${psize}`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.Error_No === 0){
                    props.enqueueSnackbar('Successfully Updated PO!', { 
                        variant: 'info',
                    })
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
                props.enqueueSnackbar('Error While Updating PO!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Error While Updating PO!', { 
                variant: 'info',
            })
        }
    }

    const handleUpdatePOCode = async (id,code) => {
        setLoading(true)
        try{
            let url = api_endpoint+`/Jordan/Cutting/PO/updatePOCode.php?po_id=${id}&po_code=${code}`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.Error_No === 0){
                    props.enqueueSnackbar('Successfully Updated PO Code ..!', { 
                        variant: 'info',
                    })
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
                props.enqueueSnackbar('Error While Updating PO Code ..!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Error While Updating PO Code ..!', { 
                variant: 'info',
            })
        }
    }

    return (
        <div>
            <Dialog
                open={modalVisible}
            >
                <div style={{ padding: 20, width: 500 }}>
                    <div style={{padding:10}}>
                        <h3>Update The Following Information For PO</h3>
                    </div>
                    {
                        modalValues?
                        <Grid container style={{padding:10}}>
                            {
                                console.log('modalValues ====> ',modalValues)
                                //console.log(modalValues.size_code)
                            }
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <Autocomplete
                            //id="combo-box-demo"
                            options={styles}
                            getOptionLabel={option => option.style_code}
                            style={{ width: '100%' }}
                            defaultValue={()=>styles.filter(s => s.style_code===modalValues.style)[0]}
                            onChange={(e,v) => setState({...state,style:v.style_code})}
                            renderInput={params => (
                                <TextField {...params} label="Style" variant="outlined" fullWidth />
                            )}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <Autocomplete
                            //id="combo-box-demo"
                            options={colors}
                            getOptionLabel={option => option.color}
                            style={{ width: '100%' }}
                            defaultValue={()=>colors.filter(c => c.color===modalValues.color)[0]}
                            onChange={(e,v) => setState({...state,color:v.color})}
                            renderInput={params => (
                                <TextField {...params} label="Color" variant="outlined" fullWidth />
                            )}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <Autocomplete
                            //id="combo-box-demo"
                            options={sizes}
                            getOptionLabel={option => option.size_code}
                            style={{ width: '100%' }}
                            defaultValue={()=>sizes.filter(o => o.size_code===modalValues.size_code)[0]}
                            onChange={(e,v) => setState({...state,size:v.size_code})}
                            renderInput={params => (
                                <TextField {...params} label="Size" variant="outlined" fullWidth />
                            )}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <div style={{padding:10}}>
                                <TextField name='quantity' variant="outlined" label="Quantity" value={modalValues.quantity} onChange={e=>setModalValues({...modalValues,quantity:e.target.value})} fullWidth />
                            </div>
                        </Grid>
                    </Grid>
                    :null
                    }
                    <div style={{display:'flex',justifyContent:'center'}}>
                        <Button color='primary' fullWidth onClick={()=>handleUpdate(state.style,state.size,state.color,modalValues.quantity,modalValues.size_code)} variant="contained" style={{margin:10,color:'#fff',height:55}}>
                            {
                                loading === true?
                                <CircularProgress color={'#fff'}/>
                                :
                                `Update`
                            }
                        </Button>
                        <Button color='primary' fullWidth onClick={()=>setModalVisible(false)} variant="contained" style={{margin:10,color:'#fff',height:55}}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Dialog>
            <Grid container>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5, display:'flex' , justifyContent:'center'}}>
                    <Autocomplete
                        options={pos}
                        getOptionLabel={option => option.po_code}
                        onChange={(e,v) => setState({...state,po:v.po_code})}
                        style={{ width: '50%' }}
                        renderInput={params => (
                            <TextField {...params} label="Search PO" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{width: '50%', padding: 5, display:'flex' , justifyContent:'center'}}>
                    <TextField name='RenamePO' type='text' variant="outlined" value={state.po} onChange={e=>setState({...state,po:e.target.value})} fullWidth />
                    <Button color='primary' onClick={()=> handleUpdatePOCode(state.poid,state.po)} variant="contained" style={{margin:10, color:'#fff'}}>Update</Button>
                </Grid>
            </Grid>
            <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {
                    tableValues === null ?
                        <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress color='primary' />
                        </div>
                        :
                        <table style={{overflowY: 'scroll' }}>
                            <tr>
                                <th style={{textAlign:'center'}}>Style</th>
                                <th style={{textAlign:'center'}}>Color</th>
                                <th style={{textAlign:'center'}}>Size</th>
                                <th style={{textAlign:'center'}}>Quantity</th>
                                <th style={{textAlign:'center'}}>Actions</th>
                            </tr>
                            <tbody>
                                {
                                    tableValues && tableValues.map((v,i) => (
                                        <tr>
                                            <td style={{textAlign:'center'}}>{v.style}</td>
                                            <td style={{textAlign:'center'}}>{v.color}</td>
                                            <td style={{textAlign:'center'}}>{v.size_code}</td>
                                            <td style={{textAlign:'center'}}>{v.quantity}</td>
                                            <td style={{textAlign:'center'}}>
                                                <Button color='primary' onClick={()=>{
                                                    setModalVisible(true)
                                                    setModalValues(v)}} variant="contained" style={{margin:10, color:'#fff'}}>
                                                    Update
                                                </Button>
                                                <Button variant="contained" onClick={()=>handleDelete(v)} style={{margin:10, backgroundColor:'#FF0000', color:'#fff'}}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                }
                                
                            </tbody>
                        </table>
                }
            </div>
        </div>
        </div>
    )
}

export default withSnackbar(EditPO)