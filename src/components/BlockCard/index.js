import React from 'react'
import { Typography,CardActionArea } from '@material-ui/core'
import { withRouter } from 'react-router-dom'

const BlockCard = props => {

    return(
        <CardActionArea style={{backgroundColor:'#418832',color:'#fff',margin:20,width:220,height:220,flexDirection:'column',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'5px'}} onClick={()=>props.link?props.history.push(props.link):null}>
            <div>
                {props.children}
            </div>
            <Typography variant="subtitle2">{props.title}</Typography>
        </CardActionArea>
    )
}

export default withRouter(BlockCard)