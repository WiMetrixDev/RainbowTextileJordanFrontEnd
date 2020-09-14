import React from 'react'
import Header from '../../../components/ProductionTrackingHeader'
import Workers from '../../../components/Workers'
import Orders from '../../../components/Orders'
import Operations from '../../../components/Operations'
import Markers from '../../../components/Marker'
import RollIssuance from '../../../components/RollIssuance'
import CutJob from '../../../components/CutJob'
import CutReport from '../../../components/CutReport'
import StyleBulletin from '../../../components/StyleBulletin'
import IE from '../../../components/IECharts'
import PO from '../../../components/PO'
import AssignPOtoBundle from '../../../components/AssignPOtoBundle'
import ManualStocking from '../../../components/ManualStocking'
import CardAssignment from '../../../components/CardAssignment'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import ChartIcon from '@material-ui/icons/BarChart'
import { Typography } from '@material-ui/core'
import PackingList from '../../../components/PackingList'
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import HomeIcon from '@material-ui/icons/HomeWork';
import DeviceIcon from '@material-ui/icons/DeviceHub';
import SettingsIcon from '@material-ui/icons/Settings';
// import AppBar from '@material-ui/core/AppBar';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
//import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import PlanSimulate from '../../../components/PlanSimulate'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor:'#212121'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

