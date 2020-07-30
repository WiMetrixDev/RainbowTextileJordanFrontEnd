import React from 'react'
import { Grid, TextField, Button, Menu, MenuItem, Typography, RadioGroup, Radio, FormControlLabel, CircularProgress } from '@material-ui/core'
import { api_endpoint,api_endpoint_warehouse } from '../../util/config'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withSnackbar } from 'notistack';
import { Dialog } from '@material-ui/core'
import uuid from 'uuid/v4'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import Table from '../Table'
import makeStyles from '@material-ui/styles/makeStyles'
import readXlsxFile from 'read-excel-file'
//import {EditableSelect} from 'react-editable-select';

const useStyles = makeStyles({
    addIcon:{position:'absolute',cursor:'pointer',right:20,zIndex:999,top:20,color:'#707070'}
})
const units = ['kgs','yds']
//const styles = 


const AddPackingList = props => {
    
    const classes = useStyles()
    const [value, setValue] = React.useState('kg');
    const [distance, setDistance] = React.useState('yd');
    const options = [{id:3,name:"Hamza"},{id:4,name:"Iqbal"}]
    let selectedOption = {id:3,name:"Hamza"}

    const handleChangeWeightUnit = event => {
        setValue(event.target.value);
    };
    const handleChangeLengthUnit = event => {
        setDistance(event.target.value);
    };

    const [unit,setUnit] = React.useState('kgs')
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [state,setState] = React.useState({})
    const [uploadVisible,setUploadVisible] = React.useState(false)
    const [filesState,setFilesState] = React.useState([])
    const [noOfRolls,setNoOfRolls] = React.useState(null)
    const [modalVisible, setModalVisible] = React.useState(false)
    const [loading,setLoading] = React.useState(false)
    const [excelLoading,setExcelLoading] = React.useState(false)
    //const [sizes,setSizes] = React.useState([])
    const [buyers,setBuyers] = React.useState([])
    const [lots,setLots] = React.useState([])
    const [styles,setStyles] = React.useState([])
    const [colors,setColors] = React.useState([])
    const [tableValues,setTableValues] = React.useState([])


    const toggleUploadVisible = () => {
        setUploadVisible(!uploadVisible)
    }
    //const [deparments,setDepartments] = React.useState([])

    // React.useEffect(()=>{
    //     //http://192.168.88.237/Jordan/Cutting/Marker/getSizes.php
    //     console.log('state',state)
    //     if(state.style){
    //         fetch(api_endpoint+`/Jordan/SPTS/order/getColorsForStyleCode.php?style_code=${state.style}`)
    //         .then(res => res.json()
    //         .then(res => {
    //             console.log('res colors',res)
    //             setColors(res.Colors)
    //         }))
    //         .catch(err => {
    //             console.log('err in fetch',err)
    //         })

    //     }
    // },[state.style])

    // React.useEffect(()=>{
    //     //http://192.168.88.237/Jordan/Cutting/Marker/getSizes.php
    //     if(state.size){
    //         setModalVisible(true)
    //     }
        
    // },[state.size])

    const handleAppend = async () => {
        console.log('handleAppend',state)
        let newArr = []
        for(let i=0; i<noOfRolls;i++){
            newArr.push({id:uuid(),...state})
        }
        setModalVisible(false)
        setTableValues(s => [...s,...newArr])
        setState({})
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
        fetch(api_endpoint+'/Jordan/SPTS/order/getColors.php')
        .then(res => res.json()
        .then(res => {
            console.log('res sized',res)
            setColors(res.Colors)
        }))
        .catch(err => {
            console.log('err in fetch',err)
        })
    },[])

    const handleFileUpload = (e) => {
        setExcelLoading(true)
        // console.log('e ',e)
        // console.log('e.target.files ',e.target.files)
        //setFilesState()
        try{

            readXlsxFile(e.target.files[0]).then(async (rows) => {
                let arr = []
                // console.log('rows: ',rows)
                for(let i=1; i<rows.length; i++){
                    let obj = {
                        InvoiceCode:rows[i][0],
                        Supplier:rows[i][1],
                        Buyer:rows[i][2],
                        StyleCode:rows[i][3],
                        ColorCode:rows[i][4],
                        LotCode:rows[i][5],
                        RollLength:rows[i][6],
                        NetWeight:rows[i][7],
                        GrossWeight:rows[i][8],
                        RollCode:rows[i][9],
                        Season:rows[i][10],
                        FabricType:rows[i][11],
                        // invoice_no:rows[i][0],
                        // supplier:rows[i][1],
                        // buyer:rows[i][2],
                        // style_code:rows[i][3],
                        // color:rows[i][4],
                        // lot:rows[i][5],
                        // length:rows[i][6],
                        // net_weight:rows[i][7],
                        // gross_weight:rows[i][8],
                        // roll_no:rows[i][9],
                        // season_code:rows[i][10],
                        // fabric_type:rows[i][11],
                        id:uuid()
                    }
                    arr.push(obj)
                }
                console.log('arr',arr)
                setTableValues(arr)
                setExcelLoading(false)
                // `rows` is an array of rows
                // each row being an array of cells.
              })
        }catch(err){
            console.log('errr',err)
            setExcelLoading(false)
        }

    }

    const handleAdd = async() => {
        
        console.log('state: ',state)
        
        setLoading(true)
        let temp = tableValues
        // console.log('value',value,tableValues)
        
        // if(value==='lb'){
        //     // console.log('hehre')
        //     temp = await Promise.all(temp.map(t => ({...t,net_weight:t.net_weight*0.4535,gross_weight:t.gross_weight*0.4535})))
        //     // setTableValues(temp)
        //     // console.log(2)
        // }
        
        // if(distance==='yd'){
        //     temp = await Promise.all(temp.map(t => ({...t,length:t.length*0.9144})))
        //     // setTableValues(temp)
        //     // console.log(4)
        // }
        setTableValues(temp)
        var ajaxTime= new Date().getTime();
        try{
            let url = api_endpoint_warehouse+`/insert/uploadPackingList`;
            console.log('url',url)
            fetch(url,{
                method: 'post',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({PackingList:temp})
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                console.log('res-------------------------------------------------------------------------------------: ',res)
                if(res.Error_No===0){
                    // setTableValues([])
                    var totalTime = new Date().getTime()-ajaxTime;
                    console.log('Response Time: ',parseInt(totalTime/1000),' seconds to add ',res.Responses.length,' items.')
                    props.enqueueSnackbar('Successfully Added Packing List!', { 
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
                props.enqueueSnackbar('Error While Adding Packing List!', { 
                    variant: 'info',
                })
            })
        }catch(err){
            console.log('err in try catch',err)
            setLoading(false)
            props.enqueueSnackbar('Error While Adding Packing List!', { 
                variant: 'info',
            })
        }

    }
    return (
        <div>
            <Dialog
                open={modalVisible}
            >
                <div style={{ padding: 20, width: 300 }}>
                    <div style={{textAlign:'center'}}><Typography variant="h6" style={{margin:15}}>Add Following Details</Typography></div>
                    <Grid container>

                        
                        {/* <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <EditableSelect
                                options={options}
                                value={selectedOption}
                                getOptionValue={(option) => option.id}
                                getOptionLabel={(option) => option.name}
                                createOption={(text) => { return {id: 1, name: text} }}
                                onChange={(ev, option) => setState({...state,option})}
                            />
                        </Grid> */}
                        
                        {/* <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                            <TextField value={state.rollNumber} onChange={e => setState({...state,rollNumber:e.target.value})} name="rollNumber" variant="outlined" fullWidth label="Roll Number"/>
                        </Grid> */}
                        <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                            <TextField value={noOfRolls} type="number" onChange={e => setNoOfRolls(e.target.value)} name="noOfRolls" variant="outlined" fullWidth label="Number of Rolls"/>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                            <Button color='primary' fullWidth onClick={handleAppend} variant="contained" style={{color:'#fff',height:50}}>
                                Generate
                            </Button>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                            <Button color='primary' fullWidth onClick={()=>setModalVisible(false)} variant="contained" style={{color:'#fff',height:50}}>
                                cancel
                            </Button>
                        </Grid>
                    </Grid>
                    
                    {/* <div style={{display:'flex',justifyContent:'space-between'}}>
                        
                        
                    </div> */}
                </div>
            </Dialog>
            <Grid container>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.InvoiceCode} onChange={e => setState({...state,InvoiceCode:e.target.value})} name="InvoiceCode" variant="outlined" fullWidth label="Invoice Number"/>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.Supplier} onChange={e => setState({...state,Supplier:e.target.value})} name="Supplier" variant="outlined" fullWidth label="Supplier"/>
                    {/* <Autocomplete
                        options={[{supplier:"1"},{supplier:"2"},{supplier:"3"}]}
                        getOptionLabel={option => option.supplier}
                        style={{ width: '100%' }}
                        onChange={(e,v) => {if(v){setState({...state,supplier:v.supplier})}}}
                        renderInput={params => (
                            <TextField {...params} label="Supplier" variant="outlined" fullWidth />
                        )}
                    /> */}
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.Buyer} onChange={e => setState({...state,Buyer:e.target.value})} name="Buyer" variant="outlined" fullWidth label="Buyer"/>
                    {/* <Autocomplete
                        //id="combo-box-demo"
                        options={buyers}
                        getOptionLabel={option => option.buyer_id}
                        style={{ width: '100%' }}
                        onChange={(e,v) => setState({...state,buyer:v})}
                        renderInput={params => (
                            <TextField {...params} label="Buyer" variant="outlined" fullWidth />
                        )}
                    /> */}
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <Autocomplete
                        //id="combo-box-demo"
                        options={styles}
                        getOptionLabel={option => option.style_code}
                        style={{ width: '100%' }}
                        onChange={(e,v) => {if(v){setState({...state,style_code:v.style_code})}else{setState({...state,style_code:v})}}}
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
                        onChange={(e,v) =>  {if(v){setState({...state,color:v.color})}else{setState({...state,color:v})}}}
                        renderInput={params => (
                            <TextField {...params} label="Color" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.lot} onChange={e => setState({...state,lot:e.target.value})} name="lot" variant="outlined" fullWidth label="Lot"/>
                </Grid>
                
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.length} type="number" onChange={e => setState({...state,length:e.target.value})} name="length" variant="outlined" fullWidth label={`Length (${distance})`}/>
                </Grid>
                
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.net_weight} type="number" onChange={e => setState({...state,net_weight:e.target.value})} name="net_weight" variant="outlined" fullWidth label={`Net Weight (${value})`} />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.gross_weight} type="number" onChange={e => setState({...state,gross_weight:e.target.value})} name="gross_weight" variant="outlined" fullWidth label={`Gross Weight (${value})`} />
                </Grid>
                
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.fabric_type} onChange={e => setState({...state,fabric_type:e.target.value})} name="fabric_type" variant="outlined" fullWidth label="Fabric Type"/>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.roll_no} onChange={e => setState({...state,roll_no:e.target.value})} name="roll_no" variant="outlined" fullWidth label="Roll No"/>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                <TextField value={state.season_code} onChange={e => setState({...state,season_code:e.target.value})} name="season_code" variant="outlined" fullWidth label="Season Code"/>
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={6} style={{padding:5,alignItems:'center'}}>
                    <RadioGroup aria-label="Unit" name="gender1" value={value} onChange={handleChangeWeightUnit} >
                        Select Unit For Weight: &nbsp;&nbsp;&nbsp;
                        <FormControlLabel value="kg" control={<Radio />} label="Kilograms" />
                        <FormControlLabel value="lb" control={<Radio />} label="Pounds" />
                    </RadioGroup>
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={6} style={{padding:5,alignItems:'center'}}>
                    <RadioGroup aria-label="Unit" name="length" value={distance} onChange={handleChangeLengthUnit} >
                        Select Unit For Length: &nbsp;&nbsp;&nbsp;
                        <FormControlLabel value="m" control={<Radio />} label="Meters" />
                        <FormControlLabel value="yd" control={<Radio />} label="Yards" />
                    </RadioGroup>
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={6} style={{padding:5}}>
                    <Button variant="contained" color='secondary' style={{height:"100%"}} onClick={()=>setModalVisible(true)} fullWidth>Generate List</Button>
                </Grid>
                {/* <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.no_of_plies} onChange={e => setState({...state,no_of_plies:e.target.value})} name="no_of_plies" variant="outlined" fullWidth label="No. of Plies"/>
                </Grid> */}
                {/* <Grid item lg={6} md={6} sm={6} xs={6} style={{padding:5}}>
                    <TextField value={state.po_description} onChange={e => setState({...state,po_description:e.target.value})} name="poDescription" variant="outlined" fullWidth label="PO Description"/>
                </Grid> */}
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                    <Typography onClick={toggleUploadVisible} variant="subtitle1" color='primary' style={{fontWeight:'700',cursor:'pointer'}}>Upload Spreadsheet Instead</Typography>
                    {
                        uploadVisible===true?
                        <input id="upload" type="file" onChange={handleFileUpload} />
                        :null
                    }
                    {
                        excelLoading===true?
                        <CircularProgress color='primary' size={15}/>
                        :null
                    }
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                    {
                        tableValues && tableValues.length > 0?
                        <Table setTableValues={setTableValues} tableValues={tableValues}/>
                        :null
                    }
                </Grid>
                {/* <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                    {
                        tableValues && tableValues.length > 0?
                        <table style={{width:'100%'}}>
                            <tr>
                                <th>Invoice Number</th>
                                <th>Supplier</th>
                                <th>Buyer</th>
                                <th>Style</th>
                                <th>Color</th>
                                <th>Lot</th> 
                                <th>Roll Number</th>
                                <th>Quantity</th>
                                <th>Net Weight</th>
                                <th>Gross Weight</th>
                                <th>Fabric Type</th>
                                <th style={{ width: '40px' }}></th>
                               
                            </tr>
                            {console.log('tableValues',tableValues)}
                            <tbody>
                                {
                                    tableValues.map(v => (
                                        <tr>
                                            <td>{v.invoiceNumber}</td>
                                            <td>{v.supplier}</td>
                                            <td>{v.buyer}</td>
                                            <td>{v.style?v.style.style_code:null}</td>
                                            <td>{v.color?v.color.color:null}</td>
                                            <td>{v.lot}</td>
                                            <td>{v.rollNumber}</td>
                                            <td>{v.quantity}</td>
                                            <td>{v.nw}</td>
                                            <td>{v.gw}</td>
                                            <td>{v.fabricType}</td>
                                            <td><DeleteIcon color='primary' style={{ cursor: 'pointer' }} onClick={()=>{
                                                setTableValues(draft => draft.filter(d => d.id !== v.id))
                                            }}/></td>
                                            
                                        </tr>
                                    ))
                                }
                                
                            </tbody>
                        </table>
                        :null
                    }

                </Grid> */}
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={()=>{setUnit('kgs');handleClose();}}>Kilograms</MenuItem>
                    <MenuItem onClick={()=>{setUnit('yds');handleClose();}}>Yards</MenuItem>
                </Menu>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{padding:5}}>
                    <Button 
                        color='primary' 
                        variant='contained' 
                        style={{color:'#fff',height:'50px'}} 
                        onClick={handleAdd}
                        fullWidth
                    >
                        {
                            loading === true?
                            <CircularProgress color='#fff'/>
                            :
                            `Upload Packing List`
                        }
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default withSnackbar(AddPackingList)