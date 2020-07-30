import React from 'react'
import { Grid, TextField, Button,Backdrop,CircularProgress, Typography } from '@material-ui/core'
import { api_endpoint } from '../../util/config'
import Autocomplete from '@material-ui/lab/Autocomplete';
import EditIcon from '@material-ui/icons/Edit'
import { withSnackbar } from 'notistack';
import { Dialog } from '@material-ui/core'
import Select, { components } from 'react-select'
import DeleteIcon from '@material-ui/icons/Delete'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Tooltip from '@atlaskit/tooltip';


const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

const PlanSimulate = props => {

    const [state,setState] = React.useState({})
    const [textFields,setTextFields] = React.useState({
        targetMinutes:480,
        plannedEfficiency:100
    })
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
    
    const [value, setValue] = React.useState('target');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    React.useEffect(() => {
        recalculate(tableValues)
    },[value])

    React.useEffect(()=>{
        
        //__________________________________________________________________________________________________________//
        fetch(api_endpoint+'/Jordan/SPTS/order/getStyleCodes.php')
        .then(res => res.json()
        .then(res => {
            // console.log('res styles',res)
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

    // const handleUpdate = async () => {
    //     console.log('tableValues',tableValues)
    //     setLoading(true)
    //     let table = await Promise.all(tableValues.map(t => ({...t,Style_id:t.style_id,target:t.order_target,time_for_target:t.allocated_time_for_target})))
    //     try{
    //         let url = api_endpoint+`/Jordan/SPTS/style/updateStyleBulletin.php`;
    //         console.log('url',url)
    //         fetch(url,{
    //             method: 'post',
    //             body: JSON.stringify({styleBulletin:table})
    //         })
    //         .then(res => res.json())
    //         .then(res => {
    //             setLoading(false)
    //             console.log('res: ',res)
    //             setTableValues([])
    //             setSomethingChanged(false)
    //             props.enqueueSnackbar('Updated Style Bulletin Successfully!', { 
    //                 variant: 'info',
    //             })
    //         })
    //         .catch(err => {
    //             console.log('error while fetching',err)
    //             setLoading(false)
    //             props.enqueueSnackbar('Failed to Update Style Bulletin!', { 
    //                 variant: 'info',
    //             })
    //         })
    //     }catch(err){
    //         console.log('err in try catch',err)
    //         setLoading(false)
    //         props.enqueueSnackbar('Failed to Update Style Bulletin!', { 
    //             variant: 'info',
    //         })
    //     }

    // }

    const fetchAndUpdateWorkers = async (res) => {
        let plans = await Promise.all(res.Style_Bulletin.map(async s => {
            // API to fetch Plans
            let url = api_endpoint+`/Jordan/SPTS/planning/getPlanForOperation.php?operation_id=${s.operation_id}`;
            console.log('url',url)
            let plansFromFetch = await fetch(url,{
                method: 'post',
            })
            .then(res => res.json())
            .then(async r => {
                console.log('res--> ',r)
                if(r.Plan){
                    // console.log(r.Plan)
                    let formattedPlans = await Promise.all(r.Plan.map(p => ({...p,label:p.worker_name+', ppm: '+p.ppm+', Op Sam: '+(1/parseFloat(p.ppm)).toFixed(2),value:p.worker_id})))
                    return {...s,workersForThisOperation:formattedPlans,selectedWorkers:[]}
                }else{
                    return {...s,workersForThisOperation:[],selectedWorkers:[]}
                }
            })
            return plansFromFetch
            // console.log(s)
        }))

        setCount(plans.length)
        setLoading(false)
        recalculate(plans)
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
            .then(async res => {
                
                console.log('res: ',res)

                if(res.Style_Bulletin){
                   fetchAndUpdateWorkers(res)
                }else{
                    setLoading(false)
                }
                
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

    const handleSelect = async (values,row) => {
        // console.log('what: ',what)
        let newTableValues = await Promise.all(tableValues.map(tV => {
            if(tV.operation_id===row.operation_id){
                return ({...tV,selectedWorkers:values})
            }else{
                return tV
            }
        }))
        recalculate(newTableValues)
    }

    const recalculate = async (tableValues) => {
        let newTableValues = await Promise.all(tableValues.map(async tV => {
            // console.log(tV)
            let production = 0 
            let minutes = 0 
            await Promise.all(tV.selectedWorkers.map(sW => {
                production = production + sW.ppm
            }))
            if(value==='minutes'){
                minutes = textFields.targetMinutes
                production = ((production * parseFloat(textFields.targetMinutes))).toFixed(2)
            }else{
                console.log('production -> ',production)
                minutes = production === 0? 0: ((1/production)* parseFloat(textFields.targetMinutes)).toFixed(2)
                production = textFields.targetMinutes
            }
            console.log('-----------------------------------------------> ',production)
            return ({...tV,production,minutes})
        }))
        setTableValues(newTableValues)
    }

    const handleTextFields = (e,attr) => {
        setTextFields({...textFields,[attr]:e.target.value})
        recalculate(tableValues)
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
                        onChange={(e,v) => {if(v){setState({...state,style:v.style_code})}}}
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
                {
                    count !== null?
                    <Grid container style={{display:'flex',justifyContent:'center'}}>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:15,marginTop:15}}>
                            <Typography variant="subtitle" color='primary' style={{display:'flex',justifyContent:'center',fontWeight:'600'}}>
                                No Of Operations: {count}
                            </Typography>

                        </Grid>
                    </Grid>
                    :null
                }
                <Grid container style={{display:'flex',justifyContent:'center'}}>
                    <Grid item lg={4} md={4} sm={4} xs={6} style={{padding:15,marginTop:15,textAlign:'end'}}>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange} style={{alignItems:'center',flexDirection:'row'}}>
                                <FormLabel component="legend" style={{marginRight:15}}>Select:</FormLabel>
                                <FormControlLabel value="target" control={<Radio />} label="Target" />
                                <FormControlLabel value="minutes" control={<Radio />} label="Minutes" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={6} style={{padding:15,marginTop:15}}>
                        <TextField fullWidth label={"Available "+value} variant="outlined" type="number" value={textFields.targetMinutes} onChange={e=>handleTextFields(e,'targetMinutes')} />
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={6} style={{padding:15,marginTop:15}}>
                        <TextField fullWidth label="Planned Efficiency" variant="outlined" type="number" value={textFields.plannedEfficiency} onChange={e=>handleTextFields(e,'plannedEfficiency')} />
                    </Grid>
                </Grid>

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
                                <th style={{width:500}}>Workers</th>
                                <th>Code</th>
                                <th>Desc</th>
                                <th>Seq</th>
                                <th>Production</th>
                                <th>Minutes</th>
                            </tr>
                            <tbody>
                                {
                                    tableValues.map(v => (
                                        <tr>
                                            <td>
                                                <Select 
                                                    isMulti
                                                    styles={{ option: (base) => ({ ...base, border: `1px solid black`, height: '100%' }) }}
                                                    onChange={values => handleSelect(values,v)} 
                                                    options={v?v.workersForThisOperation?v.workersForThisOperation:[]:[]}
                                                    components={{Option}} 
                                                />
                                            </td>
                                            <td>{v.operation_code}</td>
                                            <td>{v.operation_description}</td>
                                            <td>{v.operation_sequence}</td>
                                            <td>{v.production}</td>
                                            <td>{v.minutes}</td>
                                           
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
                
            </Grid>
        </div>
    )
}

const Option = props => {
    console.log('props ---> ',props)
    return(<Tooltip content={'something'}>
         <components.Option {...props}/>
    </Tooltip>)
}

export default withSnackbar(PlanSimulate)