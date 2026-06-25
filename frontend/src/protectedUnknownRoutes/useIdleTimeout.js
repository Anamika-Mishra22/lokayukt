import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
const useIdleTimeout = (timeoutInMs) => {
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    // Timer reset karne ka function
   const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.log("User inactive for too long. Clearing ALL session data...");
        
        // 🚨 Saara local storage ek hi jhatke me saaf
        Cookies.clear();
        
        // Login page pe bhej do aur history replace kar do
        navigate('/login', { replace: true }); 
      }, timeoutInMs);
    };
    // Events jo user activity darshate hain
    const events = [
      'mousemove',
      'keydown',
      'wheel',
      'DOMMouseScroll',
      'mouseWheel',
      'mousedown',
      'touchstart',
      'touchmove',
      'MSPointerDown',
      'MSPointerMove',
    ];

    // Har event par listener lagao
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Pehli baar timer start karne ke liye
    resetTimer();

    // Cleanup function: Component unmount hone par listeners hatao
    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [navigate, timeoutInMs]); 
};

export default useIdleTimeout;