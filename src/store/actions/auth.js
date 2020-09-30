import AsyncStorage from '@react-native-community/async-storage';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      'https://clinicareapiqa.sdglobaltech.com/ehr/mlogin',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessCode: email,
          password: password,
        }),
      },
    );

    // const response = await fetch('https://reqres.in/api/users', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     name: 'morpheus',
    //     job: 'leader',
    //   }),
    // });

    //  console.log('response.ok', response, response.ok);
    let message = 'Something went wrong';
    if (!response.ok) {
      throw new Error(message);
    } else if (response.ok) {
      const responseData = await response.json();
      if (
        responseData._status_Code === 406 ||
        responseData._status === 'error'
      ) {
        message = responseData._error_message;
        throw new Error(message);
      } else {
        //   console.log(responseData);
        const token = responseData.result.user.token;
        const userId = responseData.result.user._id;

        try {
          const jsonValue = JSON.stringify({
            token: token,
            userId: userId,
          });
          await AsyncStorage.setItem('userData', jsonValue);
        } catch (e) {
          console.log('error saving', e);
        }

        dispatch({
          type: LOGIN,
          token: token,
          userId: userId,
        });
      }
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    AsyncStorage.removeItem('userData');
    dispatch({
      type: LOGOUT,
    });
  };
};
