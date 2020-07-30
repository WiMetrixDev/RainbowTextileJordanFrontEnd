import React from 'react'
import { connect } from "react-redux";
import authActions from '../../../redux/auth/actions'
//import { Link } from 'react-router-dom'
import BlockCard from '../../../components/BlockCard'
import HomeIcon from '@material-ui/icons/HomeWork'
import DashboardIcon from '@material-ui/icons/Dashboard'
import CalendarViewIcon from '@material-ui/icons/CalendarViewDay'
import DeviceHubIcon from '@material-ui/icons/DeviceHub'
import { Typography } from '@material-ui/core';
const { basicFetch } = authActions

const Home = props => {

    const { loading, basicFetch } = props;
    console.log(`Landing page. Loading value: `,loading)

    React.useEffect(()=>{
        basicFetch()
    },[])

    return (
        <>
            <div style={{padding:'0px 20px',textAlign:'center',marginTop:60}}>
                <h2 color='primary'>Smart Factory Management Software</h2>
                <div style={{marginTop:'50px',display:'flex',justifyContent:'center'}}>
                    <BlockCard title="Warehouse Management">
                        <HomeIcon style={{fontSize:40}} />
                    </BlockCard>
                    <BlockCard title="Cutting Management">
                        <DeviceHubIcon style={{fontSize:40}} />
                    </BlockCard>
                    <BlockCard title="Production Tracking" link={'/production-tracking'}>
                        <DashboardIcon style={{fontSize:40}} />
                    </BlockCard>
                    <BlockCard title="Asset Tracking">
                        <CalendarViewIcon style={{fontSize:40}} />
                    </BlockCard>
                </div>
            </div>
            {/* <div style={{display:'flex',justifyContent:'space-between',color:'grey',padding:20,marginTop:50}}>
                <Typography variant="caption">Ver 1.31</Typography>
                <Typography variant="caption">Copyright 2019. All rights reserved</Typography>
                <Typography variant="caption">Powered by WIMETRIX</Typography>
            </div> */}
        </>
    )


}

export default connect(
    state => ({
        loading: state.Auth.loading
    }),
    { basicFetch }
)(Home)