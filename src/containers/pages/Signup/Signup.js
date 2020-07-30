import React from 'react'
import { Link } from "react-router-dom"
//import axios from 'axios';

const Signup = () => {


    // React.useEffect(()=>{
    //     axios.get('/api/basic/list')
    //     .then(res => console.log('res.data.Basic: ',res.data.Basic))
    // },[])

    return (
        <>
            <div style={{ padding: '0px 20px' }}>
                <h2>Sign Up</h2>
                <p>Welcome to sign up page. Click <Link to="/">here</Link> to go back!</p>
            </div>
        </>
    )
}

export default Signup