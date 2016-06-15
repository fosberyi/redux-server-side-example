import { List, Map } from 'immutable'
import { expect } from 'chai'

import { setEntries, next, vote } from '../../src/core'

describe('application logic', () => {
  describe('function setEntries', () => {
    it('adds the entries to the state', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 Days Later']
      const nextState = setEntries(state, entries)

      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }))
    })
  })

  describe('function next', () => {
    it('sets the next 2 entries to the current vote pair', () => {
      const state = Map({
        entries: List.of(
          'Trainspotting',
          '28 Days Later',
          'Sunshine'
        )
      })

      const nextState = next(state)

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        }),
        entries: List.of('Sunshine')
      }))
    })

    it('puts winner of current vote back into entries', () => {
      const state = Map({
        entries: List.of('Sunshine', 'Terminator', 'Seven'),
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 5
          })
        })
      })

      const nextState = next(state)

      expect(nextState).to.equal(Map({
        entries: List.of('Seven', '28 Days Later'),
        vote: Map({
          pair: List.of('Sunshine', 'Terminator')
        })
      }))
    })

    it('in case of tie, it adds both back to entries', () => {
      const state = Map({
        entries: List.of('Sunshine', 'Terminator', 'Seven'),
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 3
          })
        })
      })

      const nextState = next(state)

      expect(nextState).to.equal(Map({
        entries: List.of('Seven', 'Trainspotting', '28 Days Later'),
        vote: Map({
          pair: List.of('Sunshine', 'Terminator')
        })
      }))
    })

    it('returns the winner when there is just one entry left', () => {
      const state = Map({
        entries: List(),
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 3
          })
        })
      })

      const nextState = next(state)

      expect(nextState).to.equal(Map({
        winner: 'Trainspotting'
      }))

    })

  })

  describe('function vote', () => {
    it('creates a tally if one DNE for the entry passed', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later')
      })
      const nextState = vote(state, 'Trainspotting')

      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 1
        })
      }))
    })

    it('adds 1 to the tally if entry already exists', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 2
        })
      })
      const nextState = vote(state, 'Trainspotting')

      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3
        })
      }))

    })
  })
})
