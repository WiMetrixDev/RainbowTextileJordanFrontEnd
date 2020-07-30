import React from 'react'
import { Paper,Typography, Grid } from '@material-ui/core'
import LineWiseTotalProduction from '../LineWiseTotalProduction'

const data = [
    {
        x: 0,
        y: 10
    },
    {
        x: 1,
        y: 11.248257034033035
    },
    {
        x: 2,
        y: 12.20577945795663
    },
    {
        x: 3,
        y: 12.801326795474443
    },
    {
        x: 4,
        y: 13.132807927572742
    },
    {
        x: 5,
        y: 15.841383594752223
    },
    {
        x: 6,
        y: 15.732741198841865
    },
    {
        x: 7,
        y: 13.287092723327687
    },
    {
        x: 8,
        y: 11.113246356017706
    }
    ]

const IECharts = props => {



    return(<div style={{ padding: 20 }}>
        <Paper style={{padding:20,backgroundColor:'#f6f6f6'}}>
            <Grid container>
                <Grid item lg={4} md={4} sm={6} xs={12} style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                    <Typography variant="h6" style={{marginBottom:20}}>Line Wise Total Production</Typography>
                    <LineWiseTotalProduction data={data} />
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={12} style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                    <Typography variant="h6" style={{marginBottom:20}}>WIP</Typography>
                    <LineWiseTotalProduction data={data} />
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={12} style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                    <Typography variant="h6" style={{marginBottom:20}}>Worker Wise Fault Monitoring</Typography>
                    <LineWiseTotalProduction data={data} />
                </Grid>
            </Grid>
        </Paper>
        </div>)
}

export default IECharts