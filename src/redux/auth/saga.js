// import { all, takeEvery, put, fork } from 'redux-saga/effects';
// //import { push } from 'react-router-redux';
// import actions from './actions';


// export function* basic_fetch() {

//     yield takeEvery('BASIC_FETCH', function* ({ payload }) {

//         yield console.log('In Basic Fetch Saga..', payload)

//         yield put({ type: actions.TOGGLE_LOADER, payload: true })

//         try {
//             const response = yield fetch('https://api.myjson.com/bins/1etsk2')
//             console.log(`response ------------> `, response)
//             yield put({ type: actions.TOGGLE_LOADER, payload: false })

//         } catch (error) {
//             console.log(`error ------------> `, error)
//             yield put({ type: actions.TOGGLE_LOADER, payload: false })
//         }

//     })

// }


// export default function* rootSaga() {
//     yield all([
//         fork(basic_fetch),
//     ])
// }  