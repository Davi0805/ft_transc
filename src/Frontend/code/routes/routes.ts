import { HomePage } from '../pages/home'
import { PlayPage } from '../pages/play/play'
import { LoginPage } from '../pages/login/login'
import { NotFoundPage } from '../pages/404'
import { ProfilePage  } from '../pages/profile'
import { RegisterPage } from '../pages/register'
import { AboutUsPage } from '../pages/about'
import { SettingsPage } from '../pages/settings/settings'
import { LobbyFriendlyPage } from '../pages/play/lobbyFriendly'
import { LobbyRankedPage } from '../pages/play/lobbyRanked'
import { LobbyTournamentPage } from '../pages/play/lobbyTournament'
import { CreateLobbyPage } from '../pages/play/createLobby'

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
    {
        path: '/create-lobby',
        title: 'Create Lobby',
        template: CreateLobbyPage.template,
        script: CreateLobbyPage
    },
    // Create friendly match lobby
/*     {
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
    }, */
    // Lobby for friendly match
    {
        path: '/lobby-friendly',
        title: 'Friendly Match Lobby',
        template: LobbyFriendlyPage.template,
        script: LobbyFriendlyPage
    },
    // Lobby for ranked match
    {
        path: '/lobby-ranked',
        title: 'Ranked Match Lobby',
        template: LobbyRankedPage.template,
        script: LobbyRankedPage
    },
    // Lobby for tournament
    {
        path: '/lobby-tournament',
        title: 'Tournament Lobby',
        template: LobbyTournamentPage.template,
        script: LobbyTournamentPage
    }
    //? additional pages would be put here
];