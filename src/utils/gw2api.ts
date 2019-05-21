type V2Meta = {
  routes: Array<{
    path: string,
    lang: boolean,
    auth: boolean,
    active: boolean
  }>
};

type Tokeninfo = {
  id: string,
  name: string,
  permissions: string[]
};

type Subtoken = {
  subtoken: string
};

export async function fetchV2Meta(): Promise<V2Meta> {
  return fetch('https://api.guildwars2.com/v2.json').then(r => r.json());
}

export async function fetchTokeninfo(token: string): Promise<Tokeninfo> {
  return fetch('https://api.guildwars2.com/v2/tokeninfo?access_token=' + token).then(r => r.json());
}

export async function generateSubtoken(token: string, routes: string[], permissions: string[]): Promise<Subtoken> {
  return fetch(`https://api.guildwars2.com/v2/createsubtoken?permissions=${permissions.join(',')}&urls=${routes.map((route) => encodeURIComponent(route)).join(',')}&access_token=${token}`).then(r => r.json());
}
