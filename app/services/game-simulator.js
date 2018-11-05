import Service from '@ember/service';
import { inject } from '@ember/service';
import { later } from '@ember/runloop';
import { shuffle } from 'ember-composable-helpers/helpers/shuffle';
import { computed } from '@ember/object';

let DELAY_BETWEEN_GAMES = 0;

export default Service.extend({
  store: inject(),

  teams: computed(function() {
    return this.store.peekAll('team');
  }),

  games: computed(function() {
    return this.store.peekAll('game');
  }),

  init() {
    this._super(...arguments);

    this.seedTeams();

    later(this, this.simulateGame, DELAY_BETWEEN_GAMES);
  },

  seedTeams() {
    let teamNames = [
      'Liverpool',
      'Chelsea',
      'Manchester City',
      'Arsenal',
      'Tottenham',
      'Bournmouth',
      'Watford',
      'Manchester United',
      'Everton',
      'Wolves',
      'Brighton',
      'Leicester City',
      'West Ham',
      'Crystal Palace',
      'Burnley',
      'Southamptom',
      'Cardiff City',
      'Fulham',
      'Newcastle United',
      'Huddersfield Town'
    ];

    for(let i=0; i<teamNames.length; i++) {
      this.store.createRecord('team', { id: i, name: teamNames[i] });
    }
  },

  simulateGame() {
    let teams = this.store.peekAll('team');

    let shuffledTeams = shuffle(teams);

    let homeTeam = shuffledTeams[0];
    let awayTeam = shuffledTeams[1];

    let homeGoals = this.randomScore(4);
    let awayGoals = this.randomScore(3);

    this.store.createRecord('game', {
      homeTeam,
      awayTeam,
      homeGoals,
      awayGoals,
      playedDate: new Date()
    });

    later(this, this.simulateGame, DELAY_BETWEEN_GAMES);
  },

  randomScore(maximumGoals) {
    return Math.round((Math.random() * maximumGoals))
  }
});
