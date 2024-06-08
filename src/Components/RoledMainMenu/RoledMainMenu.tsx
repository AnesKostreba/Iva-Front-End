import { MainMenuItem, Menu } from "../MainMenu/Menu";

interface RoledMainMenuProperties{
    role: 'user' | 'administrator' | 'visitor';
}

export const RoledMainMenu :React.FC<RoledMainMenuProperties> = ({role}) =>{
    const getUserMenuItems = ():MainMenuItem[] =>{
        return [
            {text: 'Home', link: '/'},
            {text: 'Kontakt', link: '/contact'},
            {text: 'My Orders', link: '/user/orders/'},
            {text: 'Log out', link: '/user/logout/'},
        ];
    }

    const getAdminMenuItems = ():MainMenuItem[] =>{
        return [
            {text: 'Dashboard', link: '/administrator/dashboard'},
            {text: 'Log out', link: '/administrator/logout'},
        ];
    }

    const getVisitorMenuItems = ():MainMenuItem[] =>{
        return [
            {text: 'Administrator Login', link: '/administrator/login/'}
        ];
    }

    let items: MainMenuItem[] = [];

    switch(role){
        case 'user':
            items = getUserMenuItems();
            break;
        case 'administrator':
            items = getAdminMenuItems();
            break;
        case 'visitor':
            items = getVisitorMenuItems();
            break;
        default:
            items = [];
            break;
    }


    return(
        <Menu items={items}></Menu>
    )
}