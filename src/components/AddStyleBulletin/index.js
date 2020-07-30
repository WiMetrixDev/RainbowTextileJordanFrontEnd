import React from 'react'
import { Grid, TextField, Button, Typography, CircularProgress } from '@material-ui/core'
import { api_endpoint } from '../../util/config'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withSnackbar } from 'notistack';
import { Dialog } from '@material-ui/core'
import uuid from 'uuid/v4'
import DeleteIcon from '@material-ui/icons/Delete'
import readXlsxFile from 'read-excel-file'



const AddStyleBulletin = props => {

    const [state,setState] = React.useState({})
    const [modalVisible, setModalVisible] = React.useState(false)
    const [spreadSheetButtonVisible, setSpreadSheetButtonVisible] = React.useState(false)
    const [modalVisible2, setModalVisible2] = React.useState(false)
    const [responses, setResponses] = React.useState([])
    const [loading,setLoading] = React.useState(false)
    //const [sizes,setSizes] = React.useState([])
    const [styles,setStyles] = React.useState([])
    const [operations,setOperations] = React.useState([])
    const [machineTypes,setMachineTypes] = React.useState([])
    //const [colors,setColors] = React.useState([])
    const [tableValues,setTableValues] = React.useState([])
    //const [deparments,setDepartments] = React.useState([])

    React.useEffect(()=>{
        //http://192.168.88.237/Jordan/Cutting/Marker/getSizes.php
        console.log('state',state)
        // if(state.style){
        //     fetch(api_endpoint+`/Jordan/SPTS/order/getColorsForStyleCode.php?style_code=${state.style}`)
        //     .then(res => res.json()
        //     .then(res => {
        //         console.log('res colors',res)
        //         setColors(res.Colors)
        //     }))
        //     .catch(err => {
        //         console.log('err in fetch',err)
        //     })

        // }
    },[state.style])


    const handleAppend = () => {
        console.log('handleAppend',state)
        setModalVisible(false)
        setTableValues(s => [...s,{id:uuid(),operation_code:state.operation?state.operation.operation_code:'',operation_description:state.operation?state.operation.operation_description:'',operation_sequence:state.sequence,no_of_operators:state.noOfOperators,no_of_helpers:state.noOfHelpers,machine_type:state.machineType?state.machineType.machine_type:'',target:state.target,time_for_target:state.timeForTarget}])
        //setState({...state,size_id:null,size_code:null,quantity:null})
    }

    const handleFileUpload = (e) => {
        // setExcelLoading(true)
        console.log('e ',e)
        console.log('e.target.files ',e.target.files)
        //setFilesState()
        try{

            readXlsxFile(e.target.files[0]).then(async (rows) => {
                let arr = []
                console.log('rows: ',rows)
                for(let i=1; i<rows.length; i++){
                    let obj = {
                        operation_code:rows[i][0],
                        operation_description:rows[i][1],
                        operation_sequence:rows[i][2],
                        no_of_operators:rows[i][3],
                        machine_type:rows[i][4],
                        target:rows[i][5],
                        time_for_target:rows[i][6],
                        no_of_helpers:rows[i][7],
                        id:uuid()
                    }
                    arr.push(obj)
                }
                console.log('arr',arr)
                setTableValues(arr)
                // setExcelLoading(false)
                // `rows` is an array of rows
                // each row being an array of cells.
              })
        }catch(err){
            console.log('errr',err)
            // setExcelLoading(false)
        }

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

        fetch(api_endpoint+'/Jordan/SPTS/style/getDistinctMachineTypes.php')
        .then(res => res.json()
        .then(async res => {
            console.log('res machine Types',res)
            // let s = await Promise.all(res.Machi.map(o => ({operation_id:o.operation_id,operation:o.operation_code+' - '+o.operation_description})))

            // setOperations(ops)
            setMachineTypes(res.machine_types)
        }))
        .catch(err => {
            console.log('err in fetch',err)
        })
        
    },[])

    const handleUpload = () => {
        // console.log({ 
        //     worker_code: state.workerId, 
        //     worker_name: state.workerName, 
        //     designator_id:state.designation.designation_id,
        //     designator_code:state.designation.designation_code,
        //     department_id:state.department.department_id,
        //     department_code:state.department.department_code
        // })
        console.log('state: ',state)
        console.log('tableValues: ',tableValues)
        // console.log(`/Jordan/Cutting/Marker/insertMarkerAndSizeMappings.php?style_code=${state.color.style_code}&color=${state.color.color}&marker_description=${state.marker_description}&no_of_plies=${state.no_of_plies}&size_mappings=${tableValues}`)
        setLoading(true)
        try{
            let url = api_endpoint+`/Jordan/SPTS/style/insertStyleBulletin.php`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
                body: JSON.stringify({styleBulletin:tableValues,style_code:state.style})
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.Responses){
                    setResponses(res.Responses)
                    setModalVisible2(true)
                }
                if(res.Error_No===0){
                    props.enqueueSnackbar(res.Error_Description?res.Error_Description:'Successfully Added Style Bulletin!', { 
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
                props.enqueueSnackbar('Error While Adding Style Bulletin!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Error While Adding Style Bulletin!', { 
                variant: 'info',
            })
        }

    }
    return (
        <div>
            <Dialog
                open={modalVisible2}
            >
                <div style={{ padding: 20, width: 543 }}>
                    <div style={{padding:10,textAlign:'center'}}>
                        <Typography variant="h6" color='primary' style={{textAlign:'center'}}>Summary of Insertion</Typography>
                    </div>
                    <Grid container style={{padding:10}}>
                        {
                            responses && responses.length && responses.length>0?
                            <table style={{width:'100%'}}>
                                <tr>
                                    <th>Style</th>
                                    <th>Operation Code</th>
                                    <th>Operation Desc</th>
                                    <th>Operation Seq</th>
                                    <th>Status</th>
                                </tr>
                                <tbody>
                                    {
                                        responses && responses.map(v => (
                                            <tr>
                                                <td>{v.style_code}</td>
                                                <td>{v.operation_code}</td>
                                                <td>{v.operation_description}</td>
                                                <td>{v.operation_sequence}</td>
                                                <td style={{color:v.Error_Description==='Failed'?'red':''}}>{v.Error_Description}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            :null
                        }
                    
                    </Grid>
                        <div style={{display:'flex',justifyContent:'center'}}>
                            <Button color='primary' fullWidth onClick={()=>setModalVisible2(false)} variant="contained" style={{margin:10,color:'#fff',height:55}}>
                                Okay
                            </Button>
                        </div>
                    </div>
            </Dialog>
            <Dialog
                open={modalVisible}
            >
                <div style={{ padding: 20, width: 480 }}>
                    <div style={{padding:10,textAlign:'center'}}>
                        <Typography variant="h6" color='primary' style={{textAlign:'center'}}>Provide The Following Information For Style</Typography>
                    </div>
                    <Grid container style={{padding:10}}>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <Autocomplete
                                //id="combo-box-demo"
                                options={operations}
                                getOptionLabel={option => option.operation}
                                style={{ width: '100%' }}
                                onChange={(e,v) => setState({...state,operation:v})}
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
                                onChange={(e,v) => setState({...state,machineType:v})}
                                renderInput={params => (
                                    <TextField {...params} label="Machine Type" variant="outlined" fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <TextField name='sequence' type='number' variant="outlined" label="Sequence" values={state.sequence} onChange={e=>setState({...state,sequence:e.target.value})} fullWidth />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <TextField name='target' type='number' variant="outlined" label="Target" values={state.target} onChange={e=>setState({...state,target:e.target.value})} fullWidth />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <TextField name='timeForTarget' type='number' variant="outlined" label="Time For Target" values={state.timeForTarget} onChange={e=>setState({...state,timeForTarget:e.target.value})} fullWidth />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <TextField name='noOfOperators' type='number' variant="outlined" label="No Of Operators" values={state.noOfOperators} onChange={e=>setState({...state,noOfOperators:e.target.value})} fullWidth />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <TextField name='noOfHelpers' type='number' variant="outlined" label="No Of Helpers" values={state.noOfHelpers} onChange={e=>setState({...state,noOfHelpers:e.target.value})} fullWidth />
                        </Grid>
                    </Grid>
                    <div style={{display:'flex',justifyContent:'center'}}>
                        <Button color='primary' fullWidth onClick={handleAppend} variant="contained" style={{margin:10,color:'#fff',height:55}}>
                            Okay
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
                        onChange={(e,v) => {if(v){setState({...state,style:v.style_code})}}}
                        renderInput={params => (
                            <TextField {...params} label="Style" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                <Grid item lg={2} md={2} sm={2} xs={2} style={{padding:5}}>
                    <Button variant="contained" color='primary' onClick={()=>setModalVisible(true)} style={{height:55,color:'#fff'}} fulLWidth>
                        Add
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
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5,justifyContent:'center',display:'flex'}}>
                    <Typography variant="subtitle1" color='primary' style={{cursor:'pointer',textAlign:'center',fontWeight:'700'}} onClick={()=>setSpreadSheetButtonVisible(!spreadSheetButtonVisible)}>Upload from Spreadsheet</Typography>
                    {spreadSheetButtonVisible === true?
                    <input type='file' style={{marginLeft:15}} onChange={handleFileUpload}/>
                    :null
                    }
                </Grid>
                    {/* {
                        spreadSheetButtonVisible === true?
                        <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5,justifyContent:'center',display:'flex'}}>
                            <input type='file'/>
                        </Grid>
                        :null
                    } */}
                
                
                {/* <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.marker_description} onChange={e => setState({...state,marker_description:e.target.value})} name="markerDescription" variant="outlined" fullWidth label="Marker Description"/>
                </Grid> */}
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                    {
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
                                <th style={{ width: '40px' }}></th>
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
                                            <td>{v.target}</td>
                                            <td>{v.time_for_target}</td>
                                            <td>{v.no_of_operators}</td>
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
                        onClick={handleUpload}
                        fullWidth
                    >{
                        loading===true?
                        <CircularProgress color='#fff'/>
                        :`Upload Style Bulletin`   
                    }</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default withSnackbar(AddStyleBulletin)