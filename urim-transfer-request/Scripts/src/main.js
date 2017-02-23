import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { AdminLayout } from './layout/AdminLayout'
import { UserLayout } from './layout/UserLayout'
import { App } from './layout/App.js'
import { fetchStartupData } from './actions/appActionCreators.js'
import { SettingsLayout } from './layout/SettingsLayout.js'

// render the app by passing in the router
const app = document.getElementById('app')
ReactDOM.render(
   <Router history={hashHistory}>
       <Route path='/' component={App}>
           <IndexRoute component={UserLayout} />
           <Route path='admin' component={AdminLayout} />
           <Route path='settings' component={SettingsLayout} />
       </Route>
   </Router>,
app)


// reset the back link to go to the records transfers site
document.getElementById('ctl00_BackToParentLink').setAttribute('href', 'https://urim-department.byu.edu/records_transfers')

// only fetch the startup data once when the app is loaded
fetchStartupData()
