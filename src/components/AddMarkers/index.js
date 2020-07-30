import React from 'react'
import { Grid, TextField, Button } from '@material-ui/core'
import { api_endpoint } from '../../util/config'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withSnackbar } from 'notistack';
import { Dialog } from '@material-ui/core'
import uuid from 'uuid/v4'
import DeleteIcon from '@material-ui/icons/Delete'


const AddMarkers = props => {

    const [state,setState] = React.useState({})
    const [modalVisible, setModalVisible] = React.useState(false)
    const [loading,setLoading] = React.useState(false)
    const [sizes,setSizes] = React.useState([])
    const [styles,setStyles] = React.useState([])
    const [colors,setColors] = React.useState([])
    const [tableValues,setTableValues] = React.useState([])
    const [deparments,setDepartments] = React.useState([])

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
        //http://192.168.88.237/Jordan/Cutting/Marker/getSizes.php
        if(state.size){
            setModalVisible(true)
        }
        
    },[state.size])

    const handleAppend = () => {
        console.log('handleAppend',state.style,state.quantity)
        setModalVisible(false)
        setTableValues(s => [...s,{id:uuid(),size_id:state.size.size_id,size_code:state.size.size_code,quantity:state.quantity}])
        setState({...state,size_id:null,size_code:null,quantity:null})
    }

    React.useEffect(()=>{
        
        fetch(api_endpoint+'/Jordan/SPTS/order/getStyleCodes.php')
        .then(res => res.json()
        .then(res => {
            console.log('res styles',res)
            setStyles(res.Styles)
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

        // fetch(api_endpoint+'/Jordan/SPTS/worker/getDesignations.php')
        // .then(res => res.json()
        // .then(res => {
        //     console.log('res designations',res)
        //     setDesignations(res.Designations)
        // }))
        // .catch(err => {
        //     console.log('err in fetch',err)
        // })

    },[])

    const handleAdd = () => {
        // console.log({ 
        //     worker_code: state.workerId, 
        //     worker_name: state.workerName, 
        //     designator_id:state.designation.designation_id,
        //     designator_code:state.designation.designation_code,
        //     department_id:state.department.department_id,
        //     department_code:state.department.department_code
        // })
        console.log('state: ',state)
        // console.log(`/Jordan/Cutting/Marker/insertMarkerAndSizeMappings.php?style_code=${state.color.style_code}&color=${state.color.color}&marker_description=${state.marker_description}&no_of_plies=${state.no_of_plies}&size_mappings=${tableValues}`)
        setLoading(true)
        try{
            let url = api_endpoint+`/Jordan/Cutting/Marker/insertMarkerAndSizeMappings.php?style_code=${state.color.style_code}&color=${state.color.color}&marker_description=${state.marker_description}&no_of_plies=${state.no_of_plies}&size_mappings=${JSON.stringify(tableValues)}`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.Error_No===0){
                    props.enqueueSnackbar('Successfully Added Marker!', { 
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
                props.enqueueSnackbar('Error While Adding Marker!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Error While Adding Marker!', { 
                variant: 'info',
            })
        }

    }
    return (
        <div>
            <Dialog
                open={modalVisible}
            >
                <div style={{ padding: 20, width: 480 }}>
                    <div style={{padding:10}}>
                        Enter Quantity
                    </div>
                    <div style={{padding:10}}>
                        <TextField name='quantity' variant="outlined" label="Quantity" values={state.quantity} onChange={e=>setState({...state,quantity:e.target.value})} fullWidth />
                    </div>
                    <div style={{display:'flex',justifyContent:'center',marginTop:20}}>
                        <Button color='primary' fullWidth onClick={handleAppend} variant="contained" style={{margin:10,color:'#fff'}}>
                            Save Quantity
                        </Button>
                        <Button color='primary' fullWidth onClick={()=>setModalVisible(false)} variant="contained" style={{margin:10,color:'#fff'}}>
                            cancel
                        </Button>
                    </div>
                </div>
            </Dialog>
            <Grid container>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <Autocomplete
                        //id="combo-box-demo"
                        options={styles}
                        getOptionLabel={option => option.style_code}
                        style={{ width: '100%' }}
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
                        onChange={(e,v) => setState({...state,color:v})}
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
                        onChange={(e,v) => setState({...state,size:v})}
                        renderInput={params => (
                            <TextField {...params} label="Size" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.no_of_plies} onChange={e => setState({...state,no_of_plies:e.target.value})} name="no_of_plies" variant="outlined" fullWidth label="No. of Plies"/>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.marker_description} onChange={e => setState({...state,marker_description:e.target.value})} name="markerDescription" variant="outlined" fullWidth label="Marker Description"/>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                    {
                        tableValues && tableValues.length > 0?
                        <table style={{width:'100%'}}>
                            <tr>
                                <th>Size</th>
                                <th>Quantity</th>
                                <th style={{ width: '40px' }}></th>
                                {/* <th style={{ width: '70px' }}></th> */}
                            </tr>
                            {console.log('tableValues',tableValues)}
                            <tbody>
                                {
                                    tableValues.map(v => (
                                        <tr>
                                            <td>{v.size_code}</td>
                                            <td>{v.quantity}</td>
                                            <td><DeleteIcon color='primary' style={{ cursor: 'pointer' }} onClick={()=>{
                                                setTableValues(draft => draft.filter(d => d.id !== v.id))
                                            }}/></td>
                                            {/* <td style={{ textAlign: 'center' }}><EditIcon color='primary' onClick={() => {
                                                setModalVisible(true)
                                                setModalValues(v)
                                            }} style={{ cursor: 'pointer', marginRight: 15 }} /><DeleteIcon color='primary' style={{ cursor: 'pointer' }} /></td> */}
                                        </tr>
                                    ))
                                }
                                
                            </tbody>
                        </table>
                        :null
                    }

                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                    <Button 
                        color='primary' 
                        variant='contained' 
                        style={{color:'#fff',height:'50px'}} 
                        onClick={handleAdd}
                        fullWidth
                    >Add Marker</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default withSnackbar(AddMarkers)