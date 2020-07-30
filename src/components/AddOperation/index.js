import React from 'react'
import { Grid, TextField, Button } from '@material-ui/core'
import { api_endpoint } from '../../util/config'
//import Autocomplete from '@material-ui/lab/Autocomplete';
import { withSnackbar } from 'notistack';

const AddOperations = props => {

    const [state,setState] = React.useState({})
    const [loading,setLoading] = React.useState(false)

    const handleAdd = () => {
        setLoading(true)
        try{
            let url = api_endpoint+`/Jordan/SPTS/operation/insertOperation.php?operation_code=${state.operationCode}&operation_description=${state.operationDescription}&operation_smv=${state.operationSMV}&piece_rate=${state.pieceRate}`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.Error_No===0){
                    props.enqueueSnackbar('Successfully Added Operation!', { 
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
                props.enqueueSnackbar('Error While Adding Operation!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Error While Adding Operation!', { 
                variant: 'info',
            })
        }

    }

    return (
        <div>
            <Grid container>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.operationCode} onChange={e => setState({...state,operationCode:e.target.value})} name="operationCode" variant="outlined" fullWidth label="Operation Code"/>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.operationDescription} onChange={e => setState({...state,operationDescription:e.target.value})} name="operationDescription" variant="outlined" fullWidth label="Operation Description"/>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.operationSMV} type="number" min={0} onChange={e => setState({...state,operationSMV:e.target.value})} name="operationSMV" variant="outlined" fullWidth label="Operation SMV"/>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.pieceRate} type="number" min={0} onChange={e => setState({...state,pieceRate:e.target.value})} name="pieceRate" variant="outlined" fullWidth label="Piece Rate"/>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                    <Button 
                        color='primary' 
                        variant='contained' 
                        style={{color:'#fff',height:'50px'}} 
                        onClick={handleAdd}
                        fullWidth
                    >Add Operation</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default withSnackbar(AddOperations)