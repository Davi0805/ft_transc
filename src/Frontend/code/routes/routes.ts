import { HomePage } from '../pages/home'
import { PlayPage } from '../pages/play/play'
import { LoginPage } from '../pages/login/login'
import { NotFoundPage } from '../pages/404'
import { ProfilePage  } from '../pages/profile'
import { RegisterPage } from '../pages/register'
import { SettingsPage } from '../pages/settings/settings'
import { LobbyPage } from '../pages/play/lobby'
import { CreateLobbyPage } from '../pages/play/createLobby'
import { MatchPage } from '../pages/play/match'
import { TournamentPage } from '../pages/play/tournament'

export interface Route {
    path: string;
    title: string;
    template: any;
    script?: any;
}

//? template is the function that returns the base html
//? script is the page-sepecific logic
//? list of routes objects with the path, title, template and script
export const routes: Array<Route> = [
    // Home
    {
        path: '/',
        title: 'Home',
        template: HomePage.template,
        script: HomePage
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
    {
        path: '/create-lobby',
        title: 'Create Lobby',
        template: CreateLobbyPage.template,
        script: CreateLobbyPage
    },
    {
        path: '/lobby',
        title: 'Lobby',
        template: LobbyPage.template,
        script: LobbyPage
    },
    {
        path: '/tournament',
        title: 'Tournament',
        template: TournamentPage.template,
        script: TournamentPage
    },
    {
        path: '/match',
        title: 'Match',
        template: MatchPage.template,
        script: MatchPage
    }
    //? additional pages would be put here
];