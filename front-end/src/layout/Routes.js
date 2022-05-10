import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservations from "../reservations/NewReservations";
import NewTable from "../table/NewTable";
import NewSeating from "../seating/NewSeating";
import SearchPhoneNumber from "../search/SearchPhoneNumber";
import EditReservation from "../reservations/EditReservation";
import InputForm from "../reservations/InputForm";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact path={'/reservations/new'}>
        <InputForm />
      </Route>
      <Route exact path={`/reservations/:reservation_id/seat`}>
        <NewSeating />
      </Route>
      <Route exact path={`/reservations/:reservation_id/edit`}>
        <EditReservation />
      </Route>
      <Route exact path ={`/tables/new`} >
        <NewTable />
      </Route>
      <Route exact path ={`/search`} >
        <SearchPhoneNumber />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
