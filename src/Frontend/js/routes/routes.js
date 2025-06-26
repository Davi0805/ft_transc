import { HomePage } from '../pages/home.js'
import { PlayPage } from '../pages/play/play.js'
import { LoginPage } from '../pages/login/login.js'
import { NotFoundPage } from '../pages/404.js'
import { ProfilePage  } from '../pages/profile.js'
import { RegisterPage } from '../pages/register.js'
import { AboutUsPage } from '../pages/about.js'
import { SettingsPage } from '../pages/settings/settings.js'
import { CreateFriendlyPage } from '../pages/play/createFriendly.js'
import { CreateRankedPage } from '../pages/play/createRanked.js'
import { CreateTournamentPage } from '../pages/play/createTournament.js'


//? template is the function that returns the base html
//? script is the page-sepecific logic
//? list of routes objects with the path, title, template and script
export const routes = [
    // Home
    {
        path: '/',
        title: 'Home',
        template: HomePage.template,
        script: HomePage
    },
    // About Us
    {
        path: '/about',
        title: 'About Us',
        template: AboutUsPage.template,
        script: AboutUsPage
    },
    // Match center
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
    // register
    {
        path: '/register',
        title: 'Register',
        template: RegisterPage.template,
        script: RegisterPage
    },
    // Settings
    {
        path: '/settings',
        title: 'Settings',
        template: SettingsPage.template,
        script: SettingsPage
    },
    // Profile
    {
        path: '/profile',
        title: 'Profile',
        template: ProfilePage.template,
        script: ProfilePage
    },   
    // Not Found
    {
        path: '/404',
        title: 'Not Found',
        template: NotFoundPage.template,
        script: NotFoundPage
    },
    // ROUTES INSIDE PLAY LOGIC
    // Create friendly match lobby
    {
        path: '/create-friendly',
        title: 'Create Friendly Match',
        template: CreateFriendlyPage.template,
        script: CreateFriendlyPage
    },
    // Create ranked match lobby
    {
        path: '/create-ranked',
        title: 'Create Ranked Match',
        template: CreateRankedPage.template,
        script: CreateRankedPage
    },
    // Create Tournament lobby
    {
        path: '/create-tournament',
        title: 'Create Tournament',
        template: CreateTournamentPage.template,
        script: CreateTournamentPage
    }

    //? additional pages would be put here
];