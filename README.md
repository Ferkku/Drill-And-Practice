# Project 2: Drill-And-Practice

## About
Created as a part of the FiTech Web Software Development course (completed summer 2023)
https://fitech101.aalto.fi/web-software-development/

This app allows users to add topics with questions and answers. These questions can then be used for repeated practice of learned content in the quiz section. The app requires registration for most features. Only admins can add topics. You can test admin privileges by logging in with email: "admin@admin.com" and password: "123456"

## API
The app allows asking for and answering random questions through its API.
* GET requests to the path ```/api/questions/random``` return a randomly selected question.
* POST requests to the path ```/api/questions/answer``` with a JSON document that contains question id and option id is used to answer questions.

## Running
To run the application locally, navigate to the root of the project folder and run:
```
docker-compose up
```
The app can be accessed at http://localhost:7777

## Testing
To run the automated tests for the app use the following command:
```
docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf
```
