1. Visiting an video streaming platform and making video fullscreen too fast will make extension do nothing.
  - That is related to the page load time. 
  - Extension gets the settings from the storage rather quickly, but `content-script` must be injected first.
  - Going out of fullscreen and back in (page is probably loaded by then) will work just fine.
  - SOLUTION: { WAIT FOR PAGE TO LOAD, NOTHING CAN BE DONE }
