import React from 'react'
import { Grid, TextField, Button, Typography } from '@material-ui/core'
import { api_endpoint } from '../../util/config'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withSnackbar } from 'notistack';
import { Dialog } from '@material-ui/core'
import uuid from 'uuid/v4'
import DeleteIcon from '@material-ui/icons/Delete'


const ExecuteCutJob = props => {

    const [state,setState] = React.useState({})
    const [modalVisible, setModalVisible] = React.useState(false)
    const [loading,setLoading] = React.useState(false)
    // const [sizes,setSizes] = React.useState([])
    // const [styles,setStyles] = React.useState([])
    // const [colors,setColors] = React.useState([])
    // const [tableValues,setTableValues] = React.useState([])
    const [cutJobs,setCutJobs] = React.useState([])

    
    React.useEffect(()=>{
        fetchCutJobs()
    },[])

    // React.useEffect(()=>{
        
    //     if(state.marker){
    //         //console.log('satte',state)
    //         try {
    //             fetch(api_endpoint + `/Jordan/Cutting/Marker/getSizesForMarker.php?marker_id=${state.marker.marker_id}`)
    //                 .then(res => res.json())
    //                 .then(res => {
    //                     console.log(res)
    //                     setSizes(res.Sizes)
    //                 })
    //                 .catch(err => {
    //                     console.log('err in fetching', err)
    //                     setSizes([])
    //                 })
    //         } catch (err) {
    //             console.log('try catch error: ', err)
    //             setSizes([])
    //         }
    //     }

    // },[state.marker])

    const fetchCutJobs = () => {
        try {
            fetch(api_endpoint + '/Jordan/Cutting/CutJob/getCutJobs.php')
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    if(res.CutJobs){
                        setCutJobs(res.CutJobs)
                    }
                })
                .catch(err => {
                    console.log('err in fetching', err)
                    setCutJobs([])
                })
        } catch (err) {
            console.log('try catch error: ', err)
            setCutJobs([])
        }
    }

    const handleAdd = () => {

        setLoading(true)
        console.log('satet',state)
        try{
            
            let url = api_endpoint+`/Jordan/Cutting/CutJob/executeCutJob.php?cut_job_id=${state.cutJob.cut_job_id}&no_of_bundles=${state.no_of_bundles}`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.Error_No===0){
                    props.enqueueSnackbar('Successfully Executed Cut Job!', { 
                        variant: 'info',
                    })
                    setModalVisible(true)
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
                props.enqueueSnackbar('Error While Executing Cut Job!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Error While Executing Cut Job!', { 
                variant: 'info',
            })
        }

    }
    return (
        <div>
            <Dialog
                open={modalVisible}
            >
                <div style={{width:200,padding:20,display:'flex',justifyContent:'center'}}>
                    <Typography variant="h6" color='primary' style={{textAlign:'center'}}>Cut Job Executed Successfully!</Typography>
                </div>
                <div style={{width:200,padding:'0px 20px',display:'flex',justifyContent:'center'}}>
                    Cut Job ID: {state.cutJob?state.cutJob.cut_job_id:null}
                    </div>
                <div style={{width:200,padding:20,display:'flex',justifyContent:'center'}}>
                    <Button style={{marginTop:20}} variant="contained" fullWidth onClick={()=>setModalVisible(false)}>Okay</Button>
                </div>
            </Dialog>
            <Grid container>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <Autocomplete
                        //id="combo-box-demo"
                        options={cutJobs}
                        getOptionLabel={option => option.cut_job_description}
                        style={{ width: '100%' }}
                        onChange={(e,v) => setState({...state,cutJob:v})}
                        renderInput={params => (
                            <TextField {...params} label="Cut Job" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField name='no_of_bundles' variant="outlined" label="No Of Bundles" values={state.no_of_bundles} onChange={e=>setState({...state,no_of_bundles:e.target.value})} fullWidth />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                    <Button 
                        color='primary' 
                        variant='contained' 
                        style={{color:'#fff',height:'50px'}} 
                        onClick={handleAdd}
                        fullWidth
                    >Execute Cut Job</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default withSnackbar(ExecuteCutJob)