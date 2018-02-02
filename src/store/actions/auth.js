import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error,
  };
};

export const logout = () => {
  // clear local storage
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT,
  }
}

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email,
      password,
      returnSecureToken: true,
    };

    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyC7M02P8QQ2HZpFKCyAvnOWC4Mv5sYiSCM';
    if (!isSignUp){
      url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyC7M02P8QQ2HZpFKCyAvnOWC4Mv5sYiSCM';
    }

    axios.post(url, authData)
      .then(response => {
        // create the expiration date when the token was authenticated
        // get the currentdate -> get the time + the expiration date from firebase in seconds
        // convert to milisec.  convert new time to the new expiration date
        const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
        // save local storage, set item 'token', 2nd param is id,
        localStorage.setItem('token', response.data.idToken);
        // keep track of expiration date
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', response.data.localId);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch( err => {
        console.log(err);
        dispatch(authFail(err.response.data.error));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  console.log('auth redirect path', path);
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path,
  }
}

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if(!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()){
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
      }
    }
  }
};
