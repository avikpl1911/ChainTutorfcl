import { render } from 'preact'
import { App } from './app.jsx'
import './index.css'
import { Confg } from './smartcontracts/reactfunccad/Auth.jsx'
import * as fcl from "@onflow/fcl";
fcl.config({
    "app.detail.title": "ChainTutor",
   
    "discovery.wallet.method.default": "IFRAME/RPC",
  
  
  "app.detail.icon": "/logom.png",
  "service.OpenID.scopes": "email",
  "fcl.appDomainTag": "harness-app",
  "flow.network": "local",
  "env": "local",
  "accessNode.api": "http://localhost:8888",
  "discovery.wallet": "http://localhost:8701/fcl/authn",
  
  });


render(<App/>, document.getElementById('app'))


