import Datastore from 'nedb';
import path from 'path';
import { app } from 'electron';
import * as I from './../types/interfaces';

const directory = path.join(app.getPath('userData'), 'databases');

export default {
    players: new Datastore<I.Player>({ filename: path.join(directory, 'players'), autoload: true }),
    teams: new Datastore<I.Team>({ filename: path.join(directory, 'teams'), autoload: true }),
    config: new Datastore<I.Config>({ filename: path.join(directory, 'config'), autoload: true }),

}
