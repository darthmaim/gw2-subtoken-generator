import React, { Component } from 'react';
import './App.css';
import { fetchV2Meta, fetchTokeninfo, generateSubtoken } from './utils/gw2api';
import { ObjectMap } from './utils/types';
import { arrayToBoolMap } from './utils/helper';

interface AppState {
  apiKey: string,
  locked: boolean,
  routes: ObjectMap<boolean>,
  expires: Date | null,
  permissions: ObjectMap<boolean>,
  subtoken: string,
};

class App extends Component<{}, AppState> {
  state = {
    apiKey: '',
    locked: false,
    routes: {},
    expires: null,
    permissions: {},
    subtoken: ''
  } as AppState;

  async componentDidMount() {
    // lets fetch all available routes
    const meta = await fetchV2Meta();

    // and filter them to the interesting ones (active and authenticated)
    const routes = arrayToBoolMap(
      meta.routes
        .filter((route) => route.active && route.auth)
        .map((route) => route.path)
    );

    this.setState({ routes })
  }

  async loadToken(e: React.FormEvent) {
    e.preventDefault();

    this.setState({ locked: true });

    try {
      const tokeninfo = await fetchTokeninfo(this.state.apiKey);

      const permissions = arrayToBoolMap(tokeninfo.permissions);

      this.setState({ permissions });

    } catch {
      this.setState({ locked: false });
    }
  }

  async generateSubtoken() {
    const { apiKey, routes, permissions } = this.state;

    const mapToArray = (map: ObjectMap<boolean>): string[] =>
      Object.entries(map).filter(([, checked]) => checked).map(([entry]) => entry);

    const { subtoken } = await generateSubtoken(apiKey, mapToArray(routes), mapToArray(permissions));

    this.setState({ subtoken });
  }

  render() {
    const { apiKey, locked, routes, permissions, subtoken } = this.state;

    return (
      <div>
        <form onSubmit={(e) => this.loadToken(e)}>
          <input value={apiKey} onChange={(e) => this.setState({ apiKey: e.target.value })} disabled={locked}/>
          <button type="submit" disabled={locked}>Continue</button>
        </form>
        <hr/>
        {Object.entries(routes).map(([route, checked]) => (
          <label style={{display: 'block'}}>
            <input type="checkbox" checked={checked} onChange={() => this.setState({ routes: { ...routes, [route]: !checked } })}/>
            {route}
          </label>
        ))}
        {Object.entries(permissions).map(([permission, checked]) => (
          <label style={{display: 'block'}}>
            <input type="checkbox" checked={checked} onChange={() => this.setState({ permissions: { ...permissions, [permission]: !checked } })}/>
            {permission}
          </label>
        ))}
        <button onClick={() => this.generateSubtoken()}>Generate Subtoken</button>
        <input readOnly value={subtoken}/>
      </div>
    );
  }
}

export default App;
