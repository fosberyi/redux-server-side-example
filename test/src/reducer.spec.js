import { Map, fromJS } from 'immutable'
import { expect } from 'chai'

import reducer from '../../src/reducer'

describe('reducer', () => {
  it('handles SET_ENTRIES', () => {
    const initState = Map();
    const entries = ['Trainspotting']
    const action = { type: 'SET_ENTRIES', entries: entries }
    const nextState = reducer(initState, action)

    expect(nextState).to.equal(fromJS({
      entries: entries
    }))
  })

  it('handles NEXT', () => {
    const entries = ['Trainspotting', '28 Days Later']
    const initState = fromJS({
      entries: entries
    })
    const action = { type: 'NEXT' }
    const nextState = reducer(initState, action)

    expect(nextState).to.equal(fromJS({
      entries: [],
      vote: {
        pair: entries
      }
    }))
  })

  it('handles VOTE', () => {
    const initState = fromJS({
      entries: [],
      vote: {
        pair: ['Trainspotting', '28 Days Later']
      }
    })
    const action = { type: 'VOTE', entry: 'Trainspotting' }
    const nextState = reducer(initState, action)

    expect(nextState).to.equal(fromJS({
      entries: [],
      vote: {
        pair: ['Trainspotting', '28 Days Later'],
        tally: { 'Trainspotting': 1 }
      }
    }))
  })

  it('sets an initial state on undefined', () => {
    const entries = ['Trainspotting', '28 Days Later']
    const action = { type: 'SET_ENTRIES', entries: entries }
    const nextState = reducer(undefined, action)

    expect(nextState).to.equal(fromJS({
      entries: entries
    }))
  })

  it('respects the contract of the reduce callback', () => {
    const actions = [
      { type: 'SET_ENTRIES', entries: ['Trainspotting', 'Sunshine'] },
      { type: 'NEXT' },
      { type: 'VOTE', entry: 'Trainspotting' },
      { type: 'VOTE', entry: 'Trainspotting' },
      { type: 'VOTE', entry: 'Sunshine' },
      { type: 'VOTE', entry: 'Trainspotting' },
      { type: 'VOTE', entry: 'Trainspotting' },
      { type: 'NEXT' }
    ]

    const finalState = actions.reduce(reducer, undefined)

    expect(finalState).to.equal(fromJS({
      winner: 'Trainspotting'
    }))
  })
})
