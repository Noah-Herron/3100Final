/******************************************************
*   Authors:      Aidan Whitman & Noah Herron         *
*   Start Date:   03/03/2025                          *
*   Last Updated: 03/04/2025                          *
*   Description:  This file contains the JavaScript   *
*                 for the index.html page.            *
*   Class:        CSC 3100                            *
******************************************************/

//RegEx Expressions
var passwordRegEx = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-=+/])[A-Za-z\d!@#$%^&*-=+/]{8,}$/;
var emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
var tNumberRegEx = /^T\d{8}$/;

//These functions bring up the login and sign up modals
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#btnShowSignUp').addEventListener('click', function() {
    document.querySelector('#signUpCard').style.display = 'block';
    document.querySelector('#loginCard').style.display = 'none';
  });

  document.querySelector('#btnCloseSignUp').addEventListener('click', function() {
    document.querySelector('#signUpCard').style.display = 'none';
  });

  document.querySelector('#btnShowLogin').addEventListener('click', function() {
    document.querySelector('#loginCard').style.display = 'block';
    document.querySelector('#signUpCard').style.display = 'none';
  });

  document.querySelector('#btnCloseLogin').addEventListener('click', function() {
    document.querySelector('#loginCard').style.display = 'none';
  });
});

//This function handles the sign up button
document.querySelector('#btnSignUp').addEventListener('click', function(event) {
  //Prevents the race condition
  event.preventDefault();

  //Gets the parameters entered in the form
  const username = document.querySelector('#signUpUsername').value;
  const password = document.querySelector('#signUpPassword').value;
  const confirmPassword = document.querySelector('#signUpConfirmPassword').value;
  const email = document.querySelector('#signUpEmail').value;
  const tNumber = document.querySelector('#signUpTNumber').value;
  const firstName = document.querySelector('#signUpFirstName').value;
  const lastName = document.querySelector('#signUpLastName').value;

  //Base variables for error checking
  let message = '';
  let blnError = false;

  //All these check the values in the form
  if (username.length < 5) {
    message += 'Username must be at least 5 characters.\n';
    blnError = true;
  }

  if (!passwordRegEx.test(password)) {
    message += 'Password must be at least 8 characters, contain at least one uppercase letter, one number, and one special character.\n';
    blnError = true;
  }

  if (!passwordRegEx.test(confirmPassword)) {
    message += 'Confirm Password must be at least 8 characters, contain at least one uppercase letter, one number, and one special character.\n';
    blnError = true;
  }

  if (password != confirmPassword) {
    message += 'Passwords do not match.\n';
    blnError = true;
  }

  if (!emailRegEx.test(email)) {
    message += 'Invalid email address.\n';
    blnError = true;
  }

  if (!tNumberRegEx.test(tNumber)) {
    message += 'Invalid T-Number.\n';
    blnError = true;
  }

  if (firstName.length < 1) {
    message += 'First name is required.\n';
    blnError = true;
  }

  if (lastName.length < 1) {
    message += 'Last name is required.\n';
    blnError = true;
  }

  //If there is an error, display the error
  if (blnError) {
    Swal.fire({
      icon: 'error',
      title: 'Error with parameters!',
      text: message
    });
    return;
  }

  //If there is no error, send the data to the server
  fetch('/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password,
      email: email,
      tNumber: tNumber,
      firstName: firstName,
      lastName: lastName
    })
  });

  //Display a success message
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: 'Account created successfully!  Please log in!'
  });
});