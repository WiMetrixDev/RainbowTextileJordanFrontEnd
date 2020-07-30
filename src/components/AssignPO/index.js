import React from 'react'
import { Grid, TextField, Button, CircularProgress,Typography } from '@material-ui/core'
import { api_endpoint } from '../../util/config'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withSnackbar } from 'notistack';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const AssignPO = props => {

    const [state, setState] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    const [styles, setStyles] = React.useState([])
    const [colors, setColors] = React.useState([])
    const [cuts, setCuts] = React.useState([])
    const [pos, setPOs] = React.useState([])
    const [bundles, setBundles] = React.useState([])
    const [checked, setChecked] = React.useState(false);

  const handleChange = event => {
      console.log('check value: ',event.target.checked)
    setChecked(event.target.checked);
    if(event.target.checked===true){
        setState({...state,bundle:bundles})
    }else{
        setState({...state,bundle:null})
    }
  };

    const fetchStyles = () => {
        try {
            let url = api_endpoint + `/Jordan/SPTS/order/getStyleCodes.php`;
            console.log('url', url)
            fetch(url, {
                method: 'get',
            })
                .then(res => res.json())
                .then(res => {
                    console.log('res: ', res)
                    setStyles(res.Styles)
                })
                .catch(err => {
                    console.log('error while fetching', err)
                })
        } catch (err) {
            console.log('err in try catch', err)
        }
    }
    const fetchPOs = () => {
        try {
            let url = api_endpoint + `/Jordan/Cutting/PO/getPO.php`;
            console.log('url', url)
            fetch(url, {
                method: 'get',
            })
                .then(res => res.json())
                .then(res => {
                    console.log('res: ', res)
                    if(res.PO){
                        setPOs(res.PO)
                    }
                })
                .catch(err => {
                    console.log('error while fetching', err)
                })
        } catch (err) {
            console.log('err in try catch', err)
        }
    }
    // const handleSelectAll = () => {
    //     //set
    //     setState({...state,bundle:null})
    //     console.log('state',state,bundles)
    // }
    const fetchColorsForStyleCodes = () => {
        console.log('state', state)
        try {
            let url = api_endpoint + `/Jordan/SPTS/order/getColorsForStyleCode.php?style_code=${state.style}`;
            console.log('url', url)
            fetch(url, {
                method: 'get',
            })
                .then(res => res.json())
                .then(res => {
                    console.log('res: ', res)
                    if(res.Colors){
                        setColors(res.Colors)
                    }
                })
                .catch(err => {
                    console.log('error while fetching', err)
                })
        } catch (err) {
            console.log('err in try catch', err)
        }
    }
    const fetchCutForOrder = () => {
        console.log('state', state)
        try {
            let url = api_endpoint + `/Jordan/SPTS/cutReport/getCutsForOrder.php?order_id=${state.color.order_id}`;
            console.log('url', url)
            fetch(url, {
                method: 'get',
            })
                .then(res => res.json())
                .then(res => {
                    console.log('res cut: ', res)
                    if(res.Cuts){
                        setCuts(res.Cuts)
                    }
                })
                .catch(err => {
                    console.log('error while fetching', err)
                })
        } catch (err) {
            console.log('err in try catch', err)
        }
    }
    const fetchBundleForCut = () => {
        console.log('state', state)
        try {
            let url = api_endpoint + `/Jordan/SPTS/cutReport/getBundlesForOrderCut.php?order_id=${state.color.order_id}&cut_code=${state.cut.cut_code}`;
            console.log('url', url)
            fetch(url, {
                method: 'get',
            })
                .then(res => res.json())
                .then(res => {
                    console.log('res bundles: ', res)
                    if(res.Bundles){
                        setBundles(res.Bundles)
                    }
                })
                .catch(err => {
                    console.log('error while fetching', err)
                })
        } catch (err) {
            console.log('err in try catch', err)
        }
    }

    React.useEffect(() => {
        fetchStyles()
        fetchPOs()
    }, [])
    React.useEffect(() => {
        if(state.style){
            fetchColorsForStyleCodes()
        }
    }, [state.style])
    React.useEffect(() => {
        console.log('statte', state)
        if(state.color){
            fetchCutForOrder()
        }
    }, [state.color])
    React.useEffect(() => {
        console.log('statte', state)
        if(state.cut){
            fetchBundleForCut()
        }
    }, [state.cut])

    const handleAdd = async () => {
        console.log('state', state)
        if(state.bundle){
            setLoading(true)
            const bundlesToSend = await Promise.all(state.bundle.map(b => ({bundle_id:b.bundle_id})))
            console.log('bundlesToSend',bundlesToSend)
            try{
                    let url = api_endpoint+`/Jordan/Cutting/PO/assignPOtoBundle.php?PO_id=${state.po.po_id}&PO_code=${state.po.po_code}&remarks=${state.remarks}&bundle_mapping=${JSON.stringify(bundlesToSend)}`;
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
        // console.log({ 
        //     worker_code: state.workerId, 
        //     worker_name: state.workerName, 
        //     designator_id:state.designation.designation_id,
        //     designator_code:state.designation.designation_code,
        //     department_id:state.department.department_id,
        //     department_code:state.department.department_code
        // })
        
        // 

    }
    return (
        <div>
            <Grid container>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                            <Autocomplete
                                options={styles}
                                getOptionLabel={option => option.style_code}
                                style={{ width: '100%' }}
                                onChange={(e, v) => {if(v){setState({ ...state, style: v.style_code })}else{setState({ ...state, style: v })}}}
                                renderInput={params => (
                                    <TextField {...params} label="Style" variant="outlined" fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                            <Autocomplete
                                options={colors}
                                getOptionLabel={option => option.color}
                                style={{ width: '100%' }}
                                onChange={(e, v) => setState({ ...state, color: v })}
                                renderInput={params => (
                                    <TextField {...params} label="Color" variant="outlined" fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                            <Autocomplete
                                options={cuts}
                                getOptionLabel={option => option.cut_code.toString()}
                                style={{ width: '100%' }}
                                onChange={(e, v) => setState({ ...state, cut: v })}
                                renderInput={params => (
                                    <TextField {...params} label="Cut" variant="outlined" fullWidth />
                                )}
                            />
                            </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{ padding: 5 }}>
                            <Autocomplete
                                options={pos}
                                getOptionLabel={option => option.po_code}
                                style={{ width: '100%' }}
                                onChange={(e, v) => setState({ ...state, po: v })}
                                renderInput={params => (
                                    <TextField {...params} label="PO" variant="outlined" fullWidth />
                                )}
                            />
                        </Grid>
                        {
                            bundles && bundles.length > 0?
                            <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: 5 }}>
                                <FormControlLabel
                                    control={
                                    <Checkbox checked={checked}
                                    onChange={handleChange}
                                    value="primary"
                                    inputProps={{ 'aria-label': 'primary checkbox' }} />
                                    }
                                    label="Select All Bundles"
                                />
                            </Grid>
                            :null
                        }
                        <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: 5 }}>
                            {
                                checked === true?
                                <Typography variant="subtitle" color='primary' style={{marginBottom:10}}>* All Bundles Selected</Typography>
                                :
                                <Autocomplete
                                    options={bundles}
                                    multiple
                                    disableCloseOnSelect
                                    getOptionLabel={option => option.bundle_code}
                                    style={{ width: '100%' }}
                                    //value={state.bundle}
                                    onChange={(e, v) => setState({ ...state, bundle: v })}
                                    renderInput={params => (
                                        <TextField {...params} label="Bundle" variant="outlined" fullWidth />
                                    )}
                                />
                            }
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: 5 }}>
                            <TextField
                                variant="outlined"
                                multiline
                                rows={2}
                                fullWidth
                                label="Remarks"
                                onChange={(e) => setState({ ...state, remarks: e.target.value })}
                                // renderInput={params => (
                                //     <TextField {...params} label="Bundle" variant="outlined" fullWidth />
                                // )}
                            />
                        </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: 5 }}>
                    <Button
                        color='primary'
                        variant='contained'
                        style={{ color: '#fff', height: '50px' }}
                        onClick={handleAdd}
                        fullWidth
                    >{
                        loading===true?
                        <CircularProgress color={'#fff'} />
                        :
                        `Assign PO to Bundle`
                    }</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default withSnackbar(AssignPO)