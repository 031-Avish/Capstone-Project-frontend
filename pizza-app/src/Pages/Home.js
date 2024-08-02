import './CSS/Home.css';
import {BuyNowButton} from '../Components/BuyNowButton';
import logo from '../Components/Media/bg.jpg';
import { useContext } from 'react';
import AuthContext
 from '../store/auth-context';

function HomePageContent() {
    const authContext = useContext(AuthContext);
    console.log(authContext);
    return (
        <div className="homepage__content p-5">
            <div className="homepage__content__title">
                <div className="text-6xl font-bold my-5">
                    Order Your
                </div>
                <div className="text-6xl font-light my-5">
                    Favourite Pizza    
                </div>
            </div>
            <div className="homepage__content__subtitle text-md my-5">
                <div className="my-2">
                We are celebrating the return of a fan-favourite Pizza <br />
                    alongside fresh new flavors.
                </div>
                <div className="my-2">
                    Order and <span className='font-hurricane'>enjoy!</span>
                </div>
            </div>
            {
                authContext.user.role !== 'Admin'
                &&
                <div className='buyNowButton'>
                    <BuyNowButton />
                </div>
            }
    </div>
    )
}


export default function Home() {
    return (
        <>
    
             <div className="
      homepage
      h-screen  // Changed to h-screen to take full viewport height
      bg-cover
      bg-center
      bg-no-repeat
      flex
      
      
      md:items-center 
      ml-12
    "
      style={{ backgroundImage: `url(${logo})` }}
    >
      <HomePageContent />
     
    </div>

           
        </>
    )
}