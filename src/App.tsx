import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Home } from "./pages/Home";

const routes = [
    {
        path: "/",
        exact: true,
        component: Home,
    },
];

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    {routes.map((route) => (
                        <Route
                            path={route.path}
                            component={route.component}
                            key={route.path}
                        />
                    ))}
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
