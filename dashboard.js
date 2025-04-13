/* This is where we dynamically load the content for the dashboard */

const contentMap = {
    profile: `
        <h1>Profile:</h1>
        <div style="text-align: center; margin-top: 20px;">
            <img src="/images/defaultProfile.png" alt="Profile Picture" style="max-width: 200px; height: 150px; border-radius: 50%;">
            <h1 class="mt-2">John Doe</h1>
            <div class="row mt-3 fs-4 justify-content-center">
                <div class="col-md-5">
                    <p>Username: johndoe</p>
                </div>
                <div class="col-md-5">
                    <p>T-Number: T12345678</p>
                </div>
            </div>
            <div class="row mt-3 fs-4 justify-content-center">
                <div class="col-md-5">
                    <p>Email: johndoe@ourteam.com</p>
                </div>
                <div class="col-md-5">
                    <p>Phone: (123) 456-7890</p>
                </div>
            </div>
            <div class="row mt-3 fs-4 justify-content-center">
                <div class="col-md-5">
                    <p>Major: Computer Science</p>
                </div>
                <div class="col-md-5">
                    <p>Minor(s): Mathematics</p>
                </div>
            </div>
            <div class="row mt-3 fs-4 justify-content-center">
                <div class="col-md-5">
                    <p>Instructor of 2 classes</p>
                </div>
                <div class="col-md-5">
                    <p>Member of 5 classes</p>
                </div>
            </div>
            <div class="row mt-3 fs-4 justify-content-center">
                <div class="col-md-5">
                    <p>Primary work location: Bruner 543</p>
                </div>
                <div class="col-md-5">
                    <p>Primary available hours: MWF 2-4 PM</p>
                </div>
            </div>
            <p class="fs-4 mt-3">Bio: Aspiring software engineer with a passion for web development.</p>
            <button class="btn btn-primary mt-3 fs-3 me-3" id="editProfileBtn">Edit Profile</button>
            <button class="btn btn-danger mt-3 fs-3" id="deleteProfileBtn">Delete Profile</button>
        </div>
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
