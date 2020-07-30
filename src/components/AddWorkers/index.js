import React from 'react'
import { Grid, TextField, Button } from '@material-ui/core'
import { api_endpoint } from '../../util/config'
import Autocomplete from '@material-ui/lab/Autocomplete';
//import axios from 'axios'
import { withSnackbar } from 'notistack';

const AddWorkers = props => {

    const [designations,setDesignations] = React.useState([])
    const [deparments,setDepartments] = React.useState([])
    const [state,setState] = React.useState({})
    const [loading,setLoading] = React.useState(false)

    const handleAdd = () => {
        // console.log({ 
        //     worker_code: state.workerId, 
        //     worker_name: state.workerName, 
        //     designator_id:state.designation.designation_id,
        //     designator_code:state.designation.designation_code,
        //     department_id:state.department.department_id,
        //     department_code:state.department.department_code
        // })
        setLoading(true)
        try{
            let url = api_endpoint+`/Jordan/SPTS/worker/insertWorker.php?worker_code=${state.workerId}&worker_name=${state.workerName}&designator_id=${state.designation.designation_id}&designator_code=${state.designation.designation_code}&department_id=${state.department.department_id}&department_code=${state.department.department_code}`;
            console.log('url: ',url)
            // alert(url)
            fetch(url,{
                method: 'post',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.Error_No===0){
                    props.enqueueSnackbar('Successfully added Worker!', { 
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
                //console.log('generate qrcode response',res)
                //setQrCode(res.code)
            })
            .catch(err => {
                console.log('error while fetching',err)
                props.enqueueSnackbar('Error While Adding Worker!', { 
                    variant: 'info',
                })
                setLoading(false)
            })
        }catch(err){
            console.log('err in try catch',err)
            props.enqueueSnackbar('Error While Adding Worker!', { 
                variant: 'info',
            })
            setLoading(false)
        }

    }

    React.useEffect(()=>{

        fetch(api_endpoint+'/Jordan/SPTS/worker/getDepartments.php')
        .then(res => res.json()
        .then(res => {
            console.log('res departments',res)
            setDepartments(res.Departments)
        }))
        .catch(err => {
            console.log('err in fetch',err)
        })

        fetch(api_endpoint+'/Jordan/SPTS/worker/getDesignations.php')
        .then(res => res.json()
        .then(res => {
            console.log('res designations',res)
            setDesignations(res.Designations)
        }))
        .catch(err => {
            console.log('err in fetch',err)
        })

    },[])

    return (
        <div>
            <Grid container>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.workerId} onChange={e => setState({...state,workerId:e.target.value})} name="workerId" variant="outlined" fullWidth label="Worker ID"/>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.workerName} onChange={e => setState({...state,workerName:e.target.value})} name="workerName" variant="outlined" fullWidth label="Worker Name"/>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <Autocomplete
                        //id="combo-box-demo"
                        options={deparments}
                        getOptionLabel={option => option.department_code}
                        style={{ width: '100%' }}
                        onChange={(e,v) => setState({...state,department:v})}
                        renderInput={params => (
                            <TextField {...params} label="Department" variant="outlined" fullWidth />
                        )}
                    />
                    {/* <TextField name="department" variant="outlined" fullWidth label="Department"/> */}
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                <Autocomplete
                        //id="combo-box-demo"
                        options={designations}
                        getOptionLabel={option => option.designation_code}
                        style={{ width: '100%' }}
                        onChange={(e,v) => setState({...state,designation:v})}
                        renderInput={params => (
                            <TextField {...params} label="Designation" variant="outlined" fullWidth />
                        )}
                    />
                    {/* <TextField name="designation" variant="outlined" fullWidth label="Designation"/> */}
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                    <Button 
                        color='primary' 
                        variant='contained' 
                        style={{color:'#fff',height:'50px'}} 
                        onClick={handleAdd}
                        fullWidth
                    >Add Worker</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default withSnackbar(AddWorkers)