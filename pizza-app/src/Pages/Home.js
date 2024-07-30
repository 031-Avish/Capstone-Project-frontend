import './CSS/Home.css';
import {BuyNowButton} from '../Components/BuyNowButton';

import {Footer} from '../Components/Footer';
import { useContext } from 'react';
import AuthContext
 from '../store/auth-context';

export default function Home() {
    const authContext = useContext(AuthContext);
    return (
        <div className="homepage__content p-5">
            
        </div>
    )
}