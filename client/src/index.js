import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import './index.css'
const store = createStore(reducers, compose(applyMiddleware(thunk)))

ReactDOM.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId='782890467426-g7ofr0phuq64i978i3gaksbjfovh570t.apps.googleusercontent.com'>
      <App />
    </GoogleOAuthProvider>
  </Provider>,
  document.getElementById('root')
)
