import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
//import Button from '@material-ui/core/Button';
//import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/HomeWork';
import DeviceIcon from '@material-ui/icons/DeviceHub';
import SignoutIcon from '@material-ui/icons/LastPage';
import SettingsIcon from '@material-ui/icons/Settings';
import CssBaseline from '@material-ui/core/CssBaseline';
import Menu from '@material-ui/core/Menu';
import { withRouter } from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display:'flex'
    //zIndex:2000
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const ButtonAppBar = props => {
  const classes = useStyles();
  const [anchorElSPTS, setAnchorElSPTS] = React.useState(null);
  const [anchorElWarehouse, setAnchorElWarehouse] = React.useState(null);
  const [anchorElCut, setAnchorElCut] = React.useState(null);

  const handleClick = (event,arg) => {
    console.log('asdaf',event,arg)
    if(arg === 'spts'){
      setAnchorElSPTS(event.currentTarget);
    }else if(arg === 'cutting'){
      setAnchorElCut(event.currentTarget);
    }else if(arg === 'warehouse'){
      setAnchorElWarehouse(event.currentTarget);
    }
  };

  const handleCloseSPTS = () => {
    setAnchorElSPTS(null);
  };
  const handleCloseCut = () => {
    setAnchorElCut(null);
  };
  const handleCloseWarehouse = () => {
    setAnchorElWarehouse(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{backgroundColor:'#fff',color:'#418832'}}>
        <CssBaseline />
        <Toolbar style={{display:'flex',justifyContent:'space-between'}}>
            <div>
                <img src={require('../../assets/WiMetrix.png')} alt="Logo" style={{width:120}}/>
            </div>
            <div style={{display:'flex',justifyContent:'center'}}>
              <Typography color='secondary' variant="h5">Rainbow</Typography>
            {/* <div style={{margin:15,display:'flex',justifyContent:'center',cursor:'pointer'}} aria-controls="simple-menu" aria-haspopup="true" onClick={e => handleClick(e,'warehouse')}>
                    <HomeIcon />&nbsp;
                    <Typography variant="subtitle1">Warehouse</Typography>
                </div>
                <div style={{margin:15,display:'flex',justifyContent:'center',cursor:'pointer'}} aria-controls="simple-menu" aria-haspopup="true" onClick={e => handleClick(e,'cutting')}>
                    <DeviceIcon/>&nbsp;
                    <Typography variant="subtitle1">Cutting</Typography>
                </div>
                <div style={{margin:15,display:'flex',justifyContent:'center',cursor:'pointer'}} aria-controls="simple-menu" aria-haspopup="true" onClick={e => handleClick(e,'spts')}>
                    <SettingsIcon/>&nbsp;
                    <Typography variant="subtitle1">SPTS</Typography>
                </div> */}
                {/* <Menu
                    id="simple-menu-spts"
                    anchorEl={anchorElSPTS}
                    //keepMounted
                    open={Boolean(anchorElSPTS)}
                    onClose={handleCloseSPTS}
                >
                    <MenuItem onClick={()=>{
                        props.setSptsValue('workers')
                        handleCloseSPTS()
                    }}>Workers</MenuItem>
                    <MenuItem onClick={()=>{
                        props.setSptsValue('orders')
                        handleCloseSPTS()
                    }}>Orders</MenuItem>
                    <MenuItem onClick={()=>{
                        props.setSptsValue('operations')
                        handleCloseSPTS()
                    }}>Operations</MenuItem>
                    <MenuItem onClick={()=>{
                        props.setSptsValue('styleBulletin')
                        handleCloseSPTS()
                    }}>Style Bulletin</MenuItem>
                </Menu>
                <Menu
                    id="simple-menu-cut"
                    anchorEl={anchorElCut}
                    //keepMounted
                    open={Boolean(anchorElCut)}
                    onClose={handleCloseCut}
                >
                    <MenuItem onClick={()=>{
                        props.setSptsValue('marker')
                        handleCloseCut()
                    }}>Marker</MenuItem>
                    <MenuItem onClick={()=>{
                        props.setSptsValue('po')
                        handleCloseCut()
                    }}>PO</MenuItem>
                    <MenuItem onClick={()=>{
                        props.setSptsValue('cutJob')
                        handleCloseCut()
                    }}>Cut Job</MenuItem>
                    <MenuItem onClick={()=>{
                        props.setSptsValue('cutReport')
                        handleCloseSPTS()
                    }}>Cut Report</MenuItem>
                    <MenuItem onClick={()=>{
                        props.setSptsValue('assignPO')
                        handleCloseCut()
                    }}>Assign PO to Bundle</MenuItem>
                </Menu>
                <Menu
                    id="simple-menu-cut"
                    anchorEl={anchorElWarehouse}
                    //keepMounted
                    open={Boolean(anchorElWarehouse)}
                    onClose={handleCloseWarehouse}
                >
                    <MenuItem onClick={()=>{
                        props.setSptsValue('packingList')
                        handleCloseWarehouse()
                    }}>Packing List</MenuItem>
                </Menu> */}
            </div>
            <div style={{display:'flex',alignItems:'center',cursor:'pointer'}} onClick={()=>props.history.push('/')}>
                <Typography variant="subtitle1" style={{cursor:'pointer'}}>Logout</Typography>
                <SignoutIcon />
            </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(ButtonAppBar)