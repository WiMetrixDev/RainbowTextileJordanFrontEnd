import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';
import asyncComponent from './util/AsyncComponent'
import Signup from './containers/pages/Signup/Signup'
import Signin from './containers/pages/Signin/Signin'
// import App from './containers/App/App';
// import AppClinic from './containers/AppClinic/App';
// import AppAdmin from './containers/AppAdmin/App';
// import asyncComponent from './util/AsyncComponent';
// import Auth0 from './helpers/auth0';
// import { BrowserRouter } from 'react-router-dom'

const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLoggedIn ? (
        <Component {...props} />
      ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location },
            }}
          />
        )
    }
  />
);
const PublicRoutes = ({ history, isLoggedIn }) => {
  return (
    <ConnectedRouter history={history}>
      <div>
        <Route
          exact
          path={'/'}
          component={asyncComponent(() =>
            import('./containers/pages/Signin/Signin')
          )}
        />
        <Route
          exact
          path={'/home'}
          component={asyncComponent(() =>
            import('./containers/pages/ProductionTracking')
          )}
        />
        <Route
          exact
          path={'/production-tracking'}
          component={asyncComponent(() =>
            import('./containers/pages/ProductionTracking')
          )}
        />
        
        {/* <Route
          exact
          path={'/404'}
          component={asyncComponent(() => import('./containers/Page/404'))}
        />
        <Route
          exact
          path={'/500'}
          component={asyncComponent(() => import('./containers/Page/500'))}
        />
        <Route
          exact
          path={'/admin'}
          component={asyncComponent(() => import('./containers/Page/signinAdmin'))}
        />
        <Route
          exact
          path={'/doctors/signin'}
          component={asyncComponent(() => import('./containers/Page/signin'))}
        />
        <Route
          exact
          path={'/clinic/signin'}
          component={asyncComponent(() => import('./containers/Page/signinClinic'))}
        />
  
        <Route
          exact
          path={'/doctors/signup'}
          component={asyncComponent(() => import('./containers/Page/signup'))}
        />
        <Route
          exact
          path={'/clinics/signup'}
          component={asyncComponent(() => import('./containers/Page/SignupClinic'))}
        />

        <Route
          exact
          path={'/user/verify/:token'}
          component={asyncComponent(() => import('./containers/Page/verify'))}
        />
        <Route
          exact
          path={'/forgotpassword'}
          component={asyncComponent(() =>
            import('./containers/Page/forgotPassword')
          )}
        />
        <Route
          exact
          path={'/privacypolicy'}
          component={asyncComponent(() =>
            import('./containers/Footer/PrivacyPolicy')
          )}
        />
        <Route
          exact
          path={'/termsandconditions'}
          component={asyncComponent(() =>
            import('./containers/Footer/TermsAndConditions')
          )}
        />
        <Route
          exact
          path={'/team'}
          component={asyncComponent(() =>
            import('./containers/Footer/TheTeam')
          )}
        />
        <Route
          exact
          path={'/about'}
          component={asyncComponent(() =>
            import('./containers/Footer/About')
          )}
        />
        <Route
          exact
          path={'/resetpassword/:token'}
          component={asyncComponent(() =>
            import('./containers/Page/resetPassword')
          )}
        /> */}

        {/* <Route
          path="/auth0loginCallback"
          render={props => {
            Auth0.handleAuthentication(props);
          }}
        /> */}
        <PrivateRoute
          path="/signup"
          component={Signup}
          isLoggedIn={true}
        />
      </div>
    </ConnectedRouter>
  );
};

export default connect(state => ({
  isLoggedIn: state.Auth.idToken !== null,
}))(PublicRoutes);
