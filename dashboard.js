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
    assignments: async () => {
        const classesResponse = await fetch('/dashboardFiles/assignments.html');
        return await classesResponse.text();
    },
    groups: async () => {
        const classesResponse = await fetch('/dashboardFiles/groups.html');
        return await classesResponse.text();
    },
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

    if (page === 'assignments') {
        addAssignmentListeners();
    }

    if (page === 'groups') {
        addAssignmentListeners();
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
    const submitJoinClassButton = document.getElementById('submitJoinClassButton');
    const submitCreateClassButton = document.getElementById('submitClassButton');

    addClassButton.addEventListener('click', () => {
        addClassCard.style.display = 'block';
    });
    
    closeAddClassCard.addEventListener('click', () => {
        addClassCard.style.display = 'none';
    });

    submitJoinClassButton.addEventListener('click', async () => {
        const classCode = document.getElementById('classCode').value;

        if (classCode) {
            await Swal.fire({
                icon: 'success',
                title: 'Class Joined',
                text: `You have joined the class with code "${classCode}".`,
            });
            addClassCard.style.display = 'none';
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter a class code.',
            });
        }
    });

    submitCreateClassButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const title = document.getElementById('classTitle').value;
        const type = document.getElementById('classTypeSelect').value;
        const className = document.getElementById('classClassSelect').value;
        const potedDate = document.getElementById('classPostedDate').value;
        const dueDate = document.getElementById('classDueDate').value;
        const description = document.getElementById('classDescription').value;

        if(title && type && className && potedDate && dueDate && description) {
            await Swal.fire({
                icon: 'success',
                title: 'Class Created',
                text: `Class "${className}" has been created.`,
            });
            addClassCard.style.display = 'none';
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all fields.',
            });
        }

        document.getElementById('classForm').reset;
    });

    document.querySelectorAll('.class-card').forEach((card) => {
        card.addEventListener('click', async (e) => {
            e.preventDefault();

            const classId = card.getAttribute('data-class-id');

            const res = await fetch('/dashboardFiles/individualClass.html');
            const html = await res.text();

            const main = document.getElementById('main-content');
            main.innerHTML = html;

            const addStudentBtn = document.getElementById('btnAddStudents');
            if (addStudentBtn) {
                addStudentBtn.addEventListener('click', async () => {
                    await Swal.fire({
                        icon: 'info',
                        title: 'Add Students',
                        text: 'Student Code: TNTECH-CSC-3100-001-12345'
                });
            })};

            const addGroupBtn = document.getElementById('btnAddGroups');
            if (addGroupBtn) {
                addGroupBtn.addEventListener('click', async () => {
                    await Swal.fire({
                        icon: 'info',
                        title: 'Add Groups',
                        text: 'Group Code: TNTECH-CSC-3100-001-G1-12345'
                });
            })};

            const backButton = document.getElementById('backButton');
            if (backButton) {
                backButton.addEventListener('click', () => {
                    loadContent('classes');
                });
            }
        });
    });
}

function addAssignmentListeners() {
    const addAssignmentButton = document.getElementById('addAssignmentButton');
    const addAssignmentCard = document.getElementById('addAssignmentCard');
    const closeAddAssignmentCard = document.getElementById('closeAddAssignmentCard');
    const submitAssignmentButton = document.getElementById('submitAssignmentButton');

    addAssignmentButton.addEventListener('click', () => {
        addAssignmentCard.style.display = 'block';
    });

    closeAddAssignmentCard.addEventListener('click', () => {
        addAssignmentCard.style.display = 'none';
    });

    //Dynamic Question Type Handling
    const numQuestionsInput = document.getElementById('numQuestions');
    const questionContainer = document.getElementById('questionContainer');

    numQuestionsInput.addEventListener('input', () => {
        const numQuestions = parseInt(numQuestionsInput.value);
        questionContainer.innerHTML = ''; // Clear previous questions

        for (let i = 0; i < numQuestions; i++) {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-block border p-3 mb-3 rounded';

            questionDiv.innerHTML = `
                <h5>Question ${i+1}</h5>
                <div class="form-group mb-2">
                    <label>Type</label>
                    <select class="form-control question-type">
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="short-answer">Short Answer</option>
                    </select>
                </div>
                <div class="form-group mb-2">
                    <label>Question</label>
                    <input type="text" class="form-control question-text" placeholder="Enter question text">
                </div>
                <div class="mc-section d-none">
                    <label>Number of Options</label>
                    <input type="number" class="form-control num-options" min="2" placeholder="Enter number of options">
                    <div class="mc-options"></div>
                </div>
            `;

            questionContainer.appendChild(questionDiv);

            const typeSelect = questionDiv.querySelector('.question-type');
            const mcSection = questionDiv.querySelector('.mc-section');
            const numOptionsInput = questionDiv.querySelector('.num-options');
            const mcOptionsContainer = questionDiv.querySelector('.mc-options');

            typeSelect.addEventListener('change', () => {
                if (typeSelect.value === 'multiple-choice') {
                    mcSection.classList.remove('d-none');
                } else {
                    mcSection.classList.add('d-none');
                    mcOptionsDiv.innerHTML = ''; // Clear options if switching to short answer
                }
            });

            numOptionsInput.addEventListener('input', () => {
                const numOptions = parseInt(numOptionsInput.value);
                mcOptionsContainer.innerHTML = ''; // Clear previous options

                for (let j = 1; j <= numOptions; j++) {
                    const optionDiv = document.createElement('input');
                    optionDiv.type = 'text';
                    optionDiv.className = 'form-control mb-1';
                    optionDiv.placeholder = `Option ${j}`;
                    mcOptionsContainer.appendChild(optionDiv);
                }
            });
        }
    });

    submitAssignmentButton.addEventListener('click', async () => {
        const assignmentTitle = document.getElementById('assignmentTitle').value;
        const questionBlocks = questionsContainer.querySelectorAll('.question-block');

        if (!assignmentTitle || questionBlocks.length === 0) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all fields.',
            });
            return;
        }

        const questions = [];

        for (let block of questionBlocks) {
            const type = block.querySelector('.question-type').value;
            const text = block.querySelector('.question-text').value;
            let options = [];

            if (type === 'multiple-choice') {
                const optionInputes = block.querySelectorAll('.mc-options input');
                options = Array.from(optionsInputs).map(option => option.value.trim()).filter(Boolean);

                if(options.length < 2) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Multiple choice questions must have at least 2 options.',
                    });
                    return;
                }
            }

            if(!text) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please fill in all fields.',
                });
                return;
            }

            questions.push({ type, text, options });
        }

        await Swal.fire({
            icon: 'success',
            title: 'Assignment Created',
            text: `Assignment "${assignmentTitle}" has been created.`,
        });

        addAssignmentCard.style.display = 'none';
    });

    document.querySelectorAll('.class-card').forEach((assignment) => {
        console.log('Assignment card clicked');
        assignment.addEventListener('click', async (e) => {
            e.preventDefault();

            const assignmentId = assignment.getAttribute('data-class-id');

            const res = await fetch('/dashboardFiles/individualAssignment.html');
            const html = await res.text();

            const main = document.getElementById('main-content');
            main.innerHTML = html;

            const backButton = document.getElementById('backButton');
            if (backButton) {
                backButton.addEventListener('click', () => {
                    loadContent('assignments');
                });
            }
        });
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