import React from 'react'
import { Grid, TextField, Button } from '@material-ui/core'
import { api_endpoint } from '../../util/config'
//import Autocomplete from '@material-ui/lab/Autocomplete';
import { withSnackbar } from 'notistack';

const AddOrders = props => {

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
            let url = api_endpoint+`/Jordan/SPTS/order/insertOrder.php?buyer=${state.buyer}&style_code=${state.style}&color=${state.color}`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.Error_No===0){
                    props.enqueueSnackbar('Successfully Added Order!', { 
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
                props.enqueueSnackbar('Error While Adding Order!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Error While Adding Order!', { 
                variant: 'info',
            })
        }

    }
    return (
        <div>
            <Grid container>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.buyer} onChange={e => setState({...state,buyer:e.target.value})} name="buyer" variant="outlined" fullWidth label="Buyer"/>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.style} onChange={e => setState({...state,style:e.target.value})} name="style" variant="outlined" fullWidth label="Style"/>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.color} onChange={e => setState({...state,color:e.target.value})} name="color" variant="outlined" fullWidth label="Color"/>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                    <Button 
                        color='primary' 
                        variant='contained' 
                        style={{color:'#fff',height:'50px'}} 
                        onClick={handleAdd}
                        fullWidth
                    >Add Order</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default withSnackbar(AddOrders)