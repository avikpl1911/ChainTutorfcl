import * as fcl from "@onflow/fcl";
import { hasAccountCheck } from "./Userfunc";
import {query} from "@onflow/fcl"
export function Confg() {
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
}



export function outlog(){
    fcl.unauthenticate();
}


