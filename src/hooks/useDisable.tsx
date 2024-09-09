import { useEffect } from 'react'

 
export default function useDisable(disableCallback:()=> void) {
    
  useEffect(() => {
    window.addEventListener("mouseover", async () => {
      setTimeout(disableCallback, 100);
    });

    return () => {
      window.addEventListener("mouseover", async () => {
        setTimeout(disableCallback, 100);
      });
    };
  }, []);
 
}
