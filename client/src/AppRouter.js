import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// Match 1-to-1 with each /pages component
import { Home, ApartmentListing, Login, Registration, UserProfile, ApartmentMap } from './pages';

export default function AppRouter() {
  return (
    <Router>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/registration">
            <Registration />
          </Route>
          <Route path="/users-profile">
            <UserProfile />
          </Route>
          <Route path="/map">
            <ApartmentMap />
          </Route>
          <Route path="/apartment">
            <ApartmentListing />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </Router>
  );
}
