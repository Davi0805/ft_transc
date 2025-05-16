import { HomePage } from '../pages/home.js'
import { PlayPage } from '../pages/play.js'
import { LoginPage } from '../pages/login.js'
import { NotFoundPage } from '../pages/404.js'

// list of routes objects with the path, title, template and script
export const routes = [
    // Home
    {
        path: '/',                      // URL path
        title: 'Home',                  // Page title
        template: HomePage.template,    // function that returns the html
        script: HomePage                // page specific logic/behaviour
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