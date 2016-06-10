import { expect } from 'chai'
import { List, Map } from 'immutable'

describe('immutability', () => {
  describe('A List', () => {

    function addMovie(currentStateMap, movie) {
      return currentStateMap.update('movies', movies => movies.push(movie))
    }

    it('is immutable', () => {
      let state = Map({
        movies: List.of('Trainspotting', '28 Days Later')
      })
      let nextState = addMovie(state, 'Sunshine')

      expect(nextState).to.equal(Map({
        movies: List.of(
          'Trainspotting',
          '28 Days Later',
          'Sunshine'
        )
      }))

      expect(state).to.equal(Map({
        movies: List.of(
          'Trainspotting',
          '28 Days Later'
        )
      }))

    })
  })
})
