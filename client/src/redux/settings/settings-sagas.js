import { delay } from 'redux-saga';
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';

import {
  updateUserFlagComplete,
  updateUserFlagError,
  validateUsernameComplete,
  validateUsernameError,
  submitNewAboutComplete,
  submitNewAboutError,
  submitNewUsernameComplete,
  submitNewUsernameError
} from './';
import {
  getUsernameExists,
  putUpdateMyAbout,
  putUpdateMyUsername,
  putUpdateUserFlag
} from '../../utils/ajax';
import { createFlashMessage } from '../../components/Flash/redux';

function* submitNewAboutSaga({ payload }) {
  try {
    const { data: response } = yield call(putUpdateMyAbout, payload);
    yield put(submitNewAboutComplete({ ...response, payload }));
    yield put(createFlashMessage(response));
  } catch (e) {
    yield put(submitNewAboutError(e));
  }
}

function* submitNewUsernameSaga({ payload: username }) {
  try {
    const { data: response } = yield call(putUpdateMyUsername, username);
    yield put(submitNewUsernameComplete({ ...response, username }));
    yield put(createFlashMessage(response));
  } catch (e) {
    yield put(submitNewUsernameError(e));
  }
}

function* updateUserFlagSaga({ payload: update }) {
  try {
    const { data: response } = yield call(putUpdateUserFlag, update);
    yield put(updateUserFlagComplete({ ...response, payload: update }));
    yield put(createFlashMessage(response));
  } catch (e) {
    yield put(updateUserFlagError(e));
  }
}

function* validateUsernameSaga({ payload }) {
  try {
    yield delay(500);
    const {
      data: { exists }
    } = yield call(getUsernameExists, payload);
    yield put(validateUsernameComplete(exists));
  } catch (e) {
    yield put(validateUsernameError(e));
  }
}

export function createSettingsSagas(types) {
  return [
    takeEvery(types.updateUserFlag, updateUserFlagSaga),
    takeLatest(types.submitNewAbout, submitNewAboutSaga),
    takeLatest(types.submitNewUsername, submitNewUsernameSaga),
    takeLatest(types.validateUsername, validateUsernameSaga)
  ];
}