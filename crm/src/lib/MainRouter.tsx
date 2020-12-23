import * as React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRouter";

import Signin from "../page/Auth";



import { isAuthenticated } from "../api/Auth";
import CreatePointPage, { CreatePointPageFn } from '../page/CreatePoint';

import {MenuHOC} from './MenuHoc';


export default class MainRouter extends React.Component {
    state = {
        collapsed: false,
        p:'123'
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    public render() {
        return (
            <div>
                <Switch>
                    {isAuthenticated() ? (
                           <>
                       <Route exact path="/" component={Signin} />
                                 <MenuHOC exact path="/create/point" component={CreatePointPage} /> 
                       </>
                    ) : (
                        <Route exact path="*" component={Signin} />
                    )}
                </Switch>
            </div>
        );
    }
}
