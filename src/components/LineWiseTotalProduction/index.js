import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { XYPlot, VerticalBarSeries,XAxis,YAxis } from 'react-vis'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveBar = ({data}) => {
    
    console.log('data: ',data)
    
    return(
        <div>
            <XYPlot height={300} width={300} color="#418832">
            <XAxis
                attr="x"
                attrAxis="y"
                orientation="bottom"
            />
            <YAxis
                attr="y"
                attrAxis="x"
                orientation="left"
            />
                <VerticalBarSeries
                    data={data}
                    style={{}}
                />
            </XYPlot>
        </div>
    )
}



export default MyResponsiveBar