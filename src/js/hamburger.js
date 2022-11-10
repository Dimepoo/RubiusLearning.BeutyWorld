const body = document.querySelector('body');

window.onload = () => { 

    const hamburgerBtn = document.querySelector('.hamburger-navigation__toggle').querySelector("input");
    const mobileMenu = document.querySelector('.hamburger-navigation__menu');

    hamburgerBtn.addEventListener('change', (event) => { 

        if(event.target.checked)
        {
            mobileMenu.classList.add('visible');
            disableScroll();
        }
        else
        {
            mobileMenu.classList.remove('visible'); 
            enableScroll();
        } 
    }); 
  };

  const disableScroll = () => body.classList.add('noscroll');

  const enableScroll = () =>  body.classList.remove('noscroll');

 