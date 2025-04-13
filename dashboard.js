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
    classes: async () => {
        const classesResponse = await fetch('/dashboardFiles/classes.html');
        return await classesResponse.text();
    },
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

    if (page === 'classes') {
        addClassListeners();
    }
}

function addActivityListeners() {
    const addActivityButton = document.getElementById('addActivityButton');
    const addActivityCard = document.getElementById('addActivityCard');
    const closeAddActivityCard = document.getElementById('closeAddActivityCard');
    const submitActivityButton = document.getElementById('submitActivityButton');

    addActivityButton.addEventListener('click', () => {
        console.log('Add Activity button clicked');
        addActivityCard.style.display = 'block';
    });
    
    closeAddActivityCard.addEventListener('click', () => {
        addActivityCard.style.display = 'none';
    });

    submitActivityButton.addEventListener('click', async () => {
        const activityTitle = document.getElementById('activityTitle').value;
        const activityType = document.getElementById('activityTypeSelect').value;
        const activityClass = document.getElementById('activityClassSelect').value;
        const activityPostedDate = document.getElementById('activityPostedDate').value;
        const activityEndDate = document.getElementById('activityDueDate').value;
        const activityDescription = document.getElementById('activityDescription').value;

        if (activityTitle && activityType && activityClass && activityPostedDate && activityEndDate && activityDescription) {
            await Swal.fire({
                icon: 'success',
                title: 'Activity Added',
                text: `Activity "${activityName}" has been added.`,
            });
            addActivityCard.style.display = 'none';
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all fields.',
            });
        }
    });
};

function addClassListeners() {
    const addClassButton = document.getElementById('addClassButton');
    const addClassCard = document.getElementById('addClassCard');
    const closeAddClassCard = document.getElementById('closeAddClassCard');
    const submitClassButton = document.getElementById('submitClassButton');

    addClassButton.addEventListener('click', () => {
        console.log('Add Class button clicked');
        addClassCard.style.display = 'block';
    });
    
    closeAddClassCard.addEventListener('click', () => {
        addClassCard.style.display = 'none';
    });

    submitClassButton.addEventListener('click', async () => {
        const className = document.getElementById('className').value;
        const classCode = document.getElementById('classCode').value;
        const classDescription = document.getElementById('classDescription').value;

        if (className && classCode && classDescription) {
            await Swal.fire({
                icon: 'success',
                title: 'Class Added',
                text: `Class "${className}" has been added.`,
            });
            addClassCard.style.display = 'none';
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all fields.',
            });
        }
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