const ProductionTracking = props => {
    const classes = useStyles();

    const [sptsValue,setSptsValue] = React.useState('') 

    return(<div>
        {/* <Header setSptsValue={setSptsValue} /> */}
        <div style={{paddingLeft:240,backgroundColor:'#fff'}}>

        <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {/* <div className={classes.toolbar} /> */}
            <div style={{display:'flex',justifyContent:'center',backgroundColor:'#212121',paddingTop:20,paddingBottom:20}}>
                <img src={require('../../../assets/WiMetrix.png')} alt="Logo" style={{width:190}}/>
            </div>
            <Divider />
            {/* <div style={{marginTop:20,paddingLeft:20,display:'flex',alignItems:'center'}}>
            <Typography variant="h6" color='primary'>
                Reports&nbsp;
            </Typography>
            <ChartIcon color='primary'/>
        </div> */}
        {/* <List style={{padding:10}}>
            <ListItem onClick={()=>setSptsValue('ieReport')} button key={'ieReport'} style={{backgroundColor:sptsValue === 'ieReport'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'IE Reports'} />
            </ListItem>
        </List> */}
        <div style={{marginTop:20,paddingLeft:20,display:'flex',alignItems:'center'}}>
            <Typography variant="h6" color='primary'>
                Warehouse&nbsp;
            </Typography>
            <HomeIcon color='primary'/>
        </div>
        <List style={{padding:10}}>
            <ListItem onClick={()=>setSptsValue('packingList')} button key={'packingList'} style={{backgroundColor:sptsValue === 'packingList'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'Packing List'} />
            </ListItem>
            <ListItem onClick={()=>setSptsValue('manualStocking')} button key={'manualStocking'} style={{backgroundColor:sptsValue === 'manualStocking'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'Manual Stocking'} />
            </ListItem>
            {/* <ListItem onClick={()=>setSptsValue('cardAssignment')} button key={'cardAssignment'} style={{backgroundColor:sptsValue === 'cardAssignment'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'Card Assignment'} />
            </ListItem> */}
            {/* <ListItem onClick={()=>setSptsValue('rollIssuance')} button key={'rollIssuance'} style={{backgroundColor:sptsValue === 'rollIssuance'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'Roll Issuance'} />
            </ListItem> */}
        </List>
        <Divider />
        <div style={{marginTop:20,paddingLeft:20,display:'flex',alignItems:'center'}}>
            <Typography variant="h6" color='primary'>
                Cutting&nbsp;
            </Typography>
            <DeviceIcon color='primary'/>
        </div>
        <List style={{padding:10}}>
            <ListItem onClick={()=>setSptsValue('marker')} button key={'marker'} style={{backgroundColor:sptsValue === 'marker'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'Marker'} />
            </ListItem>
            <ListItem onClick={()=>setSptsValue('po')} button key={'po'} style={{backgroundColor:sptsValue === 'po'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'PO'} />
            </ListItem>
            <ListItem onClick={()=>setSptsValue('cutJob')} button key={'cutJob'} style={{backgroundColor:sptsValue === 'cutJob'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'Cut Job'} />
            </ListItem>
            <ListItem onClick={()=>setSptsValue('cutReport')} button key={'cutReport'} style={{backgroundColor:sptsValue === 'cutReport'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'Cut Report'} />
            </ListItem>
            <ListItem onClick={()=>setSptsValue('assignPO')} button key={'assignPO'} style={{backgroundColor:sptsValue === 'assignPO'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'Assign PO to Bundle'} />
            </ListItem>
        </List>
        <Divider />
        <div style={{marginTop:20,paddingLeft:20,display:'flex',alignItems:'center'}}>
            <Typography variant="h6" color='primary'>
                SPTS&nbsp;
            </Typography>
            <SettingsIcon color='primary'/>
        </div>
        <List style={{padding:10}}>
            <ListItem onClick={()=>setSptsValue('workers')} button key={'workers'} style={{backgroundColor:sptsValue === 'workers'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'Workers'} />
            </ListItem>
            <ListItem onClick={()=>setSptsValue('orders')} button key={'orders'} style={{backgroundColor:sptsValue === 'orders'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'Orders'} />
            </ListItem>
            <ListItem onClick={()=>setSptsValue('operations')} button key={'operations'} style={{backgroundColor:sptsValue === 'operations'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'Operations'} />
            </ListItem>
            <ListItem onClick={()=>setSptsValue('styleBulletin')} button key={'styleBulletin'} style={{backgroundColor:sptsValue === 'styleBulletin'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'Style Bulletin'} />
            </ListItem>
            <ListItem onClick={()=>setSptsValue('planSimulate')} button key={'planSimulate'} style={{backgroundColor:sptsValue === 'planSimulate'?'#418832':'',color:'#fff'}}>
              <ListItemText primary={'Plan Simulate'} />
            </ListItem>
        </List>
      </Drawer>
      <div style={{padding:'30px 30px 10px',display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
      <Typography color='primary' style={{fontWeight:'500'}} variant="h4">Rainbow</Typography>
      <Link to='/'>
        <Typography color='primary' style={{fontWeight:'500'}} variant="subtitle">Logout</Typography>  
      </Link>
      </div>
      <div style={{margin:'0px 30px 10px',borderBottom:'1px solid lightgrey'}}>

      </div>
 
        {
            sptsValue === 'workers'?
            <Workers />
            :
            sptsValue === 'operations'?
            <Operations />
            :
            sptsValue === 'orders'?
            <Orders />
            :
            sptsValue === 'marker'?
            <Markers />
            :
            sptsValue === 'cutJob'?
            <CutJob />
            :
            sptsValue === 'cutReport'?
            <CutReport />
            :
            sptsValue === 'styleBulletin'?
            <StyleBulletin />
            :
            sptsValue === 'assignPO'?
            <AssignPOtoBundle />
            :
            sptsValue === 'po'?
            <PO />
            :
            sptsValue === 'packingList'?
            <PackingList />
            :
            sptsValue === 'manualStocking'?
            <ManualStocking />
            :
            sptsValue === 'rollIssuance'?
            <RollIssuance />
            :
            sptsValue === 'ieReport'?
            <IE />
            :
            sptsValue === 'cardAssignment'?
            <CardAssignment />
            :
            sptsValue === 'planSimulate'?
            <PlanSimulate />
            :
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:400}}>
                <div>
                    <div style={{textAlign:'center',marginBottom:20}}><InfoIcon color='primary' style={{fontSize:70}} /></div>
                    <div>
                        <Typography variant="h6" color='secondary'>
                            Select An Option
                        </Typography> 
                    </div>
                </div>
            </div>
        }
        </div>
    </div>)
}

export default ProductionTracking