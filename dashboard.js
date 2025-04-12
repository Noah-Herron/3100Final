/* This is where we dynamically load the content for the dashboard */

const contentMap = {
    profile: `
        <h2>Profile</h2>
        <p>This is your profile section.</p>
    `,
    activity: `
        <h2>Activity</h2>
        <p>This is your activity section.</p>
    `,
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

document.querySelectorAll('[data-page]').forEach((link) => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const page = this.getAttribute('data-page');
        const content = contentMap[page] || '<p>Page not found.</p>';
        document.getElementById('main-content').innerHTML = content;
    });
});
