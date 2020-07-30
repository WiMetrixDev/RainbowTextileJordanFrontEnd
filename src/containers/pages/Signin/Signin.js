import React from 'react'
import { Link } from "react-router-dom"
import { Grid, TextField, Button, Typography } from '@material-ui/core'
import Image from '../../../assets/528.jpg'
//import axios from 'axios';

const Signin = props => {

    const [state,setState] = React.useState({username:'',password:''})

    // React.useEffect(()=>{
    //     axios.get('/api/basic/list')
    //     .then(res => console.log('res.data.Basic: ',res.data.Basic))
    // },[])
    const handleChange = (e) => {
        setState({...state,[e.target.name]:e.target.value})
    }

    return (
        <div style={{backgroundColor:'#f6f6f6',height:'100vh',display:'grid',gridTemplateColumns:'40% 60%'}}>
            <div style={{ display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',backgroundColor:'black',color:'#fff',backgroundImage:`linear-gradient(to bottom, rgba(13, 81, 5, 0.9), rgba(37, 37, 37, 0.9)),
url(${Image})` }}>
                <h2 style={{fontSize:'40px'}}>Rainbow Textiles</h2>
                {/* <div style={{display:'flex',justifyContent:'center',paddingTop:0,paddingBottom:20}}>
                    <img src={require('../../../assets/rtl.jpg')} alt="Logo" style={{width:310}}/>
                </div> */}
                <h4>Sign In To Continue</h4>
            </div>
            <div style={{ padding: '0px 20px',display:'flex',flexDirection:'column',justifyContent:'center' }}>
                <Grid container style={{ display:'flex',justifyContent:'center'}}>
                    <Typography variant="h3" color='secondary' style={{textAlign:'center',fontWeight:'700'}}>Welcome to Smart Factory Management</Typography>
                </Grid>
                {/* <Grid container style={{ display:'flex',justifyContent:'center'}}>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                        <Typography variant="h6" color='primary' style={{textAlign:'center'}}>Sign In</Typography>
                    </Grid>
                </Grid> */}
                
                <Grid container style={{ display:'flex',justifyContent:'center',marginTop:50}}>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                        <TextField name="username" onChange={handleChange} value={state.username} label="Username" variant="outlined" fullWidth />
                    </Grid>
                    </Grid>
                <Grid container style={{ display:'flex',justifyContent:'center',marginTop:20 }}>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                        <TextField name="password" type="password" onChange={handleChange} value={state.password} label="Password" variant="outlined" fullWidth />
                    </Grid>
                </Grid>
                <Grid container style={{ display:'flex',justifyContent:'center',marginTop:20 }}>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                        <Button variant="contained" fullWidth style={{height:'50px',color:'#fff'}} color="primary" onClick={()=> props.history.push('/home')}>
                            Sign In
                        </Button>
                    </Grid>
                </Grid>
                <div style={{display:'flex',justifyContent:'center',paddingTop:40,paddingBottom:20}}>
                    <Typography variant='subtitle2' color='secondary'>Powered By</Typography>
                </div>
                <div style={{display:'flex',justifyContent:'center',paddingTop:0,paddingBottom:20}}>
                    <img src={require('../../../assets/WiMetrix.png')} alt="Logo" style={{width:210}}/>
                </div>
            </div>
        </div>
    )
}

export default Signin