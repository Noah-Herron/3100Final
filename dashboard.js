/* This is where we dynamically load the content for the dashboard */

const contentMap = {
    profile: async () => {
        const profileResponse = await fetch('/dashboardFiles/profile.html');
        return await profileResponse.text();
    },
    activity: async () => {
        const activityResponse = await fetch('/dashboardFiles/activity.html');
        return await activityResponse.text();
    },
    classes: `
        <h2>Classes</h2>
        <p>This is your classes section.</p>
    `,
    assignments: `
        <h2>Assignments</h2>
        <p>This is your assignments section.</p>
    `,
    messages: `
        <h2>Messages</h2>
        <p>This is your messages section.</p>
    `,
    resources: `
        <h2>Resources</h2>
        <p>This is your resources section.</p>
    `,
    grades: `
        <h2>Grades</h2>
        <p>This is your grades section.</p>
    `,
    calendar: `
        <h2>Calendar</h2>
        <p>This is your calendar section.</p>
    `,
    settings: `
        <h2>Settings</h2>
        <p>This is your settings section.</p>
    `,
};

async function loadContent(page) {
    const contentLoader = contentMap[page] || '<p>Page not found.</p>';
    
    let content;
    if (typeof contentLoader === 'function') {
        content = await contentLoader();
    } else {
        content = contentLoader;
    }
    document.getElementById('main-content').innerHTML = content;

    if (page === 'activity') {
        addActivityListeners();
    }
}

function addActivityListeners() {
    const addActivityButton = document.getElementById('addActivityButton');
    const addActivityCard = document.getElementById('addActivityCard');
    const closeAddActivityCard = document.getElementById('closeAddActivityCard');

    addActivityButton.addEventListener('click', () => {
        console.log('Add Activity button clicked');
        addActivityCard.style.display = 'block';
    });
    
    closeAddActivityCard.addEventListener('click', () => {
        addActivityCard.style.display = 'none';
    });
}

document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', async function (e) {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        loadContent(page);
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    loadContent('profile'); // Load the default page
});