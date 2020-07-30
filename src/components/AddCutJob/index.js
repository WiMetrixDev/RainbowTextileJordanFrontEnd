import React from 'react'
import { Grid, TextField, Button } from '@material-ui/core'
import { api_endpoint } from '../../util/config'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withSnackbar } from 'notistack';
import { Dialog } from '@material-ui/core'
import uuid from 'uuid/v4'
import DeleteIcon from '@material-ui/icons/Delete'


const AddCutJob = props => {

    const [state,setState] = React.useState({})
    const [modalVisible, setModalVisible] = React.useState(false)
    const [loading,setLoading] = React.useState(false)
    const [sizes,setSizes] = React.useState([])
    // const [styles,setStyles] = React.useState([])
    // const [colors,setColors] = React.useState([])
    // const [tableValues,setTableValues] = React.useState([])
    const [markers,setMarkers] = React.useState([])

    
    React.useEffect(()=>{
        fetchMarkers()
    },[])

    React.useEffect(()=>{
        
        if(state.marker){
            //console.log('satte',state)
            try {
                fetch(api_endpoint + `/Jordan/Cutting/Marker/getSizesForMarker.php?marker_id=${state.marker.marker_id}`)
                    .then(res => res.json())
                    .then(res => {
                        console.log(res)
                        setSizes(res.Sizes)
                    })
                    .catch(err => {
                        console.log('err in fetching', err)
                        setSizes([])
                    })
            } catch (err) {
                console.log('try catch error: ', err)
                setSizes([])
            }
        }

    },[state.marker])

    const fetchMarkers = () => {
        try {
            fetch(api_endpoint + '/Jordan/Cutting/Marker/getMarkers.php')
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    setMarkers(res.Markers)
                })
                .catch(err => {
                    console.log('err in fetching', err)
                    setMarkers([])
                })
        } catch (err) {
            console.log('try catch error: ', err)
            setMarkers([])
        }
    }

    const handleAdd = () => {

        setLoading(true)
        console.log('satet',state)
        try{
            let url = api_endpoint+`/Jordan/Cutting/CutJob/insertCutJobForMarker.php?marker_id=${state.marker.marker_id}&no_of_layers=${state.no_of_layers}&cut_description=${state.cut_description}&part_name=${state.part_name}`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res: ',res)
                if(res.Error_No===0){
                    props.enqueueSnackbar('Successfully Added Cut Job!', { 
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
                props.enqueueSnackbar('Error While Adding Cut Job!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Error While Adding Cut Job!', { 
                variant: 'info',
            })
        }

    }
    return (
        <div>
            {/* <Dialog
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
            </Dialog> */}
            <Grid container>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <Autocomplete
                        //id="combo-box-demo"
                        options={markers}
                        getOptionLabel={option => option.marker_description}
                        style={{ width: '100%' }}
                        onChange={(e,v) => setState({...state,marker:v})}
                        renderInput={params => (
                            <TextField {...params} label="Marker" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                {/* <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
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
                </Grid> */}
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField name='cut_description' variant="outlined" label="Cut Description" values={state.cut_description} onChange={e=>setState({...state,cut_description:e.target.value})} fullWidth />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField name='no_of_layers' variant="outlined" label="No Of Layers" values={state.no_of_layers} onChange={e=>setState({...state,no_of_layers:e.target.value})} fullWidth />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField name='part_name' variant="outlined" label="Part Name" values={state.part_name} onChange={e=>setState({...state,part_name:e.target.value})} fullWidth />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                    <Button 
                        color='primary' 
                        variant='contained' 
                        style={{color:'#fff',height:'50px'}} 
                        onClick={handleAdd}
                        fullWidth
                    >Add Cut job</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default withSnackbar(AddCutJob)