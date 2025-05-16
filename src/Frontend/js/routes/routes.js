import { HomePage } from '../pages/home.js'
import { PlayPage } from '../pages/play.js'
import { LoginPage } from '../pages/login.js'
import { NotFoundPage } from '../pages/404.js'

//? template is the function that returns the html
//? script is the page-sepecific logic
//! this export here could be at the end just export routes?
//! how does this import work and whats the diference between import and require
//! could i even use require the same way?
// list of routes objects with the path, title, template and script
export const routes = [
    // Home
    {
        path: '/',
        title: 'Home',
        template: HomePage.template,
        script: HomePage
    },
    // Play
    {
        path: '/play',
        title: 'Play',
        template: PlayPage.template,
        script: PlayPage
    },
    // Login
    {
        path: '/login',
        title: 'Login',
        template: LoginPage.template,
        script: LoginPage
    },
    // Not Foumd
    {
        path: '/404',
        title: 'Not Found',
        template: NotFoundPage.template,
        script: NotFoundPage
    }
    //? additional pages would be put here
];