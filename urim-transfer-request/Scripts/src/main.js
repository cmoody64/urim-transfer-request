import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { AdminLayout } from './layout/AdminLayout'
import { UserLayout } from './layout/UserLayout'
import { App } from './layout/App.js'
import { fetchStartupData } from './actions/appActionCreators.js'

const app = document.getElementById('app')
ReactDOM.render(
   <Router history={hashHistory}>
       <Route path='/' component={App}>
           <IndexRoute component={UserLayout} />
           <Route path='admin' component={AdminLayout} />
       </Route>
   </Router>,
app)

// only fetch the startup data once when the app is loaded
fetchStartupData()
