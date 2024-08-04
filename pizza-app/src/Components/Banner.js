import logo from './Media/logo.png';
export  function Banner(){
    return(
        <div className="banner flex justify-items-center items-center">
            <img src={logo} height={60} width={100} alt='banner pizza' />
        </div>
    );
}