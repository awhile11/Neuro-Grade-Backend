
    import { db } from '../firebase-init.js'; // make sure this path is correct
    import { displayTests, getCurrentTeacher, getTestsByTeacherUID, getTestsByTitle } from '../auth-service.js'
    import { collection, addDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
    import {fetch} from '../home.js';
    document.addEventListener('DOMContentLoaded', async () => {
        let tests = [];
        const addQuestionBtn = document.getElementById('add-question-btn'); // Button to add question
        const questionsList = document.querySelector('.questions-list'); // Container for questions
        const generateTestBtn = document.getElementById('generate-test-btn'); // AI generate button
        const aiTestBtn = document.getElementById('ai-test-btn'); // AI modal open button
        const aiTestModal = document.getElementById('ai-test-modal'); // AI modal element
        const closeModalBtn = document.getElementById('close-modal'); // Close modal button
        const saveTestBtn = document.getElementById('save-test-btn'); // Save test button
        const menuToggle = document.getElementById('menu-toggle'); // Menu toggle button
        const sidebar = document.getElementById('sidebar'); // Sidebar element
        const testTitleInput = document.getElementById('testSearch'); // Test search input
        const testsList = document.querySelector('.tests'); // The container for test items
        const searchBtn = document.getElementById('searchBtn'); // Search button
        const testNameInput = document.getElementById('test-name'); // Test name input
        const testDescriptionInput = document.getElementById('test-description'); // Test description input
        
        let questionCount = 0;
        //let questionsState = []; // stores all questions
        
        let questionsState = JSON.parse(localStorage.getItem('questionsState') || '[]');// Load from localStorage or initialize empty
        // Fetch existing tests
        tests = await getTestsByTeacherUID();
        displayTests(tests);
        // Load questions state from localStorage
        questionsState.forEach((content, index) => {
            const qItem = createQuestionItem(`QUESTION ${index + 1}`, content);
            questionsList.appendChild(qItem);
        });
        // --- Sidebar toggle ---
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // --- Test item click to view details ---
        testsList.addEventListener('click', function (event) {
            const target = event.target.closest('.test-item');
            if (target) {
                const testId = target.dataset.testId;
                const activeTestItem = testsList.querySelector('.test-item.active');
                if (activeTestItem) {
                    activeTestItem.classList.remove('active');
                }
                target.classList.add('active'); // Assuming you set data-test-id in the HTML
                fetchTestDetails(testId);
            }
        });

        // --- Open AI modal ---
        aiTestBtn.addEventListener('click', e => {
            e.preventDefault();
            aiTestModal.classList.add('active');
        });

        // --- Close AI modal ---
        closeModalBtn.addEventListener('click', e => {
            e.preventDefault();
            aiTestModal.classList.remove('active');
        });

    // --- Generate AI questions ---
    generateTestBtn.addEventListener('click', async e => {
        e.preventDefault();
        const count = parseInt(document.getElementById('question-count').value) || 10;
        const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value || 'medium';
        const topic = document.getElementById('topic-input')?.value || 'general';
        const types = Array.from(document.querySelectorAll('input[name="question-types"]:checked')).map(el => el.value);

        generateTestBtn.disabled = true;
        generateTestBtn.textContent = 'Generating...';

        try {
           const response = await fetch('http://127.0.0.1:8000/tests_api/generate-test/', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ count, difficulty, types ,topic})
            });

            if (!response.ok) throw new Error('AI generation failed');

            const data = await response.json();
            questionsList.innerHTML = '';
            questionsState = [];

            data.questions.forEach(q => {
                questionCount++;
                const qItem = createQuestionItem(`QUESTION ${questionCount}`, q.content);
                questionsList.appendChild(qItem);
                questionsState.push(q.content);
            });

            localStorage.setItem('questionsState', JSON.stringify(questionsState));
            aiTestModal.classList.remove('active');
        } catch (err) {
            alert('Error generating questions: ' + err.message);
        } finally {
            generateTestBtn.disabled = false;
            generateTestBtn.textContent = 'GENERATE TEST';
        }
    });

    // --- Track question edits ---
    questionsList.addEventListener('input', e => {
        if (e.target.tagName === 'TEXTAREA') {
            const idx = Array.from(questionsList.querySelectorAll('textarea')).indexOf(e.target);
            questionsState[idx] = e.target.value;
            localStorage.setItem('questionsState', JSON.stringify(questionsState));
        }
    });

        // --- Search tests by title on button click ---
        searchBtn.addEventListener('click', async () => {
            const query = testTitleInput.value.toLowerCase(); // Get the search input and make it lowercase for case-insensitive search

            // If no search term, just display all tests
            if (query === '') {
                displayTests(tests); // Display all tests
                return;
            }

            // If there is a query, filter the tests
            if (Array.isArray(tests)) {
                const filteredTests = tests.filter(test =>
                    test.name.toLowerCase().includes(query) || 
                    test.description.toLowerCase().includes(query)
                );

                if (filteredTests.length === 0) {
                    displayNoTestsMessage(); // Show "No tests available" if no tests match the query
                } else {
                    displayTests(filteredTests); // Display filtered tests
                }
            } else {
                console.error("Tests is not an array or is undefined");
            }
        });

        // --- Function to display tests ---
        function displayTests(tests) {
            testsList.innerHTML = ''; // Clear current displayed tests

            if (tests.length > 0) {
                tests.forEach(test => {
                    const testDiv = document.createElement('div');
                    testDiv.classList.add('test-item');
                    testDiv.id = `test-${test.id}`;
                    testDiv.dataset.testId = test.id; // Store test ID for use when clicked
                    testDiv.innerHTML = `
                        <div class="test-info">
                            <h4>${test.name}</h4>
                            <small>${test.description || 'No description available.'}</small>
                            <small>Created at: ${test.created_at ? new Date(test.created_at.seconds * 1000).toLocaleDateString() : 'N/A'}</small>
                        </div>
                    `;
                    testsList.appendChild(testDiv);
                });
            } else {
                displayNoTestsMessage(); // If no tests, show message
            }
        }

        // --- Function to display "No tests available" message ---
        function displayNoTestsMessage() {
            testsList.innerHTML = '<p>No tests available</p>';
        }

        // --- Function to save or update a test ---
        saveTestBtn.addEventListener('click', async e => {
            e.preventDefault();

            const testName = document.getElementById('test-name').value.trim();
            const testDesc = document.getElementById('test-description').value.trim();
            if (!testName) return alert('Enter test name');

            if (!questionsState.length) return alert('No questions to save!');

            const questionsToSave = questionsState.map((content, idx) => ({
                order: idx + 1,
                content
            }));
            const teacherUID = localStorage.getItem("teacherUID"); // Get teacher UID from localStorage

            if (!teacherUID) return alert("Teacher not logged in!");

            try {
                // Save to Firebase
                const docRef = await addDoc(collection(db, "tests"), {
                    name: testName,
                    description: testDesc,
                    questions: questionsToSave,
                    teacherUID: teacherUID,
                    created_at: new Date()
                });

                // Save to Django first
                const response = await fetch('http://127.0.0.1:8000/tests_api/save-test/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: testName,
                        description: testDesc,
                        questions: questionsToSave
                    })
                });
                if (!response.ok) throw new Error('Save failed');

                const result = await response.json();
                alert('Test saved successfully to Django!');

                console.log('Saved Firebase doc ID:', docRef.id);
                alert('Test also saved to Firebase!');

                // Clear localStorage & DOM
                localStorage.removeItem('questionsState');
                questionsList.innerHTML = '';
                questionsState = [];
                displayTests(tests);
            } catch (err) {
                console.error('Error saving test:', err);
                alert('Error saving test. Check console.');
            }
        });

        // --- Helper to create question DOM ---
        function createQuestionItem(title, content) {
            const div = document.createElement('div');
            div.classList.add('question-item');

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('question-title');
            titleDiv.innerHTML = `<h3>${title}</h3>`;

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('question-content');
            const textarea = document.createElement('textarea');
            textarea.placeholder = "Enter question content";
            textarea.value = content;
            contentDiv.appendChild(textarea);

            div.appendChild(titleDiv);
            div.appendChild(contentDiv);

            return div;
        }

        // Fetch test detailss
        async function fetchTestDetails(testId) {
            try {
                const testData = await getTestFromDatabase(testId); // Fetch the  test data

                // Populate the test creation form
                testNameInput.value = testData.name;
                testDescriptionInput.value = testData.description;
                questionsList.innerHTML = '';

                // Populate questions
                testData.questions.forEach((question, index) => {
                    const questionItem = document.createElement('div');
                    questionItem.classList.add('question-item');
                    questionItem.innerHTML = `
                        <div class="question-title">
                            <h3>QUESTION ${index + 1}</h3>
                        </div>
                        <div class="question-content">
                            <textarea placeholder="Enter question content">${question.content}</textarea>
                        </div>
                    `;
                    questionsList.appendChild(questionItem);
                });
            } catch (error) {
                console.error('Error fetching test details:', error);
            }
        }

        async function getTestFromDatabase(testId) {
            try {
                const testRef = doc(db, "tests", testId);
                const testSnap = await getDoc(testRef);

                if (!testSnap.exists()) {
                    throw new Error("Test not found!");
                }

                return testSnap.data(); // Return the test data
            } catch (error) {
                console.error("Error fetching test from database:", error);
                throw error;
            }
        }
    });

