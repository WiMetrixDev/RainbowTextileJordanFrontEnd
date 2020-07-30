import React from 'react'
import { Grid, TextField, Button,Backdrop,CircularProgress, Typography } from '@material-ui/core'
import { api_endpoint } from '../../util/config'
import Autocomplete from '@material-ui/lab/Autocomplete';
import EditIcon from '@material-ui/icons/Edit'
import { withSnackbar } from 'notistack';
import { Dialog } from '@material-ui/core'
import uuid from 'uuid/v4'
import DeleteIcon from '@material-ui/icons/Delete'


const ViewStyleBulletin = props => {

    const [state,setState] = React.useState({})
    const [modalVisible, setModalVisible] = React.useState(false)
    const [count, setCount] = React.useState(null)
    const [somethingChanged, setSomethingChanged] = React.useState(false)
    const [modalValues, setModalValues] = React.useState(null)
    const [openBackdrop, setOpenBackdrop] = React.useState(false)
    const [loading,setLoading] = React.useState(false)
    //const [sizes,setSizes] = React.useState([])
    const [styles,setStyles] = React.useState([])
    const [operations,setOperations] = React.useState([])
    const [machineTypes,setMachineTypes] = React.useState([])
    //const [colors,setColors] = React.useState([])
    const [tableValues,setTableValues] = React.useState([])
    //const [deparments,setDepartments] = React.useState([])

    // React.useEffect(()=>{
    //     //http://192.168.88.237/Jordan/Cutting/Marker/getSizes.php
    //     console.log('state',state)
    //     // if(state.style){
    //     //     fetch(api_endpoint+`/Jordan/SPTS/order/getColorsForStyleCode.php?style_code=${state.style}`)
    //     //     .then(res => res.json()
    //     //     .then(res => {
    //     //         console.log('res colors',res)
    //     //         setColors(res.Colors)
    //     //     }))
    //     //     .catch(err => {
    //     //         console.log('err in fetch',err)
    //     //     })

    //     // }
    // },[state.style])


    // const handleAppend = () => {
    //     console.log('handleAppend',state)
    //     setModalVisible(false)
    //     setTableValues(s => [...s,{id:uuid(),operation_code:state.operation.operation_code,operation_description:state.operation.operation_description,operation_sequence:state.sequence,no_of_operators:state.noOfOperators,no_of_helpers:state.noOfHelpers,machine_type:state.machineType.machine_description,target:state.target,time_for_target:state.timeForTarget}])
    //     //setState({...state,size_id:null,size_code:null,quantity:null})
    // }

    React.useEffect(()=>{
        
        //__________________________________________________________________________________________________________//
        fetch(api_endpoint+'/Jordan/SPTS/order/getStyleCodes.php')
        .then(res => res.json()
        .then(res => {
            console.log('res styles',res)
            setStyles(res.Styles)
        }))
        .catch(err => {
            console.log('err in fetch',err)
        })
        //__________________________________________________________________________________________________________//
        fetch(api_endpoint+'/Jordan/SPTS/operation/getOperations.php')
        .then(res => res.json()
        .then(async res => {
            console.log('res operations',res)
            let ops = await Promise.all(res.Operations.map(o => ({operation_id:o.operation_id,operation:o.operation_code+' - '+o.operation_description,operation_code:o.operation_code,operation_description:o.operation_description})))
            setOperations(ops)
        }))
        .catch(err => {
            console.log('err in fetch',err)
        })
        //__________________________________________________________________________________________________________//
        fetch(api_endpoint+'/Jordan/SPTS/style/getDistinctMachineTypes.php')
        .then(res => res.json()
        .then(async res => {
            console.log('res machine Types',res)
            setMachineTypes(res.machine_types)
        }))
        .catch(err => {
            console.log('err in fetch',err)
        })
        //__________________________________________________________________________________________________________//

        
    },[])

    const handleDelete = (record) => {
        console.log('toDelete:',record)
        try {
            let url = api_endpoint + `/Jordan/SPTS/style/deleteStyleBulletin.php?styleBulletin=${JSON.stringify({...record,Style_id:record.style_id})}`
            console.log('url: ',url)
            setOpenBackdrop(true)
            fetch(url,{
                method:'post'
            })
                .then(res => res.json())
                .then(res => {
                    setOpenBackdrop(false)
                    console.log('delete response: ', res)
                    if (res.Error_No === 0) {
                        props.enqueueSnackbar('Successfully deleted style bulletin!', {
                            variant: 'info',
                        })
                        handleFetch()
                    }
                    //setTableValues(res.Orders)
                })
                .catch(err => {
                    console.log('err in fetching', err)
                    setOpenBackdrop(false)
                    //setTableValues([])
                })
        } catch (err) {
            console.log('try catch error: ', err)
            setOpenBackdrop(false)
            //setTableValues([])
        }
        // try{
        //     let url = api_endpoint+`/Jordan/SPTS/style/deleteStyleBulletin.php?styleBulletin=${record}`;
        //     console.log('url',url)
        //     fetch(url,{
        //         method: 'post',
        //     })
        //     .then(res => res.json())
        //     .then(res => {
        //         setLoading(false)
        //         console.log('res: ',res)
        //         setTableValues(res.Style_Bulletin)
        //     })
        //     .catch(err => {
        //         console.log('error while fetching',err)
        //         setLoading(false)
        //         props.enqueueSnackbar('Failed to Fetch Style Bulletin!', { 
        //             variant: 'info',
        //         })
        //     })
        // }catch(err){
        //     console.log('err in try catch',err)
        //     setLoading(false)
        //     props.enqueueSnackbar('Failed to Fetch Style Bulletin!', { 
        //         variant: 'info',
        //     })
        // }
    }
    const handleUpdateTable = async () => {
        // console.log('modalValues',modalValues)
        // console.log('tableVlaue',tableValues)
        let tempTable = await Promise.all(tableValues.map(v => {
            if(v.style_id===modalValues.style_id){
                return modalValues
            }else{
                return v
            }
        }))
        console.log('newTable',tempTable)
        setTableValues(tempTable)
        setSomethingChanged(true)
        setModalVisible(false)

        //let 

    }

    const handleUpdate = async () => {
        console.log('tableValues',tableValues)
        setLoading(true)
        let table = await Promise.all(tableValues.map(t => ({...t,Style_id:t.style_id,target:t.order_target,time_for_target:t.allocated_time_for_target})))
        try{
            let url = api_endpoint+`/Jordan/SPTS/style/updateStyleBulletin.php`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
                body: JSON.stringify({styleBulletin:table})
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                setTableValues([])
                setSomethingChanged(false)
                props.enqueueSnackbar('Updated Style Bulletin Successfully!', { 
                    variant: 'info',
                })
            })
            .catch(err => {
                console.log('error while fetching',err)
                setLoading(false)
                props.enqueueSnackbar('Failed to Update Style Bulletin!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Failed to Update Style Bulletin!', { 
                variant: 'info',
            })
        }

    }

    const handleFetch = () => {
        setCount(null)

        console.log('state: ',state)
        console.log('tableValues: ',tableValues)
        // console.log(`/Jordan/Cutting/Marker/insertMarkerAndSizeMappings.php?style_code=${state.color.style_code}&color=${state.color.color}&marker_description=${state.marker_description}&no_of_plies=${state.no_of_plies}&size_mappings=${tableValues}`)
        setLoading(true)
        try{
            let url = api_endpoint+`/Jordan/SPTS/style/getStyleBulletinForStyleCode.php?style_code=${state.style}`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                setTableValues(res.Style_Bulletin)
                setCount(res.Style_Bulletin.length)
            })
            .catch(err => {
                console.log('error while fetching',err)
                setLoading(false)
                props.enqueueSnackbar('Failed to Fetch Style Bulletin!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Failed to Fetch Style Bulletin!', { 
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
                        Update The Following Information For Style
                    </div>
                    {
                        modalValues?
                        <Grid container style={{padding:10}}>
                            {
                                console.log('modalValues ====> ',modalValues)
                            }
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <Autocomplete
                                //id="combo-box-demo"
                                options={operations}
                                getOptionLabel={option => option.operation}
                                style={{ width: '100%' }}
                                defaultValue={()=>operations.filter(o => o.operation_code===modalValues.operation_code)[0]}
                                onChange={(e,v) => {if(v){setModalValues({...modalValues,operation_id:v.operation_id,operation_code:v.operation_code,operation_description:v.operation_description})}}}
                                renderInput={params => (
                                    <TextField {...params} label="Operation" variant="outlined" fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <Autocomplete
                                //id="combo-box-demo"
                                options={machineTypes}
                                getOptionLabel={option => option.machine_type}
                                style={{ width: '100%' }}
                                defaultValue={{machine_type:modalValues.machine_type}}
                                //value={modalValues.machine_type}
                                //defaultValue={() => machineTypes.filter(t => t.)}
                                onChange={(e,v) => {if(v){setModalValues({...modalValues,machine_type:v.machine_type})}}}
                                renderInput={params => (
                                    <TextField {...params} label="Machine Type" variant="outlined" fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <TextField name='sequence' type='number' variant="outlined" label="Sequence" value={modalValues.operation_sequence} onChange={e=>setModalValues({...modalValues,operation_sequence:Number(e.target.value)})} fullWidth />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <TextField name='target' type='number' variant="outlined" label="Target" value={modalValues.order_target} onChange={e=>setModalValues({...modalValues,order_target:Number(e.target.value)})} fullWidth />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <TextField name='timeForTarget' type='number' variant="outlined" label="Time For Target" value={modalValues.allocated_time_for_target} onChange={e=>setModalValues({...modalValues,allocated_time_for_target:Number(e.target.value)})} fullWidth />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <TextField name='noOfOperators' type='number' variant="outlined" label="No Of Operators" value={modalValues.no_of_operators} onChange={e=>setModalValues({...modalValues,no_of_operators:Number(e.target.value)})} fullWidth />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <TextField name='noOfHelpers' type='number' variant="outlined" label="No Of Helpers" value={modalValues.no_of_helpers} onChange={e=>setModalValues({...modalValues,no_of_helpers:Number(e.target.value)})} fullWidth />
                        </Grid>
                    </Grid>
                    :null
                    }
                    <div style={{display:'flex',justifyContent:'center'}}>
                        <Button color='primary' fullWidth onClick={handleUpdateTable} variant="contained" style={{margin:10,color:'#fff',height:55}}>
                            {
                                loading === true?
                                <CircularProgress color={'#fff'}/>
                                :
                                `Update`
                            }
                        </Button>
                        <Button color='primary' fullWidth onClick={()=>setModalVisible(false)} variant="contained" style={{margin:10,color:'#fff',height:55}}>
                            cancel
                        </Button>
                    </div>
                </div>
            </Dialog>
            <Grid container style={{display:'flex',justifyContent:'center'}}>
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
                <Grid item lg={2} md={2} sm={2} xs={2} style={{padding:5}}>
                    <Button variant="contained" color='primary' onClick={handleFetch} style={{height:55,color:'#fff'}} fullWidth>
                        fetch
                    </Button>
                    
                    {/* <Autocomplete
                        //id="combo-box-demo"
                        options={colors}
                        getOptionLabel={option => option.color}
                        style={{ width: '100%' }}
                        onChange={(e,v) => setState({...state,color:v})}
                        renderInput={params => (
                            <TextField {...params} label="Color" variant="outlined" fullWidth />
                            )}
                        /> */}
                </Grid>
                {/* <Grid item lg={2} md={2} sm={2} xs={2} style={{padding:5}}>
                            <Button variant="contained" color='primary' onClick={handleUpdate} style={{height:55,color:'#fff'}} fullWidth>
                                Save changes
                            </Button>
                        </Grid> */}
                {
                        somethingChanged===true?
                        <Grid item lg={2} md={2} sm={2} xs={2} style={{padding:5}}>
                            <Button variant="contained" color='primary' onClick={handleUpdate} style={{height:55,color:'#fff'}} fullWidth>
                                {
                                    loading===true?
                                    <CircularProgress color={'#fff'}/>
                                    :`Update`
                                }
                            </Button>
                        </Grid>
                        :null
                    }
                
                
                {/* <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.marker_description} onChange={e => setState({...state,marker_description:e.target.value})} name="markerDescription" variant="outlined" fullWidth label="Marker Description"/>
                </Grid> */}
                {
                    count !== null?
                    <Grid container style={{display:'flex',justifyContent:'center'}}>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:15,marginTop:15}}>
                            <Typography variant="subtitle" color='primary' style={{display:'flex',justifyContent:'center',fontWeight:'600'}}>
                                No Of Style Bulletin: {count}
                            </Typography>

                        </Grid>
                    </Grid>
                    :null
                }
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                    {
                        loading===true?
                        <div style={{ padding: 20, justifyContent: 'center', display: 'flex' }}>
                            <CircularProgress color='primary' />
                        </div>
                        :
                        tableValues && tableValues.length > 0?
                        <table style={{width:'100%'}}>
                            <tr>
                                <th>Operation Code</th>
                                <th>Operation Desc</th>
                                <th>Operation Seq</th>
                                <th>No. of Operators</th>
                                <th>Machine Type</th>
                                <th>Target</th>
                                <th>Time For Target</th>
                                <th>No. of Helpers</th>
                                <th></th>
                                {/* <th style={{ width: '40px' }}></th> */}
                                {/* <th style={{ width: '70px' }}></th> */}
                            </tr>
                            <tbody>
                                {
                                    tableValues.map(v => (
                                        <tr>
                                            <td>{v.operation_code}</td>
                                            <td>{v.operation_description}</td>
                                            <td>{v.operation_sequence}</td>
                                            <td>{v.no_of_operators}</td>
                                            <td>{v.machine_type}</td>
                                            <td>{v.order_target}</td>
                                            <td>{v.allocated_time_for_target}</td>
                                            <td>{v.no_of_helpers}</td>
                                            <td><EditIcon color='primary' style={{ cursor: 'pointer' }} onClick={()=>{
                                                setModalVisible(true)
                                                setModalValues(v)
                                                console.log('v',v)
                                                //setTableValues(draft => draft.filter(d => d.id !== v.id))
                                            }}/><DeleteIcon color='primary' style={{ cursor: 'pointer' }} onClick={()=>handleDelete(v)} /></td>
                                            {/* <td style={{ textAlign: 'center' }}><EditIcon color='primary' onClick={() => {
                                                setModalVisible(true)
                                                setModalValues(v)
                                            }} style={{ cursor: 'pointer', marginRight: 15 }} /><DeleteIcon color='primary' style={{ cursor: 'pointer' }} /></td> */}
                                        </tr>
                                    ))
                                }
                                
                            </tbody>
                            <Backdrop open={openBackdrop}>
                                <CircularProgress color="inherit" />
                            </Backdrop>
                        </table>
                        :null
                    }

                </Grid>
                {/* <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                    <Button 
                        color='primary' 
                        variant='contained' 
                        style={{color:'#fff',height:'50px'}} 
                        onClick={handleUpload}
                        fullWidth
                    >Upload Style Bulletin</Button>
                </Grid> */}
            </Grid>
        </div>
    )
}

export default withSnackbar(ViewStyleBulletin)