document.addEventListener('DOMContentLoaded', function () {
    var modeSwitch = document.querySelector('.mode-switch');
  
    modeSwitch.addEventListener('click', function () {                     document.documentElement.classList.toggle('dark');
      modeSwitch.classList.toggle('active');
    });
    
    var listView = document.querySelector('.list-view');
    var gridView = document.querySelector('.grid-view');
    var projectsList = document.querySelector('.project-boxes');
    
    listView.addEventListener('click', function () {
      gridView.classList.remove('active');
      listView.classList.add('active');
      projectsList.classList.remove('jsGridView');
      projectsList.classList.add('jsListView');
    });
    
    gridView.addEventListener('click', function () {
      gridView.classList.add('active');
      listView.classList.remove('active');
      projectsList.classList.remove('jsListView');
      projectsList.classList.add('jsGridView');
    });
    
    document.querySelector('.messages-btn').addEventListener('click', function () {
      document.querySelector('.messages-section').classList.add('show');
    });
    
    document.querySelector('.messages-close').addEventListener('click', function() {
      document.querySelector('.messages-section').classList.remove('show');
    });
  });


function updateMoreOptions(){
  // Select all more buttons and corresponding more options menus
const moreBtns = document.querySelectorAll('.project-btn-more');
const moreOptionsMenus = document.querySelectorAll('.more-options');

// Loop through each more button and attach an event listener
moreBtns.forEach(function(moreBtn, index) {
    const moreOptions = moreOptionsMenus[index];

    moreBtn.addEventListener('click', function() {
        // Toggle the display of the corresponding more options menu
        if (moreOptions.style.display === 'block') {
            moreOptions.style.display = 'none';
        } else {
            moreOptions.style.display = 'block';
        }
    });
});

// Optional: Close the more options menus if clicked outside
document.addEventListener('click', function(event) {
    moreBtns.forEach(function(moreBtn, index) {
        const moreOptions = moreOptionsMenus[index];
        
        if (!moreBtn.contains(event.target) && !moreOptions.contains(event.target)) {
            moreOptions.style.display = 'none';
        }
    });
});

}

