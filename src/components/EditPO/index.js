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
    const [sizeID,setSizeID] = React.useState([])
    const [sizes,setSizes] = React.useState([])
    const [selectivesizes,setSelectiveSizes] = React.useState([])
    const [styles,setStyles] = React.useState([])
    const [colors,setColors] = React.useState([])
    const [modalVisible, setModalVisible] = React.useState(false)
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
                console.log('PO res', res)
                setState({...state,poid:res.POID.po_id})
            }))
            .catch(err => {
                console.log('err in fetch',err)
            })
        }
        
    },[state.po,state.delete,state.update,state.add])

    React.useEffect(()=>{
        if(state.newsize){
            fetch(api_endpoint+`/Jordan/Cutting/PO/getSizeID.php?size_code=${state.newsize}`)
            .then(res => res.json()
            .then(res => {
                console.log('res size ID', res)
                setState({...state,sizeid:res.SIZEID.size_id})
            }))
            .catch(err => {
                console.log('err in fetch',err)
            })

        }
    },[state.newsize])

    React.useEffect(()=>{
        if(state.po){
            fetch(api_endpoint+`/Jordan/Cutting/PO/getSelectiveSizes.php?po_code=${state.po}`)
            .then(res => res.json()
            .then(res => {
                console.log('res New Sizes',res)
                setSelectiveSizes(res.Sizes)
            }))
            .catch(err => {
                console.log('err in fetch',err)
            })
        }
    },[state.po,state.add])

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
        try{
            let url = api_endpoint+`/Jordan/Cutting/PO/deletePO.php?po_id=${state.poid}&quantity=${v.quantity}&size=${v.size_code}`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.Error_No === 0){
                    setState({...state,delete:!state.delete})
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
        // setState({...state, delete:false})
    }
    
    const handleUpdate = async (size,quantity,psize) => {
        try{
            let url = api_endpoint+`/Jordan/Cutting/PO/updatePO.php?po_id=${state.poid}&size=${size}&quantity=${quantity}&pSize=${psize}`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.Error_No === 0){
                    setState({...state, update: !state.update})
                    setModalVisible(false)
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

    const handleAdd = (poid,pocode,sizeid,sizecode,quantity) => {
        setLoading(true)
        try{
            pocode=pocode.trim().replace(/ /g, '%20');
            // console.log('PO ID : ',poid,' --- PO Code : ',pocode,' --- SizeID : ',sizeid,' --- Size Code : ',sizecode,' --- Quantity : ',quantity)
            let url = api_endpoint+`/Jordan/Cutting/PO/addPOSizeMappings.php?po_id=${poid}&po_code=${pocode}&size_id=${sizeid}&size_code=${sizecode}&quantity=${quantity}`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.Error_No===0){
                    setState({...state, add: !state.add})
                    props.enqueueSnackbar('Successfully Added Size and Quantity!', { 
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
                props.enqueueSnackbar('Error While Adding Size and Quantity!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Error While Adding Size and Quantity!', { 
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
                                <TextField name='quantity' variant="outlined" label="Quantity" value={modalValues.quantity} style={{marginTop:-10}} onChange={e=>setModalValues({...modalValues,quantity:e.target.value})} fullWidth />
                            </div>
                        </Grid>
                    </Grid>
                    :null
                    }
                    <div style={{display:'flex',justifyContent:'center'}}>
                        <Button color='primary' fullWidth onClick={()=>handleUpdate(state.size,modalValues.quantity,modalValues.size_code)} variant="contained" style={{margin:10,color:'#fff',height:55}}>
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
                        style={{ width: '100%' }}
                        renderInput={params => (
                            <TextField {...params} label="Search PO" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5, width: '100%'}}>
                    <Autocomplete
                        //id="combo-box-demo"
                        options={selectivesizes}
                        //()=>sizes.filter(o => o.size_code!==(tableValues.map((v,i) => (v.size_code))))
                        getOptionLabel={option => option.size_code}
                        style={{ width: '100%' }}
                        onChange={(e,v) => setState({...state,newsize:v.size_code})}
                        renderInput={params => (
                            <TextField {...params} label="Size" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <div style={{padding:10}}>
                        <TextField name='quantity' variant="outlined" label="Quantity" style={{marginTop:-10, width: '400px'}} onChange={e=>setModalValues({...modalValues,quantity:e.target.value})}  />
                        <Button color='primary' onClick={()=> handleAdd(state.poid,state.po,state.sizeid,state.newsize,modalValues.quantity)} variant="contained" style={{marginLeft: 10, marginTop: -10, padding: 15, color:'#fff'}}>Add</Button>
                    </div>
                </Grid>
            </Grid>
            <hr/>
            <Grid container>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding: 5, display:'flex' , justifyContent:'center'}}>
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
                                <th style={{textAlign:'center'}}>Size</th>
                                <th style={{textAlign:'center'}}>Quantity</th>
                                <th style={{textAlign:'center'}}>Actions</th>
                            </tr>
                            <tbody>
                                {
                                    tableValues && tableValues.map((v,i) => (
                                        <tr>
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