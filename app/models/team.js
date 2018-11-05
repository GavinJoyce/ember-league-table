import DS from 'ember-data';
import { computed } from '@ember/object';
import { union, filterBy, sum, mapBy } from '@ember/object/computed';

export default DS.Model.extend({
  name: DS.attr('string'),
  homeGames: DS.hasMany('game', { inverse: 'homeTeam' }),
  awayGames: DS.hasMany('game', { inverse: 'awayTeam' }),

  games: union('homeGames', 'awayGames'),

  homeGamesWon: filterBy('homeGames', 'isHomeWin'),
  awayGamesWon: filterBy('awayGames', 'isAwayWin'),
  gamesWon: union('homeGamesWon', 'awayGamesWon'),

  homeGamesLost: filterBy('homeGames', 'isAwayWin'),
  awayGamesLost: filterBy('awayGames', 'isHomeWin'),
  gamesLost: union('homeGamesLost', 'awayGamesLost'),

  gamesDrawn: filterBy('games', 'isDraw'),

  homeGoalsScoredArray: mapBy('homeGames', 'homeGoals'),
  homeGoalsScored: sum('homeGoalsScoredArray'),

  awayGoalsScoredArray: mapBy('awayGames', 'awayGoals'),
  awayGoalsScored: sum('awayGoalsScoredArray'),

  goalsScored: computed('homeGoalsScored', 'awayGoalsScored', function() {
    return this.homeGoalsScored + this.awayGoalsScored;
  }),

  homeGoalsConcededArray: mapBy('homeGames', 'awayGoals'),
  homeGoalsConceded: sum('homeGoalsConcededArray'),

  awayGoalsConcededArray: mapBy('awayGames', 'homeGoals'),
  awayGoalsConceded: sum('awayGoalsConcededArray'),

  goalsConceded: computed('homeGoalsConceded', 'awayGoalsConceded', function() {
    return this.homeGoalsConceded + this.awayGoalsConceded;
  }),

  goalDifference: computed('goalsScored', 'goalsConceded', function() {
    return this.goalsScored - this.goalsConceded;
  }),

  points: computed('gamesWon.length', 'gamesDrawn.length', function() {
    return (this.gamesWon.length * 3) + this.gamesDrawn.length;
  })



});
