import React from 'react';
import PropTypes from 'prop-types';
//import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import AddRollIssuance from '../AddRollIssuance'
// import MarkersTable from '../MarkersTable'
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 500,
    },
}));


const RollIssuance = props => {

    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };


    return (
        <div style={{ padding: 20 }}>
            <div style={{ textAlign: 'center' }}><Typography variant="h6">Roll Issuance</Typography></div>
            <div style={{display:'flex',justifyContent:'center'}}>
                <div style={{width:'100%'}}>
                    <AppBar position="static" color="secondary" style={{marginTop:15,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                        <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="#fff"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                        >
                        <Tab label="Add roll Issuance" {...a11yProps(0)} style={{color:'#fff',borderBottom:value===0?'3px solid white':''}} />
                        {/* <Tab label="Stock out" {...a11yProps(1)} style={{color:'#fff',borderBottom:value===1?'3px solid white':''}}/> */}
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0} dir={theme.direction} style={{backgroundColor:'#f6f6f6',borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                        <AddRollIssuance/>
                        {/* <div>asdf</div> */}
                    </TabPanel>
                    {/* <TabPanel value={value} index={1} dir={theme.direction} style={{backgroundColor:'#f6f6f6',borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                        <ViewPackingList/>
                        <MarkersTable />
                    </TabPanel> */}
                </div>
            </div>
        </div>
    )

}

export default RollIssuance